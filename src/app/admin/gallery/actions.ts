"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

const gallerySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Sarlavha kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(200, "Sarlavha 200 ta belgidan oshmasligi kerak"),
  description: z
    .string()
    .trim()
    .max(1000, "Tavsif 1000 ta belgidan oshmasligi kerak")
    .optional()
    .or(z.literal("")),
  image: z
    .string()
    .trim()
    .url("Yaroqli rasm URL manzilini kiriting")
    .max(500, "Rasm URL 500 ta belgidan oshmasligi kerak"),
  sortOrder: z.coerce
    .number({ message: "Tartib raqami to'g'ri son bo'lishi kerak" })
    .int("Tartib raqami butun son bo'lishi kerak")
    .min(0, "Tartib raqami 0 dan kichik bo'lmasligi kerak")
    .max(9999, "Tartib raqami juda katta"),
  isActive: z.boolean().default(true),
})

export type GalleryActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export type GalleryInput = z.infer<typeof gallerySchema>

/**
 * Server Action: Add a new Gallery Item
 */
export async function createGalleryItem(
  input: GalleryInput
): Promise<GalleryActionState> {
  await requireAdmin()

  const parseResult = gallerySchema.safeParse(input)
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
    await prisma.galleryItem.create({
      data: {
        title: data.title,
        description: data.description || null,
        image: data.image,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/admin/gallery")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to create gallery item:", err)
    return {
      success: false,
      error: "Rasmni saqlashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Edit an existing Gallery Item
 */
export async function updateGalleryItem(
  id: number,
  input: GalleryInput
): Promise<GalleryActionState> {
  await requireAdmin()

  const parseResult = gallerySchema.safeParse(input)
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
    await prisma.galleryItem.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description || null,
        image: data.image,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/admin/gallery")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to update gallery item:", err)
    return {
      success: false,
      error: "Rasmni yangilashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Toggle active/inactive status
 */
export async function toggleGalleryItemStatus(
  id: number,
  currentStatus: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  try {
    await prisma.galleryItem.update({
      where: { id },
      data: { isActive: !currentStatus },
    })

    revalidatePath("/admin/gallery")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to toggle gallery status:", err)
    return {
      success: false,
      error: "Holatni o'zgartirishda xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Delete a Gallery Item
 */
export async function deleteGalleryItem(
  id: number
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  try {
    await prisma.galleryItem.delete({
      where: { id },
    })

    revalidatePath("/admin/gallery")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to delete gallery item:", err)
    return {
      success: false,
      error: "Rasmni o'chirishda xatolik yuz berdi",
    }
  }
}
