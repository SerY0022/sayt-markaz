"use client"

import { useState, useTransition } from "react"
import { X, Loader2, Calendar, Phone, Mail, User, BookOpen, MessageSquare } from "lucide-react"
import { RegistrationStatus } from "@prisma/client"
import { updateRegistrationStatus } from "@/app/admin/registrations/actions"
import { statusLabels, statusColors } from "./RegistrationsClient"

export type RegistrationRecord = {
  id: number
  fullName: string
  phone: string
  email: string | null
  departmentId: number | null
  message: string | null
  status: RegistrationStatus
  createdAt: Date
  department: {
    id: number
    title: string
  } | null
}

interface RegistrationDetailModalProps {
  isOpen: boolean
  registration: RegistrationRecord | null
  onClose: () => void
  onSuccess: () => void
}

export function RegistrationDetailModal({
  isOpen,
  registration,
  onClose,
  onSuccess,
}: RegistrationDetailModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !registration) return null

  const handleStatusChange = (newStatus: RegistrationStatus) => {
    setError(null)
    startTransition(async () => {
      const res = await updateRegistrationStatus(registration.id, newStatus)
      if (!res.success) {
        setError(res.error || "Xatolik yuz berdi")
      } else {
        onSuccess()
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
            Ariza ma'lumotlari
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {/* Top Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">F.I.SH</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{registration.fullName}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Telefon</p>
                <p className="font-bold font-mono text-slate-900 dark:text-white text-sm">{registration.phone}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                {registration.email ? (
                  <a href={`mailto:${registration.email}`} className="font-bold text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    {registration.email}
                  </a>
                ) : (
                  <p className="text-sm text-slate-400 italic">Kiritilmagan</p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sana</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {new Date(registration.createdAt).toLocaleString("uz-UZ", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

          {/* Department & Message */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800/50 text-blue-500 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanlangan yo'nalish:</p>
                {registration.department ? (
                  <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-sm text-slate-700 dark:text-slate-300">
                    {registration.department.title}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">Mavjud emas / Tanlanmagan</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 w-full">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Qo'shimcha xabar:</p>
                <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {registration.message ? registration.message : <span className="text-slate-400 italic">Xabar yozilmagan.</span>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

          {/* Status Updater */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Ariza holatini o'zgartirish
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusLabels).map(([key, label]) => {
                const isActive = registration.status === key
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={isPending || isActive}
                    onClick={() => handleStatusChange(key as RegistrationStatus)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                      isActive
                        ? statusColors[key as RegistrationStatus] + " shadow-sm cursor-default"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    } ${isPending ? "opacity-50" : ""}`}
                  >
                    {isPending && isActive ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saqlanmoqda...
                      </span>
                    ) : (
                      label
                    )}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Holatni ustiga bosish orqali tezkor o'zgartirishingiz mumkin. O'zgarishlar darhol saqlanadi.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-xl transition-colors cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  )
}
