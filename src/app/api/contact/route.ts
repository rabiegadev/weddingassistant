import { rateLimitOrThrow } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";
import { parseAdminRecipientList, sendMailIfConfigured } from "@/lib/mail/send";
import { buildContactAdminMail } from "@/lib/mail/templates/presets";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(40).optional(),
  message: z.string().min(1).max(8000),
  sourcePage: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "0";
  try {
    await rateLimitOrThrow(`contact:${ip}`, "contact");
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Zbyt wiele prób." },
      { status: 429 }
    );
  }
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane (JSON)." }, { status: 400 });
  }
  const p = bodySchema.safeParse(json);
  if (!p.success) {
    return NextResponse.json(
      { error: p.error.issues[0]?.message ?? "Walidacja" },
      { status: 400 }
    );
  }
  await prisma.contactInquiry.create({
    data: {
      name: p.data.name,
      email: p.data.email,
      phone: p.data.phone?.trim() || null,
      message: p.data.message,
      sourcePage: p.data.sourcePage?.trim() || null,
    },
  });
  const admins = parseAdminRecipientList();
  const branded = buildContactAdminMail({
    name: p.data.name,
    email: p.data.email,
    phone: p.data.phone,
    message: p.data.message,
    sourcePage: p.data.sourcePage,
  });
  await Promise.all(
    admins.map((to) =>
      sendMailIfConfigured({
        to,
        subject: branded.subject,
        text: branded.text,
        html: branded.html,
        replyTo: p.data.email,
        templateKey: branded.templateKey,
      })
    )
  );
  return NextResponse.json({ ok: true });
}
