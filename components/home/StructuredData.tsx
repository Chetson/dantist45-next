import { getClinics, getOrganization } from "@/lib/data/site";
import { siteUrl } from "@/lib/site-url";

const dayCodes: Record<string, string[]> = {
  "Пн — Пт": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  Пн: ["Monday"],
  Вт: ["Tuesday"],
  Ср: ["Wednesday"],
  Чт: ["Thursday"],
  Пт: ["Friday"],
  Сб: ["Saturday"],
  Вс: ["Sunday"],
};

/** JSON-LD (schema.org) для поисковиков: организация и филиалы как Dentist. */
export async function StructuredData() {
  const [organization, clinics] = await Promise.all([getOrganization(), getClinics()]);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalOrganization",
        "@id": `${siteUrl}/#organization`,
        name: organization?.shortName ?? "ООО «Дантист»",
        legalName: organization?.fullName,
        url: siteUrl,
        taxID: organization?.inn,
      },
      ...clinics.map((clinic) => ({
        "@type": "Dentist",
        name: `Стоматология «Дантист» — ${clinic.name}`,
        url: `${siteUrl}/clinics/${clinic.slug}`,
        parentOrganization: { "@id": `${siteUrl}/#organization` },
        address: {
          "@type": "PostalAddress",
          streetAddress: clinic.address,
          addressLocality: "Курган",
          addressCountry: "RU",
        },
        telephone: clinic.phones[0]?.number,
        openingHoursSpecification: clinic.schedule
          .filter((row) => row.opensAt && row.closesAt && dayCodes[row.days])
          .map((row) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: dayCodes[row.days],
            opens: row.opensAt,
            closes: row.closesAt,
          })),
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON из нашей БД; «<» экранируется, чтобы текст не закрыл тег script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
