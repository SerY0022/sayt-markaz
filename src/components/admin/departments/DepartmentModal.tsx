"use client"

import { useState } from "react"
import {
  X,
  Loader2,
  Image as ImageIcon,
  FolderKanban,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import {
  createDepartment,
  updateDepartment,
  type DepartmentActionState,
  type DepartmentInput,
} from "@/app/admin/departments/actions"

export type DepartmentRecord = {
  id: number
  title: string
  slug: string
  description: string | null
  image: string | null
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface DepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  departmentToEdit?: DepartmentRecord | null
  onSuccess: () => void
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/gʻ/g, "g")
    .replace(/oʻ/g, "o")
    .replace(/g'/g, "g")
    .replace(/o'/g, "o")
    .replace(/ʻ|ʼ|`|'/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function DepartmentModal({
  isOpen,
  onClose,
  departmentToEdit,
  onSuccess,
}: DepartmentModalProps) {
  const isEditing = Boolean(departmentToEdit)

  const [title, setTitle] = useState(departmentToEdit?.title || "")
  const [slug, setSlug] = useState(departmentToEdit?.slug || "")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    Boolean(departmentToEdit)
  )
  const [description, setDescription] = useState(
    departmentToEdit?.description || ""
  )
  const [image, setImage] = useState(departmentToEdit?.image || "")
  const [sortOrder, setSortOrder] = useState(departmentToEdit?.sortOrder ?? 0)
  const [isActive, setIsActive] = useState(departmentToEdit?.isActive ?? true)

  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState<DepartmentActionState>({})

  if (!isOpen) return null

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isSlugManuallyEdited && !isEditing) {
      setSlug(generateSlug(val))
    }
  }

  const handleSlugChange = (val: string) => {
    setSlug(val.toLowerCase())
    setIsSlugManuallyEdited(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFormState({})

    const inputData: DepartmentInput = {
      title,
      slug,
      description: description.trim() ? description : null,
      image: image.trim() ? image : null,
      sortOrder: Number(sortOrder) || 0,
      isActive,
    }

    let result: DepartmentActionState
    if (isEditing && departmentToEdit) {
      result = await updateDepartment(departmentToEdit.id, inputData)
    } else {
      result = await createDepartment(inputData)
    }

    setLoading(false)

    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setFormState(result)
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
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/50 dark:border-blue-900/50">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? "O'quv bo'limini tahrirlash" : "Yangi o'quv bo'limi qo'shish"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Mavjud bo'lim ma'lumotlarini yangilang"
                  : "Yangi o'quv yo'nalishi va parametrlarini kiriting"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {formState.error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{formState.error}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Bo'lim nomi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Masalan: IT va Dasturlash"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 transition-all ${
                formState.fieldErrors?.title
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-600/20"
              }`}
            />
            {formState.fieldErrors?.title && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formState.fieldErrors.title}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Slug (URL manzili) <span className="text-red-500">*</span>
              </label>
              {!isSlugManuallyEdited && title && (
                <span className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Avto-generatsiya
                </span>
              )}
            </div>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="masalan: it-dasturlash"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 transition-all ${
                formState.fieldErrors?.slug
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-600/20"
              }`}
            />
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Faqat kichik lotin harflari, raqamlar va chiziqcha (-). Unique bo'lishi shart.
            </p>
            {formState.fieldErrors?.slug && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formState.fieldErrors.slug}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Tavsif (Ixtiyoriy)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bo'lim haqida qisqacha ma'lumot..."
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 transition-all resize-none ${
                formState.fieldErrors?.description
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-600/20"
              }`}
            />
            {formState.fieldErrors?.description && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formState.fieldErrors.description}
              </p>
            )}
          </div>

          {/* Image URL & Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Rasm URL (Ixtiyoriy)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={`flex-1 px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  formState.fieldErrors?.image
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-600/20"
                }`}
              />
            </div>
            {formState.fieldErrors?.image && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {formState.fieldErrors.image}
              </p>
            )}

            {/* Image Preview Box */}
            {image.trim() && (
              <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 relative flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = "none"
                    }}
                  />
                  <ImageIcon className="w-5 h-5 text-slate-400 absolute" />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Rasm ko'rinishi
                  </p>
                  <p className="truncate font-mono text-[11px]">{image}</p>
                </div>
              </div>
            )}
          </div>

          {/* Grid for Sort Order & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Sort Order */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Tartib raqami
              </label>
              <input
                type="number"
                min={0}
                max={9999}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  formState.fieldErrors?.sortOrder
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-300 dark:border-slate-700 focus:border-blue-600 focus:ring-blue-600/20"
                }`}
              />
              {formState.fieldErrors?.sortOrder && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {formState.fieldErrors.sortOrder}
                </p>
              )}
            </div>

            {/* Status Toggle Checkbox */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Holati
              </label>
              <label className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {isActive ? "Faol (saytda ko'rinadi)" : "Nofaol (yashiringan)"}
                </span>
              </label>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? "Saqlash" : "Qo'shish"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
