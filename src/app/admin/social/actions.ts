"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { SocialPlatform } from "@prisma/client"

const socialSchema = z.object({
  platform: z.nativeEnum(SocialPlatform, {
    message: "Noto'g'ri platforma tanlandi",
  }),
  label: z
    .string()
    .trim()
    .min(2, "Nomi kamida 2 ta belgidan iborat bo'lishi kerak")
    .max(100, "Nomi 100 ta belgidan oshmasligi kerak"),
  url: z
    .string()
    .trim()
    .url("Yaroqli havola (URL) manzilini kiriting")
    .max(500, "URL 500 ta belgidan oshmasligi kerak"),
  sortOrder: z.coerce
    .number({ message: "Tartib raqami to'g'ri son bo'lishi kerak" })
    .int("Tartib raqami butun son bo'lishi kerak")
    .min(0, "Tartib raqami 0 dan kichik bo'lmasligi kerak")
    .max(9999, "Tartib raqami juda katta"),
  isActive: z.boolean().default(true),
})

export type SocialActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export type SocialInput = z.infer<typeof socialSchema>

/**
 * Server Action: Add a new Social Link
 */
export async function createSocialLink(
  input: SocialInput
): Promise<SocialActionState> {
  await requireAdmin()

  const parseResult = socialSchema.safeParse(input)
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
    await prisma.socialLink.create({
      data: {
        platform: data.platform,
        label: data.label,
        url: data.url,
        icon: data.platform, // Using the platform name as the icon, assuming the frontend maps this
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/admin/social")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to create social link:", err)
    return {
      success: false,
      error: "Havolani saqlashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Edit an existing Social Link
 */
export async function updateSocialLink(
  id: number,
  input: SocialInput
): Promise<SocialActionState> {
  await requireAdmin()

  const parseResult = socialSchema.safeParse(input)
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
    await prisma.socialLink.update({
      where: { id },
      data: {
        platform: data.platform,
        label: data.label,
        url: data.url,
        icon: data.platform,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    })

    revalidatePath("/admin/social")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to update social link:", err)
    return {
      success: false,
      error: "Havolani yangilashda kutilmagan xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Toggle active/inactive status
 */
export async function toggleSocialLinkStatus(
  id: number,
  currentStatus: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  try {
    await prisma.socialLink.update({
      where: { id },
      data: { isActive: !currentStatus },
    })

    revalidatePath("/admin/social")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to toggle social link status:", err)
    return {
      success: false,
      error: "Holatni o'zgartirishda xatolik yuz berdi",
    }
  }
}

/**
 * Server Action: Delete a Social Link
 */
export async function deleteSocialLink(
  id: number
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  try {
    await prisma.socialLink.delete({
      where: { id },
    })

    revalidatePath("/admin/social")
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to delete social link:", err)
    return {
      success: false,
      error: "Havolani o'chirishda xatolik yuz berdi",
    }
  }
}
