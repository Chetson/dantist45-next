import type { Metadata } from "next";
import { Suspense } from "react";
import { StaffDirectory } from "@/components/staff/StaffDirectory";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { getStaff } from "@/lib/data/content";
import { getClinics } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Специалисты",
  description:
    "Врачи, зубные врачи и медицинские сёстры стоматологии «Дантист»: образование, квалификация, аккредитация.",
};

async function Directory() {
  const [staff, clinics] = await Promise.all([getStaff(), getClinics()]);
  return (
    <StaffDirectory
      staff={staff}
      clinics={clinics.map((c) => ({ slug: c.slug, name: c.name }))}
    />
  );
}

export default function SpecialistsPage() {
  return (
    <>
      <PageHeader
        title="Специалисты"
        current="Специалисты"
        lead="Медицинские работники, участвующие в оказании медицинских услуг. В карточке каждого — сведения об образовании, квалификации и аккредитации."
      />
      <div className="container-page">
        <Suspense fallback={<CardGridSkeleton count={6} />}>
          <Directory />
        </Suspense>
      </div>
    </>
  );
}
