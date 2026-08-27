"use client"

import { useState, useTransition } from "react"
import { X, Loader2 } from "lucide-react"
import { createManagement, updateManagement, type ManagementInput } from "@/app/admin/management/actions"

export type ManagementRecord = {
  id: number
  name: string
  position: string
  bio: string | null
  image: string | null
  telegram: string | null
  instagram: string | null
  sortOrder: number
  isActive: boolean
}

interface ManagementModalProps {
  isOpen: boolean
  onClose: () => void
  memberToEdit: ManagementRecord | null
  onSuccess: () => void
}

export function ManagementModal({
  isOpen,
  onClose,
  memberToEdit,
  onSuccess,
}: ManagementModalProps) {
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState<ManagementInput>({
    name: memberToEdit?.name || "",
    position: memberToEdit?.position || "",
    bio: memberToEdit?.bio || "",
    image: memberToEdit?.image || "",
    telegram: memberToEdit?.telegram || "",
    instagram: memberToEdit?.instagram || "",
    sortOrder: memberToEdit?.sortOrder ?? 0,
    isActive: memberToEdit?.isActive ?? true,
  })

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    startTransition(async () => {
      const res = memberToEdit
        ? await updateManagement(memberToEdit.id, formData)
        : await createManagement(formData)

      if (!res.success) {
        setError(res.error || "Xatolik yuz berdi")
        if (res.fieldErrors) setFieldErrors(res.fieldErrors)
      } else {
        onSuccess()
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {memberToEdit ? "Rahbariyat a'zosini tahrirlash" : "Yangi a'zo qo'shish"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form id="managementForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Ism Familiya <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    fieldErrors.name
                      ? "border-red-300 dark:border-red-700 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                  placeholder="Masalan: Bahriddin To'rayev"
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-500">{fieldErrors.name}</p>
                )}
              </div>

              {/* Position */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Lavozim <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    fieldErrors.position
                      ? "border-red-300 dark:border-red-700 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                  placeholder="Masalan: O'quv Markaz Direktori"
                />
                {fieldErrors.position && (
                  <p className="text-xs text-red-500">{fieldErrors.position}</p>
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Rasm URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    fieldErrors.image
                      ? "border-red-300 dark:border-red-700 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                  placeholder="https://..."
                />
                {fieldErrors.image && (
                  <p className="text-xs text-red-500">{fieldErrors.image}</p>
                )}
                {formData.image && (
                  <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLElement).style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Qisqacha ma'lumot
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${
                    fieldErrors.bio
                      ? "border-red-300 dark:border-red-700 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                  placeholder="Rahbariyat a'zosi haqida qisqacha ma'lumot..."
                />
                {fieldErrors.bio && (
                  <p className="text-xs text-red-500">{fieldErrors.bio}</p>
                )}
              </div>

              {/* Telegram */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Telegram URL
                </label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    fieldErrors.telegram
                      ? "border-red-300 dark:border-red-700 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                  placeholder="https://t.me/..."
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Instagram URL
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    fieldErrors.instagram
                      ? "border-red-300 dark:border-red-700 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                  placeholder="https://instagram.com/..."
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tartib raqami
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  min="0"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    fieldErrors.sortOrder
                      ? "border-red-300 dark:border-red-700 focus:border-red-500"
                      : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                />
                {fieldErrors.sortOrder && (
                  <p className="text-xs text-red-500">{fieldErrors.sortOrder}</p>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 mt-8">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Faol holatda
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            form="managementForm"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <span>{memberToEdit ? "Saqlash" : "Qo'shish"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
