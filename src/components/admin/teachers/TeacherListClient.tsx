"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Users,
  CheckCircle2,
  XCircle,
  Hash,
  Search,
  RefreshCw,
} from "lucide-react"
import { TeacherModal, type TeacherRecord } from "./TeacherModal"
import { DeleteConfirmModal } from "./DeleteConfirmModal"
import { toggleTeacherStatus } from "@/app/admin/teachers/actions"

interface TeacherListClientProps {
  initialTeachers: TeacherRecord[]
}

export function TeacherListClient({
  initialTeachers,
}: TeacherListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [teachers, setTeachers] = useState<TeacherRecord[]>(initialTeachers)
  const [searchQuery, setSearchQuery] = useState("")

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [teacherToEdit, setTeacherToEdit] = useState<TeacherRecord | null>(null)
  const [teacherToDelete, setTeacherToDelete] = useState<TeacherRecord | null>(null)

  // Toggle loading tracking per teacher ID
  const [togglingId, setTogglingId] = useState<number | null>(null)

  // Handle refresh success
  const handleSuccess = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  // Handle active/inactive toggle
  const handleToggleStatus = async (teacher: TeacherRecord) => {
    setTogglingId(teacher.id)

    // Optimistic UI update
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacher.id ? { ...t, isActive: !t.isActive } : t))
    )

    const res = await toggleTeacherStatus(teacher.id, teacher.isActive)
    setTogglingId(null)

    if (!res.success) {
      // Revert on error
      setTeachers((prev) =>
        prev.map((t) => (t.id === teacher.id ? { ...t, isActive: teacher.isActive } : t))
      )
      alert(res.error || "Holatni o'zgartirishda xatolik yuz berdi")
    } else {
      handleSuccess()
    }
  }

  // Filtered teachers based on search (uses teachers state)
  const currentList = teachers.length > 0 ? teachers : initialTeachers

  const filteredTeachers = currentList.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.position.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const modalKey = teacherToEdit
    ? `edit-${teacherToEdit.id}`
    : `add-${isAddModalOpen}`

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/50">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                O'qituvchilar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                Jami: {currentList.length} ta
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              O'quv markazining o'qituvchilari va mentorlarini boshqarish
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setTeacherToEdit(null)
            setIsAddModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ O'qituvchi qo'shish</span>
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
            placeholder="Ism yoki lavozim bo'yicha izlash..."
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
      {filteredTeachers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            O'qituvchilar topilmadi
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "Qidiruv so'rovingizga mos keladigan o'qituvchi topilmadi."
              : "Hozircha hech qanday o'qituvchi qo'shilmagan."}
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
                    <th className="py-3.5 px-4 w-16">Rasm</th>
                    <th className="py-3.5 px-4">Ism Familiya / Lavozim</th>
                    <th className="py-3.5 px-4">Mutaxassislik / Tajriba</th>
                    <th className="py-3.5 px-4 text-center">Tartib</th>
                    <th className="py-3.5 px-4 text-center">Holati</th>
                    <th className="py-3.5 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTeachers.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Image */}
                      <td className="py-3.5 px-4">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                          {t.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={t.image}
                              alt={t.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                ;(e.target as HTMLElement).style.display = "none"
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Name & Position */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {t.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t.position}
                        </div>
                      </td>

                      {/* Specialization & Experience */}
                      <td className="py-3.5 px-4">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {t.specialization || "—"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t.experience || "—"}
                        </div>
                      </td>

                      {/* Sort Order */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          <Hash className="w-3 h-3 text-slate-400" />
                          {t.sortOrder}
                        </span>
                      </td>

                      {/* Active Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={togglingId === t.id}
                          onClick={() => handleToggleStatus(t)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            t.isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                          } ${togglingId === t.id ? "opacity-50" : ""}`}
                          title="Holatni o'zgartirish uchun bosing"
                        >
                          {t.isActive ? (
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

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                           type="button"
                            onClick={() => {
                              setTeacherToEdit(t)
                              setIsAddModalOpen(true)
                            }}
                            className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-all cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTeacherToDelete(t)}
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
          <div className="sm:hidden space-y-4">
            {filteredTeachers.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      {t.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = "none"
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {t.name}
                      </h3>
                      <span className="font-medium text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        {t.position}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={togglingId === t.id}
                    onClick={() => handleToggleStatus(t)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      t.isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {t.isActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Faol
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-slate-400" /> Nofaol
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col gap-1 mt-2 p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">Mutaxassisligi:</span> {t.specialization || "—"}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">Tajribasi:</span> {t.experience || "—"}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Tartib: <strong className="text-slate-900 dark:text-white">#{t.sortOrder}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTeacherToEdit(t)
                        setIsAddModalOpen(true)
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900/50"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeacherToDelete(t)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      <TeacherModal
        key={modalKey}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setTeacherToEdit(null)
        }}
        teacherToEdit={teacherToEdit}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(teacherToDelete)}
        teacher={teacherToDelete}
        onClose={() => setTeacherToDelete(null)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
