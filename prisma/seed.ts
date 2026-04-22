import { PrismaClient, UserRole, OrderStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

function feat(o: Record<string, boolean | string | number | boolean[]>) {
  return JSON.stringify(o);
}

/**
 * Lokalne / testowe: `SEED_ADMIN_PASSWORD=... npx tsx prisma/seed.ts`  
 * (Na produkcję: nie włączaj w pipeline bez świadomej decyzji; admin z seed to ryzyko.)
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

  async function ensurePackage(data: {
    name: string;
    slug: string;
    description: string;
    priceCents: number;
    featuresJson: string;
    sortOrder: number;
  }) {
    const ex = await prisma.package.findUnique({ where: { slug: data.slug } });
    if (ex) {
      return ex;
    }
    return prisma.package.create({ data: { ...data, isPublished: true } });
  }

  const p1 = await ensurePackage({
    name: "Wizytówka podstawowa",
    slug: "podstawowa-wizytowka",
    description: "Jedna strona, własna subdomena, kod QR, szablon z biblioteki.",
    priceCents: 4_99_00,
    featuresJson: feat({ weddingPage: true, subdomain: true, qr: true, rsvp: false, gallery: false }),
    sortOrder: 1,
  });

  await ensurePackage({
    name: "Wizytówka + RSVP",
    slug: "wizytowka-rsvp",
    description: "Jak podstawowa, plus odpowiedzi gości online.",
    priceCents: 6_99_00,
    featuresJson: feat({ weddingPage: true, subdomain: true, qr: true, rsvp: true, gallery: false }),
    sortOrder: 2,
  });

  await ensurePackage({
    name: "Pakiet pełniejszy",
    slug: "pelna",
    description: "Strona, RSVP, galeria gościnna (placeholder), nawigacja szczegółów w roadmapie.",
    priceCents: 9_99_00,
    featuresJson: feat({ weddingPage: true, subdomain: true, qr: true, rsvp: true, guestGallery: true }),
    sortOrder: 3,
  });

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
        },
        update: {},
      });
      const exists = await prisma.order.findFirst({ where: { userId: u.id, packageId: p1.id } });
      if (!exists) {
        const o = await prisma.order.create({
          data: {
            userId: u.id,
            packageId: p1.id,
            status: OrderStatus.SUBMITTED,
            totalCents: p1.priceCents,
            selectionJson: JSON.stringify({ note: "seed" }),
          },
        });
        await prisma.orderEvent.create({
          data: { orderId: o.id, fromStatus: null, toStatus: OrderStatus.SUBMITTED, message: "Seed" },
        });
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
