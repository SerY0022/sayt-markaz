import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { RegistrationsClient } from "@/components/admin/registrations/RegistrationsClient"

export const metadata: Metadata = {
  title: "Arizalar | Admin Panel",
  description: "O'quv markaziga kelib tushgan arizalarni boshqarish.",
}

export default async function AdminRegistrationsPage() {
  // Server-side authorization guard
  await requireAdmin()

  // Fetch all registrations from PostgreSQL database, including selected department and ordering by newest first
  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      department: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })

  // Fetch departments for filtering
  const departments = await prisma.department.findMany({
    where: { isActive: true },
    select: { id: true, title: true },
    orderBy: { sortOrder: "asc" },
  })

  return <RegistrationsClient initialRegistrations={registrations} departments={departments} />
}
