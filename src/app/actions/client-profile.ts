"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/auth/session";
import {
  BASIC_INFO_EMPTY,
  type BasicInfoRecord,
  parseBasicInfoFromInfoJson,
} from "@/lib/client-profile/basic-info";

export type BasicInfoActionState =
  | {
      ok?: boolean;
      error?: string;
    }
  | void;

const yesNoSchema = z.enum(["TAK", "NIE"]);
const weddingTypeSchema = z.enum(["CYWILNY", "KONKORDATOWY"]);
const ceremonyPlaceSchema = z.enum(["PLENER", "USC", "KOSCIOL"]);

function readTrimmed(formData: FormData, key: keyof BasicInfoRecord): string {
  return String(formData.get(key) ?? "").trim();
}

export async function saveBasicInfoAction(
  _s: BasicInfoActionState,
  formData: FormData
): Promise<BasicInfoActionState> {
  const session = await getClientSession();
  if (!session) {
    return { error: "Sesja wygasła. Zaloguj się ponownie." };
  }

  const profile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
    select: { infoJson: true },
  });

  const weddingType = weddingTypeSchema.safeParse(readTrimmed(formData, "weddingType"));
  const ceremonyPlace = ceremonyPlaceSchema.safeParse(readTrimmed(formData, "ceremonyPlace"));
  const lodging = yesNoSchema.safeParse(readTrimmed(formData, "lodging"));
  const transport = yesNoSchema.safeParse(readTrimmed(formData, "transport"));

  if (!weddingType.success || !ceremonyPlace.success || !lodging.success || !transport.success) {
    return { error: "Nieprawidłowe wartości formularza." };
  }

  const weddingDateRaw = readTrimmed(formData, "weddingDate");
  if (weddingDateRaw.length < 10) {
    return { error: "Podaj datę ślubu." };
  }
  const weddingDate = new Date(weddingDateRaw);
  if (Number.isNaN(weddingDate.getTime())) {
    return { error: "Nieprawidłowa data ślubu." };
  }

  const data: BasicInfoRecord = {
    ...BASIC_INFO_EMPTY,
    weddingDate: weddingDateRaw,
    brideFirstName: readTrimmed(formData, "brideFirstName"),
    brideLastName: readTrimmed(formData, "brideLastName"),
    groomFirstName: readTrimmed(formData, "groomFirstName"),
    groomLastName: readTrimmed(formData, "groomLastName"),
    witness1FirstName: readTrimmed(formData, "witness1FirstName"),
    witness1LastName: readTrimmed(formData, "witness1LastName"),
    witness2FirstName: readTrimmed(formData, "witness2FirstName"),
    witness2LastName: readTrimmed(formData, "witness2LastName"),
    weddingType: weddingType.data,
    ceremonyPlace: ceremonyPlace.data,
    ceremonyMapPin: readTrimmed(formData, "ceremonyMapPin"),
    ceremonyAddress: readTrimmed(formData, "ceremonyAddress"),
    ceremonyDescription: readTrimmed(formData, "ceremonyDescription"),
    uscName: readTrimmed(formData, "uscName"),
    uscAddress: readTrimmed(formData, "uscAddress"),
    uscDescription: readTrimmed(formData, "uscDescription"),
    churchName: readTrimmed(formData, "churchName"),
    churchAddress: readTrimmed(formData, "churchAddress"),
    churchDescription: readTrimmed(formData, "churchDescription"),
    ceremonyTime: readTrimmed(formData, "ceremonyTime"),
    weddingPartyTime: readTrimmed(formData, "weddingPartyTime"),
    weddingVenueName: readTrimmed(formData, "weddingVenueName"),
    weddingVenueAddress: readTrimmed(formData, "weddingVenueAddress"),
    weddingVenueDescription: readTrimmed(formData, "weddingVenueDescription"),
    bridePhone: readTrimmed(formData, "bridePhone"),
    groomPhone: readTrimmed(formData, "groomPhone"),
    brideEmail: readTrimmed(formData, "brideEmail"),
    groomEmail: readTrimmed(formData, "groomEmail"),
    witness1Phone: readTrimmed(formData, "witness1Phone"),
    witness1Email: readTrimmed(formData, "witness1Email"),
    witness2Phone: readTrimmed(formData, "witness2Phone"),
    witness2Email: readTrimmed(formData, "witness2Email"),
    estimatedGuests: readTrimmed(formData, "estimatedGuests"),
    lodging: lodging.data,
    lodgingWhere: readTrimmed(formData, "lodgingWhere"),
    lodgingForWhom: readTrimmed(formData, "lodgingForWhom"),
    lodgingWhoPays: readTrimmed(formData, "lodgingWhoPays"),
    lodgingInfo: readTrimmed(formData, "lodgingInfo"),
    transport: transport.data,
    transportType: readTrimmed(formData, "transportType"),
    transportForWhom: readTrimmed(formData, "transportForWhom"),
    transportHours: readTrimmed(formData, "transportHours"),
    transportInfo: readTrimmed(formData, "transportInfo"),
  };

  const requiredText = z.string().min(1);
  const baseRequired: Array<keyof BasicInfoRecord> = [
    "brideFirstName",
    "brideLastName",
    "groomFirstName",
    "groomLastName",
    "witness1FirstName",
    "witness1LastName",
    "witness2FirstName",
    "witness2LastName",
    "ceremonyTime",
    "weddingPartyTime",
    "weddingVenueName",
    "weddingVenueAddress",
    "bridePhone",
    "groomPhone",
    "brideEmail",
    "groomEmail",
    "estimatedGuests",
  ];
  for (const field of baseRequired) {
    if (!requiredText.safeParse(data[field]).success) {
      return { error: "Uzupełnij wszystkie wymagane pola podstawowe." };
    }
  }

  if (data.weddingType === "CYWILNY" && data.ceremonyPlace === "KOSCIOL") {
    return { error: "Dla ślubu cywilnego wybierz plener lub USC." };
  }
  if (data.weddingType === "KONKORDATOWY" && data.ceremonyPlace === "USC") {
    return { error: "Dla ślubu konkordatowego wybierz plener lub kościół." };
  }

  if (data.ceremonyPlace === "PLENER" && (data.ceremonyMapPin === "" || data.ceremonyAddress === "")) {
    return { error: "Dla ślubu w plenerze podaj pinezkę i adres." };
  }
  if (data.ceremonyPlace === "USC" && (data.uscName === "" || data.uscAddress === "")) {
    return { error: "Dla USC podaj nazwę i adres." };
  }
  if (data.ceremonyPlace === "KOSCIOL" && (data.churchName === "" || data.churchAddress === "")) {
    return { error: "Dla kościoła podaj nazwę i adres." };
  }

  if (data.lodging === "TAK" && (data.lodgingWhere === "" || data.lodgingForWhom === "" || data.lodgingWhoPays === "")) {
    return { error: "Dla noclegu uzupełnij: gdzie, dla kogo i kto opłaca." };
  }
  if (data.transport === "TAK" && (data.transportType === "" || data.transportForWhom === "" || data.transportHours === "")) {
    return { error: "Dla transportu uzupełnij: rodzaj, dla kogo i godziny." };
  }

  const currentRoot =
    profile?.infoJson && profile.infoJson.trim() !== ""
      ? (() => {
          try {
            const parsed = JSON.parse(profile.infoJson) as unknown;
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              return parsed as Record<string, unknown>;
            }
          } catch {
            return {};
          }
          return {};
        })()
      : {};

  const merged = {
    ...currentRoot,
    basicInfo: data,
  };

  const parsedOld = parseBasicInfoFromInfoJson(profile?.infoJson);
  const weddingDateChanged = parsedOld.weddingDate !== data.weddingDate;

  await prisma.clientProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      weddingDate,
      infoJson: JSON.stringify(merged),
    },
    update: {
      weddingDate: weddingDateChanged ? weddingDate : undefined,
      infoJson: JSON.stringify(merged),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/baza-informacji", "page");
  revalidatePath("/dashboard/baza-informacji/informacje-podstawowe", "page");
  return { ok: true };
}
