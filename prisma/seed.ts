import { PlanTier, PrismaClient, UserRole, OrderStatus } from "@prisma/client";
import { ensureClientProfile } from "../src/lib/client-profile/ensure";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

function feat(o: Record<string, boolean | string | number>) {
  return JSON.stringify(o);
}

/**
 * Lokalne / testowe: `SEED_ADMIN_PASSWORD=... npx tsx prisma/seed.ts`
 */
async function main() {
  const pass = process.env.SEED_ADMIN_PASSWORD;
  if (!pass || pass.length < 12) {
    console.warn("SEED_ADMIN_PASSWORD: pominięto tworzenie admina (puste lub <12 znaków).");
  } else {
    const h = await hashPassword(pass);
    const email = process.env.SEED_ADMIN_EMAIL ?? "admin@weddingassistant.test";
    await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: "Admin seed",
        passwordHash: h,
        role: UserRole.ADMIN,
        emailVerifiedAt: new Date(),
      },
      update: {
        passwordHash: h,
        emailVerifiedAt: new Date(),
      },
    });
  }

  type SeedPkg = {
    slug: string;
    name: string;
    description: string;
    priceCents: number;
    sortOrder: number;
    planTier: PlanTier;
    postWeddingAccessMonths: number | null;
    featuresJson: string;
  };

  const packs: SeedPkg[] = [
    {
      slug: "plan-darmowy",
      name: "Darmowy",
      description:
        "Lista gości (do 25 osób), planer z tygodniowym resetem danych, wybrane narzędzia w trybie ograniczonym. Galeria w panelu niedostępna.",
      priceCents: 0,
      sortOrder: 0,
      planTier: PlanTier.FREE,
      postWeddingAccessMonths: null,
      featuresJson: feat({
        maxGuests: 25,
        maxTables: 3,
        qr: "limited",
        gallery: false,
      }),
    },
    {
      slug: "asystent-podstawowy",
      name: "Asystent podstawowy",
      description:
        "Większość narzędzi asystenta (część modułów premium lub z niższymi limitami wg konfiguracji). Dostęp od wykupienia do 6 miesięcy po dacie ślubu.",
      priceCents: 2_99_00,
      sortOrder: 10,
      planTier: PlanTier.ASSIST_BASIC,
      postWeddingAccessMonths: 6,
      featuresJson: feat({
        maxGuests: 200,
        maxTables: 40,
        qr: "full",
        gallery: true,
      }),
    },
    {
      slug: "www-wizytowka-szablon",
      name: "Wizytówka WWW (szablon)",
      description:
        "Strona weselna z gotowego szablonu + domena. Bez galerii na stronie, RSVP podstawowy. Wybór szablonu przy zamówieniu. Dostęp do 6 miesięcy po ślubie.",
      priceCents: 4_99_00,
      sortOrder: 20,
      planTier: PlanTier.WWW_TEMPLATE,
      postWeddingAccessMonths: 6,
      featuresJson: feat({
        weddingPage: true,
        gallery: false,
        rsvp: "basic",
        requiresTemplateId: true,
      }),
    },
    {
      slug: "asystent-www-szablon",
      name: "Asystent podstawowy + wizytówka WWW (szablon)",
      description:
        "Pakiet asystenta podstawowego oraz strona WWW z szablonu + domena. Wybór szablonu przy zamówieniu. Dostęp do 6 miesięcy po ślubie.",
      priceCents: 6_99_00,
      sortOrder: 30,
      planTier: PlanTier.ASSIST_BASIC_WWW_TEMPLATE,
      postWeddingAccessMonths: 6,
      featuresJson: feat({
        maxGuests: 200,
        maxTables: 40,
        weddingPage: true,
        gallery: false,
        rsvp: "basic",
        requiresTemplateId: true,
      }),
    },
    {
      slug: "asystent-premium-www-szablon",
      name: "Asystent premium + wizytówka WWW (szablon)",
      description:
        "Wszystkie narzędzia z najwyższymi limitami + strona z gotowego szablonu. Wybór szablonu obowiązkowy. Dostęp do 12 miesięcy po ślubie (możliwość przedłużenia).",
      priceCents: 9_99_00,
      sortOrder: 40,
      planTier: PlanTier.ASSIST_PREMIUM_WWW_TEMPLATE,
      postWeddingAccessMonths: 12,
      featuresJson: feat({
        maxGuests: 10_000,
        maxTables: 500,
        weddingPage: true,
        gallery: true,
        rsvp: "full",
        requiresTemplateId: true,
      }),
    },
    {
      slug: "asystent-premium-www-custom",
      name: "Asystent premium + wizytówka WWW (projekt indywidualny)",
      description:
        "Jak pakiet premium + szablon, lecz strona projektowana pod klienta (brief, inspiracje, zdjęcia). Poprawki wg polityki projektowej. Dostęp do 12 miesięcy po ślubie (przedłużenie opcjonalnie).",
      priceCents: 14_99_00,
      sortOrder: 50,
      planTier: PlanTier.ASSIST_PREMIUM_WWW_CUSTOM,
      postWeddingAccessMonths: 12,
      featuresJson: feat({
        maxGuests: 10_000,
        maxTables: 500,
        weddingPage: true,
        gallery: true,
        rsvp: "full",
        fulfillmentType: "CUSTOM_BRIEF",
        revisionsMajorMax: 2,
        revisionsMinorFree: true,
      }),
    },
  ];

  for (const p of packs) {
    await prisma.package.upsert({
      where: { slug: p.slug },
      create: {
        ...p,
        isPublished: true,
      },
      update: {
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        sortOrder: p.sortOrder,
        planTier: p.planTier,
        postWeddingAccessMonths: p.postWeddingAccessMonths,
        featuresJson: p.featuresJson,
        isPublished: true,
      },
    });
  }

  const demoUser = process.env.SEED_DEMO_USER_EMAIL;
  if (demoUser) {
    const p = process.env.SEED_DEMO_USER_PASSWORD;
    if (!p || p.length < 12) {
      console.warn("SEED_DEMO_USER_PASSWORD: pominięto użytko demo pary (hasło <12).");
    } else {
      const h = await hashPassword(p);
      const u = await prisma.user.upsert({
        where: { email: demoUser },
        create: {
          email: demoUser,
          name: "Para demo",
          passwordHash: h,
          role: UserRole.CLIENT,
          emailVerifiedAt: new Date(),
          clientProfile: { create: {} },
        },
        update: {},
      });
      await ensureClientProfile(u.id);
      const pkgRow = await prisma.package.findUnique({ where: { slug: "www-wizytowka-szablon" } });
      if (pkgRow) {
        const exists = await prisma.order.findFirst({ where: { userId: u.id, packageId: pkgRow.id } });
        if (!exists) {
          const o = await prisma.order.create({
            data: {
              userId: u.id,
              packageId: pkgRow.id,
              status: OrderStatus.SUBMITTED,
              totalCents: pkgRow.priceCents,
              selectionJson: JSON.stringify({ note: "seed", templateId: "demo-template" }),
            },
          });
          await prisma.orderEvent.create({
            data: { orderId: o.id, fromStatus: null, toStatus: OrderStatus.SUBMITTED, message: "Seed" },
          });
        }
      }
    }
  }

  console.log("seed ok");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
