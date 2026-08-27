-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('telegram', 'instagram', 'facebook', 'youtube');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('NEW', 'CONTACTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "site_settings" (
    "id" SERIAL NOT NULL,
    "centerName" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "heroTitle" TEXT,
    "heroDescription" TEXT,
    "heroImage" TEXT,
    "aboutTitle" TEXT,
    "aboutDescription" TEXT,
    "aboutImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "specialization" TEXT,
    "experience" TEXT,
    "bio" TEXT,
    "image" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_members" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "bio" TEXT,
    "image" TEXT,
    "telegram" TEXT,
    "instagram" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "management_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistics" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" SERIAL NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "departmentId" INTEGER,
    "message" TEXT,
    "privacyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_slug_key" ON "departments"("slug");

-- CreateIndex
CREATE INDEX "departments_isActive_idx" ON "departments"("isActive");

-- CreateIndex
CREATE INDEX "departments_sortOrder_idx" ON "departments"("sortOrder");

-- CreateIndex
CREATE INDEX "teachers_isActive_idx" ON "teachers"("isActive");

-- CreateIndex
CREATE INDEX "teachers_sortOrder_idx" ON "teachers"("sortOrder");

-- CreateIndex
CREATE INDEX "management_members_isActive_idx" ON "management_members"("isActive");

-- CreateIndex
CREATE INDEX "management_members_sortOrder_idx" ON "management_members"("sortOrder");

-- CreateIndex
CREATE INDEX "statistics_isActive_idx" ON "statistics"("isActive");

-- CreateIndex
CREATE INDEX "statistics_sortOrder_idx" ON "statistics"("sortOrder");

-- CreateIndex
CREATE INDEX "gallery_items_isActive_idx" ON "gallery_items"("isActive");

-- CreateIndex
CREATE INDEX "gallery_items_sortOrder_idx" ON "gallery_items"("sortOrder");

-- CreateIndex
CREATE INDEX "social_links_isActive_idx" ON "social_links"("isActive");

-- CreateIndex
CREATE INDEX "social_links_sortOrder_idx" ON "social_links"("sortOrder");

-- CreateIndex
CREATE INDEX "registrations_status_idx" ON "registrations"("status");

-- CreateIndex
CREATE INDEX "registrations_departmentId_idx" ON "registrations"("departmentId");

-- CreateIndex
CREATE INDEX "registrations_createdAt_idx" ON "registrations"("createdAt");

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
