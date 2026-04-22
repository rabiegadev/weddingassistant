"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { slugify } from "@/lib/slugify";
import { writeAuditLog } from "./audit";

const pkg = z.object({
  id: z.string().max(32).optional(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(20000),
  priceCents: z.coerce.number().int().min(0).max(1_000_000_00),
  features: z
    .string()
    .min(1)
    .refine(
      (s) => {
        try {
          JSON.parse(s) as unknown;
          return true;
        } catch {
          return false;
        }
      },
      "featuresJson: podaj prawidłowy JSON (tablica cech albo obiekt)."
    ),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isPublished: z.coerce.boolean().optional().default(true),
});

export type PkgState = { error?: string; ok?: boolean } | void;

function parseFeaturesJson(s: string): string {
  const o = JSON.parse(s) as unknown;
  if (o === null || o === undefined) {
    return "{}";
  }
  return JSON.stringify(o);
}

/**
 * Utworzenie lub edycja pakietu; jeden katalog: od razu odzwierciedlony w /cennik.
 */
export async function savePackageAction(_: PkgState, formData: FormData): Promise<PkgState> {
  const s = await getFullAdminSession();
  if (!s) {
    return { error: "Brak uprawnień." };
  }
  const pub = formData.get("isPublished");
  const isOn = pub === "on" || pub === "true" || pub === "1";
  const raw = {
    id: (formData.get("id") as string) || undefined,
    name: (formData.get("name") as string) || "",
    slug: (formData.get("slug") as string) || undefined,
    description: (formData.get("description") as string) || "",
    priceCents: (formData.get("priceCents") as string) || "0",
    features: (formData.get("features") as string) || "{}",
    sortOrder: (formData.get("sortOrder") as string) || "0",
    isPublished: isOn,
  };
  const p = pkg.safeParse(raw);
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Walidacja" };
  }
  let fe = "";
  try {
    fe = parseFeaturesJson(p.data.features);
  } catch {
    return { error: "Błąd w polu cech (JSON)" };
  }
  const sl = p.data.slug?.length ? p.data.slug : slugify(p.data.name);
  const existingId = p.data.id?.trim() ? p.data.id : undefined;
  if (existingId) {
    await prisma.package.update({
      where: { id: existingId },
      data: {
        name: p.data.name,
        slug: sl,
        description: p.data.description,
        priceCents: p.data.priceCents,
        featuresJson: fe,
        sortOrder: p.data.sortOrder,
        isPublished: p.data.isPublished,
      },
    });
  } else {
    await prisma.package.create({
      data: {
        name: p.data.name,
        slug: sl,
        description: p.data.description,
        priceCents: p.data.priceCents,
        featuresJson: fe,
        sortOrder: p.data.sortOrder,
        isPublished: p.data.isPublished,
      },
    });
  }
  await writeAuditLog(s.user.id, "package.upsert", "Package", existingId ?? "new", { slug: sl });
  revalidatePath("/cennik");
  revalidatePath("/");
  revalidatePath("/admin/pakiety", "page");
  return { ok: true };
}

export async function deletePackageAction(
  _p: PkgState,
  formData: FormData
): Promise<PkgState> {
  const s = await getFullAdminSession();
  if (!s) {
    return { error: "Brak uprawnień." };
  }
  const id = (formData.get("id") as string) || "";
  if (!id) {
    return { error: "Brak id." };
  }
  const used = await prisma.order.count({ where: { packageId: id } });
  if (used > 0) {
    return { error: "Nie usuwam — pakiety powiązane z istniejącymi zamówieniami. Odepnij (od publikacji) albo wygasz." };
  }
  await prisma.package.delete({ where: { id } });
  await writeAuditLog(s.user.id, "package.delete", "Package", id, null);
  revalidatePath("/cennik");
  revalidatePath("/");
  revalidatePath("/admin/pakiety", "page");
  return { ok: true };
}
