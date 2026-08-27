"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { RegistrationStatus } from "@prisma/client"

export async function updateRegistrationStatus(
  id: number,
  status: RegistrationStatus
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  // Validate status enum
  if (!Object.values(RegistrationStatus).includes(status)) {
    return { success: false, error: "Noto'g'ri status tanlandi" }
  }

  try {
    await prisma.registration.update({
      where: { id },
      data: { status },
    })

    revalidatePath("/admin/registrations")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to update registration status:", err)
    return {
      success: false,
      error: "Statusni yangilashda kutilmagan xatolik yuz berdi",
    }
  }
}

export async function deleteRegistration(
  id: number
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()

  try {
    await prisma.registration.delete({
      where: { id },
    })

    revalidatePath("/admin/registrations")
    revalidatePath("/admin")
    return { success: true }
  } catch (err) {
    console.error("Failed to delete registration:", err)
    return {
      success: false,
      error: "Arizani o'chirishda xatolik yuz berdi",
    }
  }
}
