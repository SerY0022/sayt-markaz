/**
 * Server-Side Authentication & Authorization Helpers — Phase 4B
 *
 * Provides functions for session creation, cookie management,
 * token hashing, password verification, and server-side authorization.
 *
 * SECURITY GUARANTEES:
 * - Session tokens are NEVER stored raw in DB (hashed via SHA-256).
 * - Session cookies are HttpOnly, Secure in prod, SameSite=Lax.
 * - Password hashes are NEVER returned to the client.
 * - Server actions & components enforce authorization via requireAdmin().
 */

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const SESSION_COOKIE_NAME = "admin_session"
const SESSION_DURATION_DAYS = 7
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000

export type CurrentAdmin = {
  id: number
  username: string
  email: string
  name: string
  isActive: boolean
  lastLoginAt: Date | null
}

/**
 * Hash raw password using bcrypt (12 salt rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Verify raw password against stored bcrypt hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Hash a session token using SHA-256 for secure database storage.
 * The raw token is sent only in the HttpOnly cookie.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}

/**
 * Create a new admin session in DB and set HttpOnly session cookie
 */
export async function createAdminSession(adminId: number): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex")
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await prisma.adminSession.create({
    data: {
      adminId,
      tokenHash,
      expiresAt,
    },
  })

  await prisma.admin.update({
    where: { id: adminId },
    data: { lastLoginAt: new Date() },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
}

/**
 * Destroy current session in DB and remove cookie
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    const tokenHash = hashToken(token)
    try {
      await prisma.adminSession.deleteMany({
        where: { tokenHash },
      })
    } catch {
      // Ignore error if session was already deleted
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Server-side helper to get current authenticated admin.
 * Returns null if unauthenticated, expired session, or inactive account.
 */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const tokenHash = hashToken(token)

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: {
      admin: {
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          isActive: true,
          lastLoginAt: true,
        },
      },
    },
  })

  if (!session) {
    return null
  }

  // Check expiration
  if (session.expiresAt < new Date()) {
    await destroyAdminSession()
    return null
  }

  // Check active status
  if (!session.admin.isActive) {
    await destroyAdminSession()
    return null
  }

  // Update lastUsedAt timestamp periodically (every 5 minutes)
  const FIVE_MINUTES = 5 * 60 * 1000
  if (Date.now() - session.lastUsedAt.getTime() > FIVE_MINUTES) {
    prisma.adminSession
      .update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() },
      })
      .catch(() => {})
  }

  return session.admin
}

/**
 * Server-side authorization guard.
 * Must be called in protected server components or server actions.
 * Redirects to /admin/login if not authenticated.
 */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect("/admin/login")
  }
  return admin
}
