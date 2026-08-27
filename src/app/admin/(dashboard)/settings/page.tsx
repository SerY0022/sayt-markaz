import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { SettingsClient } from "@/components/admin/settings/SettingsClient"

export const metadata: Metadata = {
  title: "Sozlamalar | Admin Panel",
  description: "O'quv markazi saytining umumiy sozlamalarini boshqarish.",
}

export default async function AdminSettingsPage() {
  await requireAdmin()

  let settings = await prisma.siteSettings.findUnique({
    where: { id: 1 },
  })

  // If no settings exist yet, pass an empty/default object
  if (!settings) {
    settings = {
      id: 1,
      centerName: "O'quv Markazi",
      logo: null,
      description: null,
      phone: null,
      email: null,
      address: null,
      heroTitle: null,
      heroDescription: null,
      heroImage: null,
      aboutTitle: null,
      aboutDescription: null,
      aboutImage: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  return <SettingsClient initialSettings={settings} />
}
