import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { AdminSidebar } from "../AdminSidebar"

export const metadata: Metadata = {
  title: "Admin Panel | O'quv Markaz",
  description: "O'quv Markaz administrator boshqaruv paneli.",
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enforce server-side authentication guard for all dashboard routes
  const admin = await requireAdmin()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100">
      <AdminSidebar admin={admin} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  )
}
