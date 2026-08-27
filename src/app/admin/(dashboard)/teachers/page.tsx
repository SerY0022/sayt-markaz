import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { TeacherListClient } from "@/components/admin/teachers/TeacherListClient"

export const metadata: Metadata = {
  title: "O'qituvchilar | Admin Panel",
  description: "O'qituvchilar va mentorlarni boshqarish paneli.",
}

export default async function AdminTeachersPage() {
  // Server-side authorization guard
  await requireAdmin()

  // Fetch all teachers from PostgreSQL database
  const teachers = await prisma.teacher.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return <TeacherListClient initialTeachers={teachers} />
}
