/**
 * Prisma Seed Script — DEVELOPMENT DEMO DATA ONLY
 *
 * This script populates the database with a small set of demo records
 * based on the Phase 3 mock data structures.
 *
 * DO NOT use this data in production.
 * DO NOT include real people's private information.
 * DO NOT create real registration records.
 *
 * Run with:  npx prisma db seed
 * (or)       npm run db:seed
 */

import "dotenv/config"
import { PrismaClient, SocialPlatform } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"


const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })


async function main() {
  console.log("🌱 Seeding development demo data...")

  // ──────────────────────────────────────────────
  // 1. Site Settings (single record)
  // ──────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      centerName: "O'quv Markaz",
      description:
        "Zamonaviy ta'lim markazi — IT, xorijiy tillar va kompyuter savodxonligi kurslari.",
      phone: "+998 90 000 00 00",
      email: "info@oquvmarkaz.uz",
      address: "Toshkent sh., Chilonzor tumani",
      heroTitle: "Kelajagingizni Bugun Boshla",
      heroDescription:
        "Zamonaviy ta'lim, tajribali o'qituvchilar va amaliy yondashuv bilan o'z sohangizdagi mutaxassis bo'ling.",
      heroImage:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      aboutTitle: "Biz Haqimizda",
      aboutDescription:
        "O'quv Markaz 2019-yildan beri sifatli ta'lim xizmatlarini ko'rsatib kelmoqda.",
      aboutImage:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
    },
  })
  console.log("  ✓ SiteSettings")

  // ──────────────────────────────────────────────
  // 2. Departments (3 records)
  // ──────────────────────────────────────────────
  const deptIT = await prisma.department.upsert({
    where: { slug: "it-dasturlash" },
    update: {},
    create: {
      title: "IT va Dasturlash",
      slug: "it-dasturlash",
      description:
        "Zamonaviy dasturlash tillari va texnologiyalari orqali kelajak kasbini egallang.",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
      isActive: true,
      sortOrder: 1,
    },
  })

  const deptLang = await prisma.department.upsert({
    where: { slug: "xorijiy-tillar" },
    update: {},
    create: {
      title: "Xorijiy tillar",
      slug: "xorijiy-tillar",
      description:
        "Chet tillarini samarali metodika yordamida tez va oson o'rganing.",
      image:
        "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop",
      isActive: true,
      sortOrder: 2,
    },
  })

  await prisma.department.upsert({
    where: { slug: "kompyuter-savodxonligi" },
    update: {},
    create: {
      title: "Kompyuter savodxonligi",
      slug: "kompyuter-savodxonligi",
      description:
        "Zamonaviy texnologiyalardan kundalik va kasbiy maqsadlarda foydalanishni o'rganing.",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
      isActive: true,
      sortOrder: 3,
    },
  })
  console.log("  ✓ Departments (3)")

  // ──────────────────────────────────────────────
  // 3. Teachers (4 records)
  // ──────────────────────────────────────────────
  const teacherSeeds = [
    {
      name: "Sardor Qodirov",
      position: "IT Mentor",
      specialization: "Frontend (React/Next.js)",
      experience: "5+ yil tajriba",
      image:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop",
      telegram: "https://t.me/",
      instagram: "https://instagram.com/",
      sortOrder: 1,
    },
    {
      name: "Malika Rustamova",
      position: "Ingliz tili o'qituvchisi",
      specialization: "IELTS Instructor",
      experience: "7+ yil tajriba",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
      telegram: "https://t.me/",
      instagram: "https://instagram.com/",
      sortOrder: 2,
    },
    {
      name: "Javohir Olimov",
      position: "Backend Mentor",
      specialization: "Node.js, PostgreSQL",
      experience: "4+ yil tajriba",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
      telegram: "https://t.me/",
      instagram: "https://instagram.com/",
      sortOrder: 3,
    },
    {
      name: "Dilnoza Karimova",
      position: "Rus tili o'qituvchisi",
      specialization: "Rus tili grammatikasi",
      experience: "6+ yil tajriba",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
      telegram: "https://t.me/",
      instagram: "https://instagram.com/",
      sortOrder: 4,
    },
  ]

  for (const t of teacherSeeds) {
    await prisma.teacher.upsert({
      where: {
        // Use composite uniqueness via name for seed idempotency
        // (no unique constraint on name — we find by name for seeding only)
        id: teacherSeeds.indexOf(t) + 1,
      },
      update: {},
      create: { ...t, isActive: true },
    })
  }
  console.log("  ✓ Teachers (4)")

  // ──────────────────────────────────────────────
  // 4. Management (2 records)
  // ──────────────────────────────────────────────
  const mgmtSeeds = [
    {
      id: 1,
      name: "Bahriddin To'rayev",
      position: "O'quv Markaz Direktori",
      bio: "Ta'lim sohasida 15 yillik tajribaga ega. Maqsadimiz – sifatli ta'lim orqali jamiyatga foyda keltirish.",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
      sortOrder: 1,
    },
    {
      id: 2,
      name: "Aziza Mamatova",
      position: "O'quv ishlari bo'yicha menejer",
      bio: "O'quv jarayonlarini tashkil etish va sifatini nazorat qilish bo'yicha yetakchi mutaxassis.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      sortOrder: 2,
    },
  ]

  for (const m of mgmtSeeds) {
    await prisma.managementMember.upsert({
      where: { id: m.id },
      update: {},
      create: { ...m, isActive: true },
    })
  }
  console.log("  ✓ ManagementMembers (2)")

  // ──────────────────────────────────────────────
  // 5. Statistics (4 records)
  // ──────────────────────────────────────────────
  const statSeeds = [
    { id: 1, value: "1000+", label: "O'quvchilar", sortOrder: 1 },
    { id: 2, value: "20+", label: "O'qituvchilar", sortOrder: 2 },
    { id: 3, value: "10+", label: "O'quv yo'nalishlari", sortOrder: 3 },
    { id: 4, value: "5+", label: "Yillik tajriba", sortOrder: 4 },
  ]

  for (const s of statSeeds) {
    await prisma.statistic.upsert({
      where: { id: s.id },
      update: {},
      create: { ...s, isActive: true },
    })
  }
  console.log("  ✓ Statistics (4)")

  // ──────────────────────────────────────────────
  // 6. Gallery (4 records)
  // ──────────────────────────────────────────────
  const gallerySeeds = [
    {
      id: 1,
      title: "Ochiq eshiklar kuni",
      description: "Yangi o'quvchilar bilan tanishuv",
      image:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop",
      sortOrder: 1,
    },
    {
      id: 2,
      title: "Dasturlash xonasi",
      description: "Amaliy mashg'ulotlar jarayoni",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop",
      sortOrder: 2,
    },
    {
      id: 3,
      title: "Bitiruvchilar",
      description: "Sertifikat topshirish marosimi",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop",
      sortOrder: 3,
    },
    {
      id: 4,
      title: "Sinf xonasi",
      description: "Interaktiv darslar jarayoni",
      image:
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600&auto=format&fit=crop",
      sortOrder: 4,
    },
  ]

  for (const g of gallerySeeds) {
    await prisma.galleryItem.upsert({
      where: { id: g.id },
      update: {},
      create: { ...g, isActive: true },
    })
  }
  console.log("  ✓ GalleryItems (4)")

  // ──────────────────────────────────────────────
  // 7. Social Links (2 records)
  // ──────────────────────────────────────────────
  const socialSeeds = [
    {
      id: 1,
      platform: SocialPlatform.telegram,
      label: "Telegram",
      url: "https://t.me/",
      icon: "telegram",
      sortOrder: 1,
    },
    {
      id: 2,
      platform: SocialPlatform.instagram,
      label: "Instagram",
      url: "https://instagram.com/",
      icon: "instagram",
      sortOrder: 2,
    },
  ]

  for (const sl of socialSeeds) {
    await prisma.socialLink.upsert({
      where: { id: sl.id },
      update: {},
      create: { ...sl, isActive: true },
    })
  }
  console.log("  ✓ SocialLinks (2)")

  // ──────────────────────────────────────────────
  // 8. Default Administrator (1 record)
  // ──────────────────────────────────────────────
  const adminUsername = (process.env.ADMIN_USERNAME || "admin").trim()
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").trim()
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456"
  const adminName = (process.env.ADMIN_NAME || "Bosh Administrator").trim()

  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      isActive: true,
    },
    create: {
      username: adminUsername,
      email: adminEmail,
      name: adminName,
      passwordHash,
      isActive: true,
    },
  })
  console.log("  ✓ Admin (1)")

  // ──────────────────────────────────────────────
  // Reference check — make sure dept relations exist
  // ──────────────────────────────────────────────
  console.log(
    `\n  Department IDs available: IT=${deptIT.id}, Languages=${deptLang.id}`
  )

  console.log("\n✅ Seed complete — development demo data loaded.")
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
