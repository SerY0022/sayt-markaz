import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { DepartmentListClient } from "@/components/admin/departments/DepartmentListClient"

export const metadata: Metadata = {
  title: "O'quv bo'limlari | Admin Panel",
  description: "O'quv bo'limlarini boshqarish paneli.",
}

export default async function AdminDepartmentsPage() {
  // Server-side authorization guard
  await requireAdmin()

  // Fetch all departments from PostgreSQL database
  const departments = await prisma.department.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return <DepartmentListClient initialDepartments={departments} />
}
