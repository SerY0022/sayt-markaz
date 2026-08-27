"use server"

/**
 * Server Actions — Admin Authentication & Session Control
 * Phase 4B
 */

import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import {
  createAdminSession,
  destroyAdminSession,
  verifyPassword,
} from "@/lib/auth"
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rate-limit"

// Schema validation using Zod
const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "Login kiritilishi shart")
    .trim(),
  password: z.string().min(1, "Parol kiritilishi shart"),
})

export type LoginActionState = {
  error?: string
  success?: boolean
}

/**
 * Handles admin login submission.
 * Enforces rate limiting, constant-time failure response, generic error messages,
 * and sets HttpOnly session cookies.
 */
export async function loginAdminAction(
  _prevState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
  const rawInput = {
    usernameOrEmail: formData.get("usernameOrEmail"),
    password: formData.get("password"),
  }

  const validation = loginSchema.safeParse(rawInput)

  if (!validation.success) {
    return {
      error: "Login yoki parol noto'g'ri.",
    }
  }

  const { usernameOrEmail, password } = validation.data

  // 1. Check rate limit
  const rateLimitStatus = checkRateLimit(usernameOrEmail)
  if (!rateLimitStatus.allowed) {
    return {
      error: `Juda ko'p muvaffaqiyatsiz urinishlar. Iltimos, ${rateLimitStatus.retryAfterSeconds} sekunddan so'ng qayta urinib ko'ring.`,
    }
  }

  // Generic delay function for constant-time responses on error
  const timingDelay = () => new Promise((res) => setTimeout(res, 500))

  // 2. Find active admin by username OR email
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [
        { username: { equals: usernameOrEmail, mode: "insensitive" } },
        { email: { equals: usernameOrEmail, mode: "insensitive" } },
      ],
    },
  })

  if (!admin || !admin.isActive) {
    recordFailedAttempt(usernameOrEmail)
    await timingDelay()
    return { error: "Login yoki parol noto'g'ri." }
  }

  // 3. Verify password hash
  const isPasswordValid = await verifyPassword(password, admin.passwordHash)

  if (!isPasswordValid) {
    recordFailedAttempt(usernameOrEmail)
    await timingDelay()
    return { error: "Login yoki parol noto'g'ri." }
  }

  // 4. Clear failed attempts & create session
  resetRateLimit(usernameOrEmail)
  await createAdminSession(admin.id)

  // 5. Redirect to admin dashboard
  redirect("/admin")
}

/**
 * Handles admin logout.
 * Invalidates session in database, clears cookie, and redirects to login.
 */
export async function logoutAdminAction(): Promise<void> {
  await destroyAdminSession()
  redirect("/admin/login")
}
