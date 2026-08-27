import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { StatisticsListClient } from "@/components/admin/statistics/StatisticsListClient"

export const metadata: Metadata = {
  title: "Statistika | Admin Panel",
  description: "Asosiy sahifadagi statistika raqamlarini boshqarish paneli.",
}

export default async function AdminStatisticsPage() {
  // Server-side authorization guard
  await requireAdmin()

  // Fetch all statistics from PostgreSQL database
  const statistics = await prisma.statistic.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return <StatisticsListClient initialStatistics={statistics} />
}
