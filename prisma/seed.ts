// Наполнение БД начальными данными: `npx prisma db seed`.
// ВНИМАНИЕ: без флага --if-empty seed полностью перезаписывает контентные
// таблицы. Запускать на свежей БД, а не на боевой после правок из админки.

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { slugify } from "../lib/slugify";
import {
  announcements,
  clinics,
  documents,
  licenses,
  organization,
  regulators,
  serviceArticles,
  serviceCategories,
} from "./seed-data/content";
import { staff } from "./seed-data/staff";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL не задан");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const toDate = (iso?: string) => (iso ? new Date(`${iso}T00:00:00Z`) : null);

async function main() {
  // --if-empty: используется контейнером migrate при каждом запуске стека —
  // наполняет только новую БД и не трогает данные, которые уже есть.
  if (process.argv.includes("--if-empty") && (await prisma.organization.count()) > 0) {
    console.log("Seed пропущен: в БД уже есть данные.");
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Порядок важен из-за внешних ключей.
    await tx.announcement.deleteMany();
    await tx.licenseAnnex.deleteMany();
    await tx.license.deleteMany();
    await tx.staffDocument.deleteMany();
    await tx.staffClinic.deleteMany();
    await tx.staff.deleteMany();
    await tx.clinicPhone.deleteMany();
    await tx.clinicSchedule.deleteMany();
    await tx.clinic.deleteMany();
    await tx.serviceArticle.deleteMany();
    await tx.service.deleteMany();
    await tx.serviceCategory.deleteMany();
    await tx.regulator.deleteMany();
    await tx.document.deleteMany();

    await tx.organization.upsert({
      where: { id: 1 },
      create: organization,
      update: organization,
    });
    await tx.siteSettings.upsert({
      where: { id: 1 },
      create: {},
      update: {},
    });

    const clinicIds = new Map<string, number>();
    for (const [i, c] of clinics.entries()) {
      const created = await tx.clinic.create({
        data: {
          slug: c.slug,
          name: c.name,
          address: c.address,
          sortOrder: i,
          phones: {
            create: c.phones.map((p, j) => ({ ...p, sortOrder: j })),
          },
          schedule: {
            create: c.schedule.map((s, j) => ({ ...s, sortOrder: j })),
          },
        },
      });
      clinicIds.set(c.slug, created.id);
    }
    const clinicId = (slug: string) => {
      const id = clinicIds.get(slug);
      if (id === undefined) throw new Error(`Неизвестный филиал: ${slug}`);
      return id;
    };

    for (const [i, s] of staff.entries()) {
      const [lastName, firstName, middleName] = s.fullName.split(" ");
      await tx.staff.create({
        data: {
          slug: slugify(s.fullName),
          lastName,
          firstName,
          middleName,
          kind: s.kind,
          specialties: s.specialties,
          showOnHome: s.showOnHome ?? false,
          sortOrder: i,
          clinics: {
            create: Object.entries(s.clinics).map(([slug, position]) => ({
              clinicId: clinicId(slug),
              position,
            })),
          },
          documents: {
            create: s.documents.map((d, j) => ({
              ...d,
              issuedAt: toDate(d.issuedAt),
              sortOrder: j,
            })),
          },
        },
      });
    }

    const categoryIds = new Map<string, number>();
    for (const [i, c] of serviceCategories.entries()) {
      const created = await tx.serviceCategory.create({
        data: {
          slug: c.slug,
          name: c.name,
          summary: c.summary,
          icon: c.icon,
          showOnHome: c.showOnHome,
          sortOrder: i,
          services: {
            create: c.services.map((svc, j) => ({ ...svc, sortOrder: j })),
          },
        },
      });
      categoryIds.set(c.slug, created.id);
    }

    for (const [i, { categorySlug, ...article }] of serviceArticles.entries()) {
      await tx.serviceArticle.create({
        data: {
          ...article,
          categoryId: categoryIds.get(categorySlug),
          sortOrder: i,
        },
      });
    }

    for (const [i, { annexes, issuedAt, ...license }] of licenses.entries()) {
      await tx.license.create({
        data: {
          ...license,
          issuedAt: new Date(`${issuedAt}T00:00:00Z`),
          sortOrder: i,
          annexes: {
            create: annexes.map(({ clinicSlug, ...annex }, j) => ({
              ...annex,
              clinicId: clinicId(clinicSlug),
              sortOrder: j,
            })),
          },
        },
      });
    }

    await tx.regulator.createMany({
      data: regulators.map((r, i) => ({ ...r, sortOrder: i })),
    });
    await tx.document.createMany({
      data: documents.map((d, i) => ({ ...d, sortOrder: i })),
    });
    await tx.announcement.createMany({
      data: announcements.map((a, i) => ({ ...a, sortOrder: i })),
    });
  });

  const counts = {
    clinics: await prisma.clinic.count(),
    staff: await prisma.staff.count(),
    staffDocuments: await prisma.staffDocument.count(),
    categories: await prisma.serviceCategory.count(),
    services: await prisma.service.count(),
    articles: await prisma.serviceArticle.count(),
    licenses: await prisma.license.count(),
    regulators: await prisma.regulator.count(),
    documents: await prisma.document.count(),
    announcements: await prisma.announcement.count(),
  };
  console.log("Seed выполнен:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
