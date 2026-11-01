import { Suspense } from "react";
import { Announcements } from "@/components/home/Announcements";
import { Hero } from "@/components/home/Hero";
import {
  About,
  CallPhones,
  CallToAction,
  ClinicsGrid,
  ClinicsSection,
  DoctorsWidget,
  PatientInfo,
  ServicesGrid,
  ServicesSection,
  WhyUs,
} from "@/components/home/Sections";
import { StructuredData } from "@/components/home/StructuredData";
import { CardGridSkeleton } from "@/components/ui/Skeleton";

// Порядок блоков — refactor-plan.md, раздел 3; оформление — по макету
// «Dental Clinic» (Behance). Статичные части попадают в пререндер,
// блоки с данными из БД подгружаются через Suspense.
export default function Home() {
  return (
    <>
      <Suspense>
        <StructuredData />
      </Suspense>
      <Hero />
      <Suspense>
        <Announcements />
      </Suspense>
      <ServicesSection>
        <Suspense fallback={<CardGridSkeleton count={4} className="h-72" />}>
          <ServicesGrid />
        </Suspense>
      </ServicesSection>
      <WhyUs />
      <About />
      <Suspense>
        <DoctorsWidget />
      </Suspense>
      <ClinicsSection>
        <Suspense fallback={<CardGridSkeleton count={2} className="h-80" />}>
          <ClinicsGrid />
        </Suspense>
      </ClinicsSection>
      <PatientInfo />
      <CallToAction>
        <Suspense>
          <CallPhones />
        </Suspense>
      </CallToAction>
    </>
  );
}
