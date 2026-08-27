"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

const settingsSchema = z.object({
  centerName: z.string().trim().min(2, "Markaz nomi kamida 2 ta belgidan iborat bo'lishi kerak"),
  logo: z.string().trim().url("Yaroqli havola kiring (URL)").or(z.literal("")).optional(),
  description: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Yaroqli elektron pochta manzilini kiriting").or(z.literal("")).optional(),
  address: z.string().trim().optional(),
  heroTitle: z.string().trim().optional(),
  heroDescription: z.string().trim().optional(),
  heroImage: z.string().trim().url("Yaroqli havola kiring (URL)").or(z.literal("")).optional(),
  aboutTitle: z.string().trim().optional(),
  aboutDescription: z.string().trim().optional(),
  aboutImage: z.string().trim().url("Yaroqli havola kiring (URL)").or(z.literal("")).optional(),
})

export type SettingsInput = z.infer<typeof settingsSchema>

export type SettingsActionState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

/**
 * Server Action: Update or Create Site Settings
 */
export async function saveSiteSettings(
  input: SettingsInput
): Promise<SettingsActionState> {
  await requireAdmin()

  const parseResult = settingsSchema.safeParse(input)
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
  
  // Convert empty strings to null for database optional fields if preferred,
  // or just store empty strings. We'll store what was provided.
  const payload = {
    centerName: data.centerName,
    logo: data.logo || null,
    description: data.description || null,
    phone: data.phone || null,
    email: data.email || null,
    address: data.address || null,
    heroTitle: data.heroTitle || null,
    heroDescription: data.heroDescription || null,
    heroImage: data.heroImage || null,
    aboutTitle: data.aboutTitle || null,
    aboutDescription: data.aboutDescription || null,
    aboutImage: data.aboutImage || null,
  }

  try {
    // We assume there is only one setting record, usually ID = 1.
    // If it doesn't exist, we create it.
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: payload,
      create: {
        id: 1,
        ...payload,
      },
    })

    revalidatePath("/admin/settings")
    revalidatePath("/")
    return { success: true }
  } catch (err) {
    console.error("Failed to save site settings:", err)
    return {
      success: false,
      error: "Sozlamalarni saqlashda kutilmagan xatolik yuz berdi",
    }
  }
}
