"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { CurrentAdmin } from "@/lib/auth"
import { logoutAdminAction } from "./actions"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCheck,
  BarChart3,
  Image as ImageIcon,
  Share2,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react"

interface AdminSidebarProps {
  admin: CurrentAdmin
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "O'quv bo'limlari", href: "/admin/departments", icon: FolderKanban },
  { name: "O'qituvchilar", href: "/admin/teachers", icon: Users },
  { name: "Rahbariyat", href: "/admin/management", icon: UserCheck },
  { name: "Statistika", href: "/admin/statistics", icon: BarChart3 },
  { name: "Galereya", href: "/admin/gallery", icon: ImageIcon },
  { name: "Ijtimoiy tarmoqlar", href: "/admin/social", icon: Share2 },
  { name: "Ro'yxatdan o'tganlar", href: "/admin/registrations", icon: ClipboardList },
  { name: "Sozlamalar", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMobile = () => setMobileOpen(!mobileOpen)
  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <span>Admin Panel</span>
        </div>
        <button
          onClick={toggleMobile}
          aria-label="Menuni ochish"
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar (Desktop + Mobile overlay) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:transform-none shadow-xl lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={closeMobile}
              className="flex items-center gap-3 font-bold text-lg text-white"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <span>O'quv Markaz</span>
            </Link>
            <button
              onClick={closeMobile}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Admin Footer & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="mb-3 px-2">
            <p className="text-sm font-semibold text-white truncate">{admin.name}</p>
            <p className="text-xs text-slate-400 truncate">@{admin.username}</p>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-red-600/90 text-slate-300 hover:text-white font-medium text-sm rounded-xl transition-all cursor-pointer border border-slate-700 hover:border-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>Chiqish</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
