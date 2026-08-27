"use client"

import { useState, useTransition } from "react"
import { X, Loader2 } from "lucide-react"
import { createSocialLink, updateSocialLink, type SocialInput } from "@/app/admin/social/actions"
import { SocialPlatform } from "@prisma/client"
import { platformNames } from "./platformConfig"

export type SocialRecord = {
  id: number
  platform: SocialPlatform
  label: string
  url: string
  sortOrder: number
  isActive: boolean
}

interface SocialModalProps {
  isOpen: boolean
  onClose: () => void
  socialToEdit: SocialRecord | null
  onSuccess: () => void
}

export function SocialModal({
  isOpen,
  onClose,
  socialToEdit,
  onSuccess,
}: SocialModalProps) {
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState<SocialInput>({
    platform: socialToEdit?.platform || SocialPlatform.telegram,
    label: socialToEdit?.label || "",
    url: socialToEdit?.url || "",
    sortOrder: socialToEdit?.sortOrder ?? 0,
    isActive: socialToEdit?.isActive ?? true,
  })

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      const res = socialToEdit
        ? await updateSocialLink(socialToEdit.id, formData)
        : await createSocialLink(formData)

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

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {socialToEdit ? "Ijtimoiy tarmoqni tahrirlash" : "Yangi ijtimoiy tarmoq qo'shish"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form id="socialForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Platforma <span className="text-red-500">*</span>
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  fieldErrors.platform
                    ? "border-red-300 dark:border-red-700 focus:border-red-500"
                    : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                }`}
              >
                {Object.values(SocialPlatform).map((platform) => (
                  <option key={platform} value={platform}>
                    {platformNames[platform]}
                  </option>
                ))}
              </select>
              {fieldErrors.platform && (
                <p className="text-xs text-red-500">{fieldErrors.platform}</p>
              )}
            </div>

            {/* Label */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Nomi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="label"
                required
                value={formData.label}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  fieldErrors.label
                    ? "border-red-300 dark:border-red-700 focus:border-red-500"
                    : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                }`}
                placeholder="Masalan: Telegram kanalimiz"
              />
              {fieldErrors.label && (
                <p className="text-xs text-red-500">{fieldErrors.label}</p>
              )}
            </div>

            {/* URL */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Havola (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="url"
                required
                value={formData.url}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  fieldErrors.url
                    ? "border-red-300 dark:border-red-700 focus:border-red-500"
                    : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                }`}
                placeholder="https://t.me/..."
              />
              {fieldErrors.url && (
                <p className="text-xs text-red-500">{fieldErrors.url}</p>
              )}
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
            <div className="flex items-center gap-3 pt-2">
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
            form="socialForm"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <span>{socialToEdit ? "Saqlash" : "Qo'shish"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
