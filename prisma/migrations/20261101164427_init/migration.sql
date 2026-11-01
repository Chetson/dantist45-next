-- CreateEnum
CREATE TYPE "StaffKind" AS ENUM ('DOCTOR', 'NURSE', 'OTHER');

-- CreateEnum
CREATE TYPE "StaffDocType" AS ENUM ('DIPLOMA', 'RETRAINING', 'QUALIFICATION', 'CERTIFICATE', 'ACCREDITATION');

-- CreateEnum
CREATE TYPE "AnnouncementLevel" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DocumentGroup" AS ENUM ('LAW', 'CONTRACT', 'PATIENT_INFO');

-- CreateEnum
CREATE TYPE "DoctorsWidgetMode" AS ENUM ('HIDDEN', 'AUTO', 'SELECTED');

-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "fullName" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "ogrn" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "legalAddress" TEXT,
    "director" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinic" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "mapUrl" TEXT,
    "photo" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicPhone" (
    "id" SERIAL NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ClinicPhone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicSchedule" (
    "id" SERIAL NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "days" TEXT NOT NULL,
    "opensAt" TEXT,
    "closesAt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ClinicSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "kind" "StaffKind" NOT NULL,
    "specialties" TEXT,
    "photo" TEXT,
    "bio" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "showOnHome" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffClinic" (
    "staffId" INTEGER NOT NULL,
    "clinicId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "StaffClinic_pkey" PRIMARY KEY ("staffId","clinicId")
);

-- CreateTable
CREATE TABLE "StaffDocument" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "type" "StaffDocType" NOT NULL,
    "number" TEXT,
    "issuedAt" DATE,
    "organization" TEXT,
    "specialty" TEXT,
    "qualification" TEXT,
    "note" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StaffDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "showOnHome" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "priceFrom" INTEGER NOT NULL,
    "priceTo" INTEGER,
    "unit" TEXT,
    "note" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceArticle" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "level" "AnnouncementLevel" NOT NULL DEFAULT 'INFO',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "issuedAt" DATE NOT NULL,
    "issuer" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "blankNumber" TEXT,
    "registryUrl" TEXT,
    "scanImages" TEXT[],
    "scanPdf" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseAnnex" (
    "id" SERIAL NOT NULL,
    "licenseId" INTEGER NOT NULL,
    "clinicId" INTEGER,
    "number" TEXT NOT NULL,
    "blankNumber" TEXT,
    "address" TEXT NOT NULL,
    "works" TEXT NOT NULL,
    "scanImages" TEXT[],
    "scanPdf" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LicenseAnnex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regulator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "phones" TEXT[],
    "hotline" TEXT,
    "email" TEXT,
    "website" TEXT,
    "receptionHours" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Regulator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "group" "DocumentGroup" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "file" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "doctorsWidgetMode" "DoctorsWidgetMode" NOT NULL DEFAULT 'AUTO',
    "doctorsWidgetLimit" INTEGER NOT NULL DEFAULT 6,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnnouncementToClinic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnnouncementToClinic_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_slug_key" ON "Clinic"("slug");

-- CreateIndex
CREATE INDEX "ClinicPhone_clinicId_idx" ON "ClinicPhone"("clinicId");

-- CreateIndex
CREATE INDEX "ClinicSchedule_clinicId_idx" ON "ClinicSchedule"("clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_slug_key" ON "Staff"("slug");

-- CreateIndex
CREATE INDEX "StaffClinic_clinicId_idx" ON "StaffClinic"("clinicId");

-- CreateIndex
CREATE INDEX "StaffDocument_staffId_idx" ON "StaffDocument"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE INDEX "Service_categoryId_idx" ON "Service"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceArticle_slug_key" ON "ServiceArticle"("slug");

-- CreateIndex
CREATE INDEX "ServiceArticle_categoryId_idx" ON "ServiceArticle"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "License_number_key" ON "License"("number");

-- CreateIndex
CREATE INDEX "LicenseAnnex_licenseId_idx" ON "LicenseAnnex"("licenseId");

-- CreateIndex
CREATE INDEX "LicenseAnnex_clinicId_idx" ON "LicenseAnnex"("clinicId");

-- CreateIndex
CREATE INDEX "_AnnouncementToClinic_B_index" ON "_AnnouncementToClinic"("B");

-- AddForeignKey
ALTER TABLE "ClinicPhone" ADD CONSTRAINT "ClinicPhone_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSchedule" ADD CONSTRAINT "ClinicSchedule_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffClinic" ADD CONSTRAINT "StaffClinic_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffClinic" ADD CONSTRAINT "StaffClinic_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffDocument" ADD CONSTRAINT "StaffDocument_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceArticle" ADD CONSTRAINT "ServiceArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseAnnex" ADD CONSTRAINT "LicenseAnnex_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicenseAnnex" ADD CONSTRAINT "LicenseAnnex_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToClinic" ADD CONSTRAINT "_AnnouncementToClinic_A_fkey" FOREIGN KEY ("A") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementToClinic" ADD CONSTRAINT "_AnnouncementToClinic_B_fkey" FOREIGN KEY ("B") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
