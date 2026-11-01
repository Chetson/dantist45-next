import type { Metadata } from "next";
import { Suspense } from "react";
import { ClinicsGrid } from "@/components/home/Sections";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGridSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Филиалы",
  description: "Адреса, телефоны и режим работы филиалов стоматологии «Дантист» в Кургане.",
};

export default function ClinicsPage() {
  return (
    <>
      <PageHeader
        title="Филиалы"
        current="Филиалы"
        lead="Запись на приём — по телефону филиала. Сайт не принимает заявки и не собирает персональные данные."
      />
      <div className="container-page py-14">
        <Suspense fallback={<CardGridSkeleton count={2} className="h-96" />}>
          <ClinicsGrid />
        </Suspense>
      </div>
    </>
  );
}
