import Link from "next/link"
import { Construction, ArrowLeft } from "lucide-react"

interface AdminPlaceholderProps {
  title: string
  description?: string
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboardga qaytish</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 border border-amber-200 dark:border-amber-900/50">
          <Construction className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
          {description || "Bu bo'lim keyingi bosqichda ishlab chiqiladi."}
        </p>
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          Holati: Tayyorlanmoqda (Phase 4B)
        </div>
      </div>
    </div>
  )
}
