"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

// Slug regex: lowercase letters, numbers, and hyphens (e.g., "it-dasturlash")
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const departmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Bo'lim nomi kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(100, "Bo'lim nomi 100 ta belgidan oshmasligi kerak"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(100, "Slug 100 ta belgidan oshmasligi kerak")
    .regex(
      slugRegex,
      "Slug faqat kichik lotin harflari, raqamlar va chiziqcha (-) belgisidan iborat bo'lishi kerak"
    ),
  description: z
    .string()
    .trim()
    .max(1000, "Tavsif 1000 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal("")),
  image: z
    .string()
    .trim()
    .max(500, "Rasm URL 500 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal("")),
  sortOrder: z.coerce
    .number({ message: "Tartib raqami to'g'ri son bo'lishi kerak" })
    .int("Tartib raqami butun son bo'lishi kerak")
    .min(0, "Tartib raqami 0 dan kichik bo'lmasligi kerak")
    .max(9999, "Tartib raqami juda katta"),
  isActive: z.boolean().default(true),
})

export type DepartmentActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export type DepartmentInput = {
  title: string
  slug: string
  description?: string | null
  image?: string | null
  sortOrder: number
  isActive: boolean
}

/**
 * Server Action: Add a new Department
 */
export async function createDepartment(
  input: DepartmentInput
): Promise<DepartmentActionState> {
  // 1. Verify admin authorization server-side
  await requireAdmin()

  // 2. Validate input schema
  const parseResult = departmentSchema.safeParse(input)
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

  // 3. Unique slug check
  const existing = await prisma.department.findUnique({
    where: { slug: data.slug },
  })

  if (existing) {
    return {
      success: false,
      error: "Ushbu slug band, iltimos boshqa slug kiriting",
      fieldErrors: {
        slug: "Ushbu slug bilan o'quv bo'limi allaqachon mavjud",
      },
    }
  }

  // 4. Prisma insert
  try {
    await prisma.department.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/departments")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to create department:", err)
    return {
      success: false,
      error: "Bo'limni saqlashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Edit an existing Department
 */
export async function updateDepartment(
  id: number,
  input: DepartmentInput
): Promise<DepartmentActionState> {
  // 1. Verify admin authorization server-side
  await requireAdmin()

  // 2. Validate input schema
  const parseResult = departmentSchema.safeParse(input)
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

  // 3. Check for slug collision with other records
  const existing = await prisma.department.findFirst({
    where: {
      slug: data.slug,
      NOT: { id },
    },
  })

  if (existing) {
    return {
      success: false,
      error: "Ushbu slug band, iltimos boshqa slug kiriting",
      fieldErrors: {
        slug: "Ushbu slug bilan boshqa o'quv bo'limi allaqachon mavjud",
      },
    }
  }

  // 4. Prisma update
  try {
    await prisma.department.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/")
    revalidatePath("/admin/departments")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to update department:", err)
    return {
      success: false,
      error: "Bo'limni yangilashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Toggle active/inactive status
 */
export async function toggleDepartmentStatus(
  id: number,
  currentStatus: boolean
): Promise<{ success: boolean; error?: string }> {
  // 1. Verify admin authorization server-side
  await requireAdmin()

  try {
    await prisma.department.update({
      where: { id },
      data: { isActive: !currentStatus },
    })

    revalidatePath("/")
    revalidatePath("/admin/departments")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to toggle department status:", err)
    return {
      success: false,
      error: "Holatni o'zgartirishda xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Delete a Department
 * Registration records with departmentId reference will be set to NULL (onDelete: SetNull).
 */
export async function deleteDepartment(
  id: number
): Promise<{ success: boolean; error?: string }> {
  // 1. Verify admin authorization server-side
  await requireAdmin()

  try {
    await prisma.department.delete({
      where: { id },
    })

    revalidatePath("/")
    revalidatePath("/admin/departments")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to delete department:", err)
    return {
      success: false,
      error: "Bo'limni o'chirishda xatolik yuz berdi",
    }
  }
}
