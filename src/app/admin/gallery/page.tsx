import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import AdminDashboardLayout from "../(dashboard)/layout"
import { GalleryListClient } from "@/components/admin/gallery/GalleryListClient"

export const metadata: Metadata = {
  title: "Galereya | Admin Panel",
  description: "O'quv markazi rasmlar galereyasini boshqarish.",
}

export default async function AdminGalleryPage() {
  // Server-side authorization guard
  await requireAdmin()

  // Fetch all gallery items from PostgreSQL database
  const galleryItems = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  })

  return (
    <AdminDashboardLayout>
      <GalleryListClient initialGallery={galleryItems} />
    </AdminDashboardLayout>
  )
}
