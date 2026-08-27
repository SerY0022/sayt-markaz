import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { SocialListClient } from "@/components/admin/social/SocialListClient"

export const metadata: Metadata = {
  title: "Ijtimoiy tarmoqlar | Admin Panel",
  description: "O'quv markazining ijtimoiy tarmoqlarini boshqarish.",
}

export default async function AdminSocialPage() {
  // Server-side authorization guard
  await requireAdmin()

  // Fetch all social links from PostgreSQL database
  const socialLinks = await prisma.socialLink.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return <SocialListClient initialSocials={socialLinks} />
}
