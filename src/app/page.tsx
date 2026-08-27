import { Header } from "@/components/sections/header"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Departments } from "@/components/sections/departments"
import { Advantages } from "@/components/sections/advantages"
import { Teachers } from "@/components/sections/teachers"
import { Management } from "@/components/sections/management"
import { Statistics } from "@/components/sections/statistics"
import { Gallery } from "@/components/sections/gallery"
import { SocialLinks } from "@/components/sections/social"
import { Registration } from "@/components/sections/registration"
import { Footer } from "@/components/sections/footer"
import { SettingsData } from "@/types/site"

import { prisma } from "@/lib/prisma"
import { 
  Department as PrismaDepartment, 
  Teacher as PrismaTeacher, 
  ManagementMember as PrismaManagementMember,
  Statistic as PrismaStatistic,
  GalleryItem as PrismaGalleryItem,
  SocialLink as PrismaSocialLink
} from "@prisma/client"

export default async function Home() {
  let siteSettings = null
  let activeDepartments: PrismaDepartment[] = []
  let activeTeachers: PrismaTeacher[] = []
  let activeManagement: PrismaManagementMember[] = []
  let activeStatistics: PrismaStatistic[] = []
  let activeGallery: PrismaGalleryItem[] = []
  let activeSocials: PrismaSocialLink[] = []

  try {
    const [
      settingsResult,
      departmentsResult,
      teachersResult,
      managementResult,
      statisticsResult,
      galleryResult,
      socialsResult
    ] = await Promise.allSettled([
      prisma.siteSettings.findUnique({ where: { id: 1 } }),
      prisma.department.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.teacher.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.managementMember.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.statistic.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.galleryItem.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.socialLink.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } })
    ])

    if (settingsResult.status === "fulfilled") siteSettings = settingsResult.value
    if (departmentsResult.status === "fulfilled") activeDepartments = departmentsResult.value
    if (teachersResult.status === "fulfilled") activeTeachers = teachersResult.value
    if (managementResult.status === "fulfilled") activeManagement = managementResult.value
    if (statisticsResult.status === "fulfilled") activeStatistics = statisticsResult.value
    if (galleryResult.status === "fulfilled") activeGallery = galleryResult.value
    if (socialsResult.status === "fulfilled") activeSocials = socialsResult.value
  } catch (error) {
    console.error("Error fetching data:", error)
  }

  const settings: SettingsData = {
    centerName: siteSettings?.centerName || "O'quv Markaz",
    description: siteSettings?.description || "Zamonaviy ta'lim, amaliy ko'nikmalar va tajribali ustozlar bilan o'z kelajagingizni yarating. Biz sizning muvaffaqiyatingiz uchun ishlaymiz.",
    phone: siteSettings?.phone || "+998 90 123 45 67",
    email: siteSettings?.email || "info@oquvmarkaz.uz",
    address: siteSettings?.address || "Toshkent shahar, Yunusobod tumani, Amir Temur ko'chasi, 1-uy",
    heroTitle: siteSettings?.heroTitle || "Kelajagingizni bugundan boshlang",
    heroDescription: siteSettings?.heroDescription || "Zamonaviy ta'lim, amaliy ko'nikmalar va tajribali ustozlar bilan o'z kelajagingizni yarating.",
    heroImage: siteSettings?.heroImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
    aboutTitle: siteSettings?.aboutTitle || "Biz haqimizda",
    aboutDescription: siteSettings?.aboutDescription || "O'quv markazimiz 2020-yildan beri yoshlarga zamonaviy kasblar va xorijiy tillarni o'rgatish bilan shug'ullanib kelmoqda. Bizning asosiy maqsadimiz – o'quvchilarimizga nafaqat nazariy bilimlar, balki amaliy ko'nikmalar ham berish.",
    aboutImage: siteSettings?.aboutImage || "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop",
    logo: siteSettings?.logo || undefined,
  }

  const formattedDepartments = activeDepartments.map((d: PrismaDepartment) => ({
    id: String(d.id),
    title: d.title,
    description: d.description || "",
    image: d.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
    features: []
  }))

  const formattedTeachers = activeTeachers.map((t: PrismaTeacher) => ({
    id: String(t.id),
    name: t.name,
    position: t.position,
    specialization: t.specialization || "",
    experience: t.experience || "",
    image: t.image || "",
    telegram: t.telegram || "",
    instagram: t.instagram || "",
    bio: t.bio || undefined,
  }))

  const formattedManagement = activeManagement.map((m: PrismaManagementMember) => ({
    id: String(m.id),
    name: m.name,
    position: m.position,
    bio: m.bio || "",
    image: m.image || "",
  }))

  const formattedStatistics = activeStatistics.map((s: PrismaStatistic) => ({
    id: String(s.id),
    label: s.label,
    value: s.value,
  }))

  const formattedGallery = activeGallery.map((g: PrismaGalleryItem) => ({
    id: String(g.id),
    title: g.title,
    description: g.description || undefined,
    image: g.image,
  }))

  const formattedSocials = activeSocials.map((s: PrismaSocialLink) => ({
    platform: s.platform,
    url: s.url,
  }))

  return (
    <>
      <Header settings={settings} />
      <main className="overflow-x-hidden">
        <Hero settings={settings} />
        <About settings={settings} />
        <Departments departmentsData={formattedDepartments} />
        <Advantages />
        <Teachers teachersData={formattedTeachers} />
        <Management managementData={formattedManagement} />
        <Statistics statisticsData={formattedStatistics} />
        <Gallery galleryData={formattedGallery} />
        <SocialLinks socialData={formattedSocials} />
        <Registration departmentsData={formattedDepartments} />
      </main>
      <Footer settings={settings} socialData={formattedSocials} />
    </>
  )
}
