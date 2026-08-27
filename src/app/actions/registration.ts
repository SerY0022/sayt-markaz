"use server"

import { prisma } from "@/lib/prisma"
import { z } from "zod"

const registrationSchema = z.object({
  fullName: z.string().min(2, "Ism kamida 2 ta harfdan iborat bo'lishi kerak"),
  phone: z.string().min(9, "Telefon raqami noto'g'ri"),
  email: z.string().email("Noto'g'ri email manzil").optional().or(z.literal("")),
  departmentId: z.string().optional(),
  message: z.string().optional(),
  privacyAccepted: z.boolean().or(z.literal("on")).transform(val => val === true || val === "on"),
})

export async function submitRegistration(formData: FormData) {
  try {
    const data = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      departmentId: formData.get("departmentId"),
      message: formData.get("message"),
      privacyAccepted: formData.get("privacyAccepted"),
    }

    const validatedData = registrationSchema.parse(data)
    
    // Parse departmentId. If it's a fallback string like "it", it will be NaN.
    const parsedDeptId = parseInt(validatedData.departmentId || "", 10)
    const isValidDeptId = !isNaN(parsedDeptId)

    // If they chose a fallback department, append it to the message so it's not lost
    let finalMessage = validatedData.message || ""
    if (!isValidDeptId && validatedData.departmentId) {
       finalMessage = `[Tanlangan bo'lim: ${validatedData.departmentId}]\n${finalMessage}`
    }

    await prisma.registration.create({
      data: {
        fullName: validatedData.fullName,
        phone: validatedData.phone,
        email: validatedData.email || null,
        departmentId: isValidDeptId ? parsedDeptId : null,
        message: finalMessage.trim() || null,
        privacyAccepted: validatedData.privacyAccepted,
        status: "NEW",
      },
    })

    return { success: true, message: "Arizangiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz." }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { success: false, error: (error as any).errors[0].message }
    }
    console.error("Registration error:", error)
    return { success: false, error: "Tizim xatosi yuz berdi. Iltimos, keyinroq qayta urinib ko'ring." }
  }
}
