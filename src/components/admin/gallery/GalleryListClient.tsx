"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Hash,
  RefreshCw,
} from "lucide-react"
import { GalleryModal, type GalleryRecord } from "./GalleryModal"
import { DeleteConfirmModal } from "./DeleteConfirmModal"
import { toggleGalleryItemStatus } from "@/app/admin/gallery/actions"

interface GalleryListClientProps {
  initialGallery: GalleryRecord[]
}

export function GalleryListClient({
  initialGallery,
}: GalleryListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [gallery, setGallery] = useState<GalleryRecord[]>(initialGallery)

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [galleryToEdit, setGalleryToEdit] = useState<GalleryRecord | null>(null)
  const [galleryToDelete, setGalleryToDelete] = useState<GalleryRecord | null>(null)

  // Toggle loading tracking per ID
  const [togglingId, setTogglingId] = useState<number | null>(null)

  // Handle refresh success
  const handleSuccess = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  // Handle active/inactive toggle
  const handleToggleStatus = async (item: GalleryRecord) => {
    setTogglingId(item.id)

    // Optimistic UI update
    setGallery((prev) =>
      prev.map((g) => (g.id === item.id ? { ...g, isActive: !g.isActive } : g))
    )

    const res = await toggleGalleryItemStatus(item.id, item.isActive)
    setTogglingId(null)

    if (!res.success) {
      // Revert on error
      setGallery((prev) =>
        prev.map((g) => (g.id === item.id ? { ...g, isActive: item.isActive } : g))
      )
      alert(res.error || "Holatni o'zgartirishda xatolik yuz berdi")
    } else {
      handleSuccess()
    }
  }

  // Render list
  const currentList = gallery.length > 0 ? gallery : initialGallery

  const modalKey = galleryToEdit
    ? `edit-${galleryToEdit.id}`
    : `add-${isAddModalOpen}`

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/50">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Galereya
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                Jami: {currentList.length} ta
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              O'quv markazining barcha rasmlarini boshqarish
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
              setGalleryToEdit(null)
              setIsAddModalOpen(true)
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:shadow-lg shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi rasm qo'shish</span>
          </button>
        </div>
      </div>

      {/* Content: Empty State */}
      {currentList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Rasmlar topilmadi
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Hozircha galereyaga hech qanday rasm qo'shilmagan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentList.map((g) => (
            <div
              key={g.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Image Container */}
              <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image}
                  alt={g.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = "none"
                  }}
                />
                
                {/* Status Overlay */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md shadow-sm border ${
                    g.isActive
                      ? "bg-emerald-500/90 text-white border-emerald-400/50"
                      : "bg-slate-800/90 text-slate-200 border-slate-700/50"
                  }`}>
                    {g.isActive ? "Faol" : "Nofaol"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {g.title}
                  </h3>
                  {g.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {g.description}
                    </p>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                      <Hash className="w-3 h-3" />
                      {g.sortOrder}
                    </span>
                    
                    <button
                      type="button"
                      disabled={togglingId === g.id}
                      onClick={() => handleToggleStatus(g)}
                      className={`p-1.5 rounded-lg transition-colors border cursor-pointer ${
                        g.isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                      title={g.isActive ? "Nofaol qilish" : "Faol qilish"}
                    >
                      {g.isActive ? (
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
                        setGalleryToEdit(g)
                        setIsAddModalOpen(true)
                      }}
                      className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors cursor-pointer"
                      title="Tahrirlash"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryToDelete(g)}
                      className="p-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/80 transition-colors cursor-pointer"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <GalleryModal
        key={modalKey}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setGalleryToEdit(null)
        }}
        galleryToEdit={galleryToEdit}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(galleryToDelete)}
        galleryItem={galleryToDelete}
        onClose={() => setGalleryToDelete(null)}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
