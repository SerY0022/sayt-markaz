import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { ManagementListClient } from "@/components/admin/management/ManagementListClient"

export const metadata: Metadata = {
  title: "Rahbariyat | Admin Panel",
  description: "O'quv markazi rahbariyatini boshqarish paneli.",
}

export default async function AdminManagementPage() {
  // Server-side authorization guard
  await requireAdmin()

  // Fetch all management members from PostgreSQL database
  const members = await prisma.managementMember.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return <ManagementListClient initialMembers={members} />
}
