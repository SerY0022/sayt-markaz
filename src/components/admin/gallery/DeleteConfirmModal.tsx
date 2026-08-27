"use client"

import { useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import { deleteGalleryItem } from "@/app/admin/gallery/actions"
import type { GalleryRecord } from "./GalleryModal"

interface DeleteConfirmModalProps {
  isOpen: boolean
  galleryItem: GalleryRecord | null
  onClose: () => void
  onSuccess: () => void
}

export function DeleteConfirmModal({
  isOpen,
  galleryItem,
  onClose,
  onSuccess,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !galleryItem) return null

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    const result = await deleteGalleryItem(galleryItem.id)
    setLoading(false)

    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setError(result.error || "O'chirishda xatolik yuz berdi")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden my-8">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-900/50">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Galereya rasmini o'chirishni tasdiqlaysizmi?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                "{galleryItem.title}"
              </span>{" "}
              bazadan o'chiriladi.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              Yo'q, bekor qilish
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-md shadow-red-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Ha, o'chirish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
