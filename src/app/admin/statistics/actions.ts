"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

const statisticSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Nom kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(100, "Nom 100 ta belgidan oshmasligi kerak"),
  value: z
    .string()
    .trim()
    .min(1, "Qiymat kiritilishi shart")
    .max(50, "Qiymat 50 ta belgidan oshmasligi kerak"),
  sortOrder: z.coerce
    .number({ message: "Tartib raqami to'g'ri son bo'lishi kerak" })
    .int("Tartib raqami butun son bo'lishi kerak")
    .min(0, "Tartib raqami 0 dan kichik bo'lmasligi kerak")
    .max(9999, "Tartib raqami juda katta"),
  isActive: z.boolean().default(true),
})

export type StatisticActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export type StatisticInput = z.infer<typeof statisticSchema>

/**
 * Server Action: Add a new Statistic
 */
export async function createStatistic(
  input: StatisticInput
): Promise<StatisticActionState> {
  await requireAdmin()

  const parseResult = statisticSchema.safeParse(input)
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
    await prisma.statistic.create({
      data: {
        label: data.label,
        value: data.value,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/admin/statistics")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to create statistic:", err)
    return {
      success: false,
      error: "Statistikani saqlashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Edit an existing Statistic
 */
export async function updateStatistic(
  id: number,
  input: StatisticInput
): Promise<StatisticActionState> {
  await requireAdmin()

  const parseResult = statisticSchema.safeParse(input)
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
    await prisma.statistic.update({
      where: { id },
      data: {
        label: data.label,
        value: data.value,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/admin/statistics")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to update statistic:", err)
    return {
      success: false,
      error: "Statistikani yangilashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Toggle active/inactive status
 */
export async function toggleStatisticStatus(
  id: number,
  currentStatus: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  try {
    await prisma.statistic.update({
      where: { id },
      data: { isActive: !currentStatus },
    })

    revalidatePath("/admin/statistics")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to toggle statistic status:", err)
    return {
      success: false,
      error: "Holatni o'zgartirishda xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Delete a Statistic
 */
export async function deleteStatistic(
  id: number
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  try {
    await prisma.statistic.delete({
      where: { id },
    })

    revalidatePath("/admin/statistics")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to delete statistic:", err)
    return {
      success: false,
      error: "Statistikani o'chirishda xatolik yuz berdi",
    }
  }
}
