"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  Share2,
  CheckCircle2,
  XCircle,
  Hash,
  RefreshCw,
} from "lucide-react"
import { SocialModal, type SocialRecord } from "./SocialModal"
import { DeleteConfirmModal } from "./DeleteConfirmModal"
import { toggleSocialLinkStatus } from "@/app/admin/social/actions"
import { platformIcons, platformNames } from "./platformConfig"

interface SocialListClientProps {
  initialSocials: SocialRecord[]
}

export function SocialListClient({
  initialSocials,
}: SocialListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [socials, setSocials] = useState<SocialRecord[]>(initialSocials)

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [socialToEdit, setSocialToEdit] = useState<SocialRecord | null>(null)
  const [socialToDelete, setSocialToDelete] = useState<SocialRecord | null>(null)

  // Toggle loading tracking per ID
  const [togglingId, setTogglingId] = useState<number | null>(null)

  // Handle refresh success
  const handleSuccess = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  // Handle active/inactive toggle
  const handleToggleStatus = async (item: SocialRecord) => {
    setTogglingId(item.id)

    // Optimistic UI update
    setSocials((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, isActive: !s.isActive } : s))
    )

    const res = await toggleSocialLinkStatus(item.id, item.isActive)
    setTogglingId(null)

    if (!res.success) {
      // Revert on error
      setSocials((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, isActive: item.isActive } : s))
      )
      alert(res.error || "Holatni o'zgartirishda xatolik yuz berdi")
    } else {
      handleSuccess()
    }
  }

  // Render list
  const currentList = socials.length > 0 ? socials : initialSocials

  const modalKey = socialToEdit
    ? `edit-${socialToEdit.id}`
    : `add-${isAddModalOpen}`

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/50">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Ijtimoiy tarmoqlar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                Jami: {currentList.length} ta
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Markazning ijtimoiy tarmoq havolalarini boshqarish
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isPending && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mr-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setSocialToEdit(null)
              setIsAddModalOpen(true)
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:shadow-lg shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi ijtimoiy tarmoq qo'shish</span>
          </button>
        </div>
      </div>

      {/* Content: Empty State */}
      {currentList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Tarmoqlar topilmadi
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Hozircha hech qanday ijtimoiy tarmoq qo'shilmagan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentList.map((s) => {
            const IconComponent = platformIcons[s.platform] || Share2
            const PlatformName = platformNames[s.platform] || s.platform

            return (
              <div
                key={s.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col p-5"
              >
                {/* Status Overlay */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      s.isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}>
                      <IconComponent className="w-6 h-6" />
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                    s.isActive
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  }`}>
                    {s.isActive ? "Faol" : "Nofaol"}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {s.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                    {PlatformName}
                  </p>
                  
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2 line-clamp-1 truncate"
                  >
                    {s.url}
                  </a>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                        <Hash className="w-3 h-3" />
                        {s.sortOrder}
                      </span>
                      
                      <button
                        type="button"
                        disabled={togglingId === s.id}
                        onClick={() => handleToggleStatus(s)}
                        className={`p-1.5 rounded-lg transition-colors border cursor-pointer ${
                          s.isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                        }`}
                        title={s.isActive ? "Nofaol qilish" : "Faol qilish"}
                      >
                        {s.isActive ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSocialToEdit(s)
                          setIsAddModalOpen(true)
                        }}
                        className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors cursor-pointer"
                        title="Tahrirlash"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSocialToDelete(s)}
                        className="p-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/80 transition-colors cursor-pointer"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <SocialModal
        key={modalKey}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setSocialToEdit(null)
        }}
        socialToEdit={socialToEdit}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(socialToDelete)}
        socialItem={socialToDelete}
        onClose={() => setSocialToDelete(null)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
