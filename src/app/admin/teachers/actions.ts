"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

const teacherSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(100, "Ism 100 ta belgidan oshmasligi kerak"),
  position: z
    .string()
    .trim()
    .min(2, "Lavozim kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(100, "Lavozim 100 ta belgidan oshmasligi kerak"),
  specialization: z
    .string()
    .trim()
    .max(100, "Mutaxassislik 100 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal("")),
  experience: z
    .string()
    .trim()
    .max(100, "Tajriba 100 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(1000, "Qisqacha ma'lumot 1000 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal("")),
  image: z
    .string()
    .trim()
    .max(500, "Rasm URL 500 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal("")),
  telegram: z
    .string()
    .trim()
    .max(200, "Telegram havolasi 200 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .trim()
    .max(200, "Instagram havolasi 200 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal("")),
  sortOrder: z.coerce
    .number({ message: "Tartib raqami to'g'ri son bo'lishi kerak" })
    .int("Tartib raqami butun son bo'lishi kerak")
    .min(0, "Tartib raqami 0 dan kichik bo'lmasligi kerak")
    .max(9999, "Tartib raqami juda katta"),
  isActive: z.boolean().default(true),
})

export type TeacherActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export type TeacherInput = z.infer<typeof teacherSchema>

/**
 * Server Action: Add a new Teacher
 */
export async function createTeacher(
  input: TeacherInput
): Promise<TeacherActionState> {
  await requireAdmin()

  const parseResult = teacherSchema.safeParse(input)
  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {}
    parseResult.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        fieldErrors[issue.path[0].toString()] = issue.message
      }
    })
    return {
      success: false,
      error: "Ma'lumotlarni kiritishda xatolik mavjud",
      fieldErrors,
    }
  }

  const data = parseResult.data

  try {
    await prisma.teacher.create({
      data: {
        name: data.name,
        position: data.position,
        specialization: data.specialization || null,
        experience: data.experience || null,
        bio: data.bio || null,
        image: data.image || null,
        telegram: data.telegram || null,
        instagram: data.instagram || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/teachers")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to create teacher:", err)
    return {
      success: false,
      error: "O'qituvchini saqlashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Edit an existing Teacher
 */
export async function updateTeacher(
  id: number,
  input: TeacherInput
): Promise<TeacherActionState> {
  await requireAdmin()

  const parseResult = teacherSchema.safeParse(input)
  if (!parseResult.success) {
    const fieldErrors: Record<string, string> = {}
    parseResult.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        fieldErrors[issue.path[0].toString()] = issue.message
      }
    })
    return {
      success: false,
      error: "Ma'lumotlarni kiritishda xatolik mavjud",
      fieldErrors,
    }
  }

  const data = parseResult.data

  try {
    await prisma.teacher.update({
      where: { id },
      data: {
        name: data.name,
        position: data.position,
        specialization: data.specialization || null,
        experience: data.experience || null,
        bio: data.bio || null,
        image: data.image || null,
        telegram: data.telegram || null,
        instagram: data.instagram || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/teachers")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to update teacher:", err)
    return {
      success: false,
      error: "O'qituvchini yangilashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Toggle active/inactive status
 */
export async function toggleTeacherStatus(
  id: number,
  currentStatus: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  try {
    await prisma.teacher.update({
      where: { id },
      data: { isActive: !currentStatus },
    })

    revalidatePath("/")
    revalidatePath("/admin/teachers")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to toggle teacher status:", err)
    return {
      success: false,
      error: "Holatni o'zgartirishda xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Delete a Teacher
 */
export async function deleteTeacher(
  id: number
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  try {
    await prisma.teacher.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/admin/teachers")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to delete teacher:", err)
    return {
      success: false,
      error: "O'qituvchini o'chirishda xatolik yuz berdi",
    }
  }
}
