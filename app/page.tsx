import { Suspense } from "react";
import { Announcements } from "@/components/home/Announcements";
import { Hero } from "@/components/home/Hero";
import { StructuredData } from "@/components/home/StructuredData";
import {
  About,
  CallPhones,
  CallToAction,
  ClinicsGrid,
  ClinicsSection,
  DoctorsWidget,
  Features,
  PatientInfo,
  ServicesGrid,
  ServicesSection,
} from "@/components/home/Sections";
import { CardGridSkeleton } from "@/components/ui/Skeleton";

// Порядок блоков — refactor-plan.md, раздел 3. Статичные части попадают
// в пререндер, блоки с данными из БД подгружаются через Suspense.
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
      <Features />
      <ServicesSection>
        <Suspense fallback={<CardGridSkeleton count={4} className="h-72" />}>
          <ServicesGrid />
        </Suspense>
      </ServicesSection>
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
