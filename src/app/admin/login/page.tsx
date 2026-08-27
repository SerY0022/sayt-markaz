import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getCurrentAdmin } from "@/lib/auth"
import { LoginForm } from "./LoginForm"

export const metadata: Metadata = {
  title: "Kirish | Admin Panel",
  description: "Administrator paneli uchun xavfsiz kirish sahifasi.",
}

export default async function AdminLoginPage() {
  // If already authenticated, redirect to /admin
  const currentAdmin = await getCurrentAdmin()
  if (currentAdmin) {
    redirect("/admin")
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950">
      <LoginForm />
    </main>
  )
}
