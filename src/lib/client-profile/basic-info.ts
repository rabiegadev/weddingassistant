export type WeddingType = "CYWILNY" | "KONKORDATOWY";
export type CeremonyPlace = "PLENER" | "USC" | "KOSCIOL";
export type YesNo = "TAK" | "NIE";

export type BasicInfoRecord = {
  weddingDate: string;
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;
  witness1FirstName: string;
  witness1LastName: string;
  witness2FirstName: string;
  witness2LastName: string;
  weddingType: WeddingType;
  ceremonyPlace: CeremonyPlace;
  ceremonyMapPin: string;
  ceremonyAddress: string;
  ceremonyDescription: string;
  uscName: string;
  uscAddress: string;
  uscDescription: string;
  churchName: string;
  churchAddress: string;
  churchDescription: string;
  ceremonyTime: string;
  weddingPartyTime: string;
  weddingVenueName: string;
  weddingVenueAddress: string;
  weddingVenueDescription: string;
  bridePhone: string;
  groomPhone: string;
  brideEmail: string;
  groomEmail: string;
  witness1Phone: string;
  witness1Email: string;
  witness2Phone: string;
  witness2Email: string;
  estimatedGuests: string;
  lodging: YesNo;
  lodgingWhere: string;
  lodgingForWhom: string;
  lodgingWhoPays: string;
  lodgingInfo: string;
  transport: YesNo;
  transportType: string;
  transportForWhom: string;
  transportHours: string;
  transportInfo: string;
};

export const BASIC_INFO_EMPTY: BasicInfoRecord = {
  weddingDate: "",
  brideFirstName: "",
  brideLastName: "",
  groomFirstName: "",
  groomLastName: "",
  witness1FirstName: "",
  witness1LastName: "",
  witness2FirstName: "",
  witness2LastName: "",
  weddingType: "CYWILNY",
  ceremonyPlace: "USC",
  ceremonyMapPin: "",
  ceremonyAddress: "",
  ceremonyDescription: "",
  uscName: "",
  uscAddress: "",
  uscDescription: "",
  churchName: "",
  churchAddress: "",
  churchDescription: "",
  ceremonyTime: "",
  weddingPartyTime: "",
  weddingVenueName: "",
  weddingVenueAddress: "",
  weddingVenueDescription: "",
  bridePhone: "",
  groomPhone: "",
  brideEmail: "",
  groomEmail: "",
  witness1Phone: "",
  witness1Email: "",
  witness2Phone: "",
  witness2Email: "",
  estimatedGuests: "",
  lodging: "NIE",
  lodgingWhere: "",
  lodgingForWhom: "",
  lodgingWhoPays: "",
  lodgingInfo: "",
  transport: "NIE",
  transportType: "",
  transportForWhom: "",
  transportHours: "",
  transportInfo: "",
};

export function parseBasicInfoFromInfoJson(raw: string | null | undefined): BasicInfoRecord {
  if (!raw) {
    return { ...BASIC_INFO_EMPTY };
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...BASIC_INFO_EMPTY };
    }
    const root = parsed as Record<string, unknown>;
    const basicUnknown = root.basicInfo;
    if (!basicUnknown || typeof basicUnknown !== "object" || Array.isArray(basicUnknown)) {
      return { ...BASIC_INFO_EMPTY };
    }
    const basic = basicUnknown as Record<string, unknown>;
    const out: BasicInfoRecord = { ...BASIC_INFO_EMPTY };
    for (const key of Object.keys(out) as Array<keyof BasicInfoRecord>) {
      const v = basic[key];
      if (typeof v === "string") {
        (out as Record<string, string>)[key] = v;
      }
    }
    return out;
  } catch {
    return { ...BASIC_INFO_EMPTY };
  }
}

export function countBasicInfoProgress(data: BasicInfoRecord): {
  filled: number;
  total: number;
  remaining: number;
  percent: number;
} {
  const requiredBase: Array<keyof BasicInfoRecord> = [
    "weddingDate",
    "brideFirstName",
    "brideLastName",
    "groomFirstName",
    "groomLastName",
    "witness1FirstName",
    "witness1LastName",
    "witness2FirstName",
    "witness2LastName",
    "weddingType",
    "ceremonyPlace",
    "ceremonyTime",
    "weddingPartyTime",
    "weddingVenueName",
    "weddingVenueAddress",
    "bridePhone",
    "groomPhone",
    "brideEmail",
    "groomEmail",
    "estimatedGuests",
    "lodging",
    "transport",
  ];

  const requiredDynamic: Array<keyof BasicInfoRecord> = [];
  if (data.ceremonyPlace === "PLENER") {
    requiredDynamic.push("ceremonyMapPin", "ceremonyAddress");
  }
  if (data.ceremonyPlace === "USC") {
    requiredDynamic.push("uscName", "uscAddress");
  }
  if (data.ceremonyPlace === "KOSCIOL") {
    requiredDynamic.push("churchName", "churchAddress");
  }
  if (data.lodging === "TAK") {
    requiredDynamic.push("lodgingWhere", "lodgingForWhom", "lodgingWhoPays");
  }
  if (data.transport === "TAK") {
    requiredDynamic.push("transportType", "transportForWhom", "transportHours");
  }

  const all = [...requiredBase, ...requiredDynamic];
  const filled = all.reduce((acc, key) => (data[key].trim() !== "" ? acc + 1 : acc), 0);
  const total = all.length;
  const remaining = Math.max(total - filled, 0);
  const percent = total === 0 ? 0 : Math.round((filled / total) * 100);
  return { filled, total, remaining, percent };
}
