import "server-only";
import { cacheTag } from "next/cache";
import { db } from "@/lib/db";

// Общие данные для layout (Header/Footer). Админка будет сбрасывать кэш
// через revalidateTag/updateTag с этими тегами.
export const TAGS = {
  organization: "organization",
  clinics: "clinics",
  regulators: "regulators",
} as const;

export async function getOrganization() {
  "use cache";
  cacheTag(TAGS.organization);
  return db.organization.findUnique({ where: { id: 1 } });
}

export async function getClinics() {
  "use cache";
  cacheTag(TAGS.clinics);
  return db.clinic.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: {
      phones: { orderBy: { sortOrder: "asc" } },
      schedule: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getRegulators() {
  "use cache";
  cacheTag(TAGS.regulators);
  return db.regulator.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}
