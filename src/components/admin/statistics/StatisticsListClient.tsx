"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  BarChart3,
  CheckCircle2,
  XCircle,
  Hash,
  Search,
  RefreshCw,
} from "lucide-react"
import { StatisticsModal, type StatisticRecord } from "./StatisticsModal"
import { DeleteConfirmModal } from "./DeleteConfirmModal"
import { toggleStatisticStatus } from "@/app/admin/statistics/actions"

interface StatisticsListClientProps {
  initialStatistics: StatisticRecord[]
}

export function StatisticsListClient({
  initialStatistics,
}: StatisticsListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [statistics, setStatistics] = useState<StatisticRecord[]>(initialStatistics)
  const [searchQuery, setSearchQuery] = useState("")

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [statisticToEdit, setStatisticToEdit] = useState<StatisticRecord | null>(null)
  const [statisticToDelete, setStatisticToDelete] = useState<StatisticRecord | null>(null)

  // Toggle loading tracking per statistic ID
  const [togglingId, setTogglingId] = useState<number | null>(null)

  // Handle refresh success
  const handleSuccess = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  // Handle active/inactive toggle
  const handleToggleStatus = async (statistic: StatisticRecord) => {
    setTogglingId(statistic.id)

    // Optimistic UI update
    setStatistics((prev) =>
      prev.map((s) => (s.id === statistic.id ? { ...s, isActive: !s.isActive } : s))
    )

    const res = await toggleStatisticStatus(statistic.id, statistic.isActive)
    setTogglingId(null)

    if (!res.success) {
      // Revert on error
      setStatistics((prev) =>
        prev.map((s) => (s.id === statistic.id ? { ...s, isActive: statistic.isActive } : s))
      )
      alert(res.error || "Holatni o'zgartirishda xatolik yuz berdi")
    } else {
      handleSuccess()
    }
  }

  // Filtered statistics based on search (uses statistics state)
  const currentList = statistics.length > 0 ? statistics : initialStatistics

  const filteredStatistics = currentList.filter(
    (s) =>
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.value.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const modalKey = statisticToEdit
    ? `edit-${statisticToEdit.id}`
    : `add-${isAddModalOpen}`

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/50">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Statistika
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                Jami: {currentList.length} ta
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Asosiy sahifadagi statistika raqamlarini boshqarish
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setStatisticToEdit(null)
            setIsAddModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Statistika qo'shish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom yoki qiymat bo'yicha izlash..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {isPending && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
            <span>Yangilanmoqda...</span>
          </div>
        )}
      </div>

      {/* Content: Empty State */}
      {filteredStatistics.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Statistika topilmadi
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "Qidiruv so'rovingizga mos keladigan statistika topilmadi."
              : "Hozircha hech qanday statistika qo'shilmagan."}
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW (sm and up) */}
          <div className="hidden sm:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Nom</th>
                    <th className="py-3.5 px-4 font-bold">Qiymat</th>
                    <th className="py-3.5 px-4 text-center">Tartib</th>
                    <th className="py-3.5 px-4 text-center">Holati</th>
                    <th className="py-3.5 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStatistics.map((s, idx) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {s.label}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          {s.value}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          <Hash className="w-3 h-3 text-slate-400" />
                          {s.sortOrder}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={togglingId === s.id}
                          onClick={() => handleToggleStatus(s)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            s.isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                          } ${togglingId === s.id ? "opacity-50" : ""}`}
                          title="Holatni o'zgartirish uchun bosing"
                        >
                          {s.isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Faol</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-slate-400" />
                              <span>Nofaol</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                           type="button"
                            onClick={() => {
                              setStatisticToEdit(s)
                              setIsAddModalOpen(true)
                            }}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatisticToDelete(s)}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-all cursor-pointer"
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

          {/* MOBILE CARDS VIEW (sm and below) */}
          <div className="sm:hidden grid grid-cols-2 gap-3">
            {filteredStatistics.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <Hash className="w-3 h-3" />
                      {s.sortOrder}
                    </span>
                    <button
                      type="button"
                      disabled={togglingId === s.id}
                      onClick={() => handleToggleStatus(s)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        s.isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {s.isActive ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Faol
                        </>
                      ) : (
                        <>
                          <XCircle className="w-2.5 h-2.5 text-slate-400" /> Nofaol
                        </>
                      )}
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-2xl text-blue-600 dark:text-blue-400 mb-1">
                    {s.value}
                  </h3>
                  <span className="font-medium text-sm text-slate-700 dark:text-slate-300">
                    {s.label}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setStatisticToEdit(s)
                        setIsAddModalOpen(true)
                      }}
                      className="flex-1 inline-flex justify-center items-center gap-1 px-2 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900/50"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatisticToDelete(s)}
                      className="flex-1 inline-flex justify-center items-center gap-1 px-2 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      <StatisticsModal
        key={modalKey}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setStatisticToEdit(null)
        }}
        statisticToEdit={statisticToEdit}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(statisticToDelete)}
        statistic={statisticToDelete}
        onClose={() => setStatisticToDelete(null)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
