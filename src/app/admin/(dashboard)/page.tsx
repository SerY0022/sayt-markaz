import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getCurrentAdmin } from "@/lib/auth"
import {
  FolderKanban,
  Users,
  UserCheck,
  ClipboardList,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Bosh sahifa | Admin Panel",
}

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin()

  // Fetch real counts from PostgreSQL
  const [departmentCount, teacherCount, managementCount, registrationCount] =
    await Promise.all([
      prisma.department.count(),
      prisma.teacher.count(),
      prisma.managementMember.count(),
      prisma.registration.count(),
    ])

  const stats = [
    {
      title: "O'quv bo'limlari",
      count: departmentCount,
      href: "/admin/departments",
      icon: FolderKanban,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    },
    {
      title: "O'qituvchilar",
      count: teacherCount,
      href: "/admin/teachers",
      icon: Users,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
    },
    {
      title: "Rahbariyat",
      count: managementCount,
      href: "/admin/management",
      icon: UserCheck,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50",
    },
    {
      title: "Ro'yxatdan o'tganlar",
      count: registrationCount,
      href: "/admin/registrations",
      icon: ClipboardList,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-medium text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Xavfsiz Boshqaruv Paneli</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Xush kelibsiz, {admin?.name || "Administrator"}!
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Bu yerda o'quv markaz tizimi ma'lumotlarini boshqarishingiz mumkin. Quyida ma'lumotlar bazasidagi joriy holat ko'rsatilgan.
          </p>

          {admin?.lastLoginAt && (
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Oxirgi kirish vaqti:{" "}
                {new Date(admin.lastLoginAt).toLocaleString("uz-UZ", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Real Statistics Overview Grid */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Tizim Ma'lumotlari
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {stat.title}
                    </span>
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border ${stat.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.count}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={stat.href}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center justify-between group"
                  >
                    <span>Bo'limga o'tish</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
          Bo'limlar Boshqaruvi
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Tizimdagi bo'limlarni boshqarish uchun chap tomondagi menyu bo'limlaridan foydalanishingiz mumkin.
        </p>
      </div>
    </div>
  )
}
