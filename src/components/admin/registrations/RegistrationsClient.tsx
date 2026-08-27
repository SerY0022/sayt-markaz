"use client"

import { useState, useTransition, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  Eye,
  Trash2,
  ClipboardList,
  RefreshCw,
} from "lucide-react"
import { RegistrationStatus } from "@prisma/client"
import { RegistrationDetailModal, type RegistrationRecord } from "./RegistrationDetailModal"
import { DeleteConfirmModal } from "./DeleteConfirmModal"

export const statusLabels: Record<RegistrationStatus, string> = {
  NEW: "Yangi",
  CONTACTED: "Bog'lanildi",
  COMPLETED: "Yakunlandi",
  CANCELLED: "Bekor qilindi",
}

export const statusColors: Record<RegistrationStatus, string> = {
  NEW: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/50",
  CONTACTED: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50",
  COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50",
  CANCELLED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/50",
}

interface RegistrationsClientProps {
  initialRegistrations: RegistrationRecord[]
  departments: { id: number; title: string }[]
}

export function RegistrationsClient({
  initialRegistrations,
  departments,
}: RegistrationsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // State
  const registrations = initialRegistrations
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | "ALL">("ALL")
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL")

  // Modals
  const [viewRegistration, setViewRegistration] = useState<RegistrationRecord | null>(null)
  const [deleteRegistration, setDeleteRegistration] = useState<RegistrationRecord | null>(null)

  // Handlers
  const handleSuccess = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  // Derived state (filtering & searching)
  const filteredRegistrations = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return registrations.filter((reg) => {
      const matchesSearch =
        reg.fullName.toLowerCase().includes(query) ||
        reg.phone.toLowerCase().includes(query) ||
        (reg.email && reg.email.toLowerCase().includes(query))
      const matchesStatus = statusFilter === "ALL" || reg.status === statusFilter
      const matchesDept =
        departmentFilter === "ALL" ||
        (departmentFilter === "NONE" && !reg.departmentId) ||
        reg.departmentId?.toString() === departmentFilter

      return matchesSearch && matchesStatus && matchesDept
    })
  }, [registrations, searchQuery, statusFilter, departmentFilter])

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/50">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Arizalar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                Jami: {registrations.length} ta
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              O'quv markaziga qoldirilgan arizalarni boshqarish
            </p>
          </div>
        </div>

        {isPending && (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mr-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
            Yangilanmoqda...
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Ism, telefon yoki pochta orqali qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RegistrationStatus | "ALL")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm appearance-none"
          >
            <option value="ALL">Barcha holatlar</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm appearance-none"
          >
            <option value="ALL">Barcha yo'nalishlar</option>
            <option value="NONE">Yo'nalish tanlanmagan</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id.toString()}>
                {d.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content: Empty State */}
      {filteredRegistrations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Arizalar topilmadi
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Qidiruv yoki filtrlash shartlariga mos keladigan ariza mavjud emas.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredRegistrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                      {reg.fullName}
                    </h4>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {reg.phone}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap border ${statusColors[reg.status]}`}>
                    {statusLabels[reg.status]}
                  </span>
                </div>
                
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span className="line-clamp-1 flex-1 pr-2">
                    {reg.department?.title || "Yo'nalish tanlanmagan"}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(reg.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setViewRegistration(reg)}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ko'rish
                  </button>
                  <button
                    onClick={() => setDeleteRegistration(reg)}
                    className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Ariza Beruvchi
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Yo'nalish
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Sana
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Holati
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white text-sm">
                          {reg.fullName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                          {reg.phone}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {reg.department ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                            {reg.department.title}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Tanlanmagan</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(reg.createdAt).toLocaleString("uz-UZ", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[reg.status]}`}>
                          {statusLabels[reg.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewRegistration(reg)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 transition-colors"
                            title="Ko'rish"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteRegistration(reg)}
                            className="p-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Details Modal */}
      <RegistrationDetailModal
        isOpen={Boolean(viewRegistration)}
        registration={viewRegistration}
        onClose={() => setViewRegistration(null)}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteRegistration)}
        registration={deleteRegistration}
        onClose={() => setDeleteRegistration(null)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
