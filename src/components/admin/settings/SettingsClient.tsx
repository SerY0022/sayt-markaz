"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Loader2,
  Settings,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
  FileText,
  Layout,
  Info,
} from "lucide-react"
import { saveSiteSettings, type SettingsInput } from "@/app/admin/settings/actions"
import { SiteSettings } from "@prisma/client"

interface SettingsClientProps {
  initialSettings: SiteSettings
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState<SettingsInput>({
    centerName: initialSettings.centerName || "",
    logo: initialSettings.logo || "",
    description: initialSettings.description || "",
    phone: initialSettings.phone || "",
    email: initialSettings.email || "",
    address: initialSettings.address || "",
    heroTitle: initialSettings.heroTitle || "",
    heroDescription: initialSettings.heroDescription || "",
    heroImage: initialSettings.heroImage || "",
    aboutTitle: initialSettings.aboutTitle || "",
    aboutDescription: initialSettings.aboutDescription || "",
    aboutImage: initialSettings.aboutImage || "",
  })

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    if (successMsg) setSuccessMsg(null)
    if (error) setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setFieldErrors({})

    startTransition(async () => {
      const res = await saveSiteSettings(formData)
      if (!res.success) {
        setError(res.error || "Xatolik yuz berdi")
        if (res.fieldErrors) setFieldErrors(res.fieldErrors)
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        setSuccessMsg("Sozlamalar muvaffaqiyatli saqlandi!")
        router.refresh()
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-4 z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/50">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sayt Sozlamalari
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              O'quv markazining umumiy ma'lumotlarini tahrirlash
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saqlanmoqda...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Saqlash</span>
            </>
          )}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm font-medium">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section: Asosiy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <FileText className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Asosiy ma'lumotlar</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Markaz nomi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="centerName"
                required
                value={formData.centerName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  fieldErrors.centerName ? "border-red-300 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                }`}
              />
              {fieldErrors.centerName && <p className="text-xs text-red-500 mt-1">{fieldErrors.centerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Logotip (URL)
              </label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  fieldErrors.logo ? "border-red-300 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                }`}
              />
              {fieldErrors.logo && <p className="text-xs text-red-500 mt-1">{fieldErrors.logo}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Qisqacha tavsif
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section: Aloqa */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Phone className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Aloqa ma'lumotlari</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Telefon raqam
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+998 90 123 45 67"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Elektron pochta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@markaz.uz"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    fieldErrors.email ? "border-red-300 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                />
              </div>
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Manzil
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Toshkent sh., Yunusobod tumani..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Layout className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Bosh sahifa (Hero)</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sarlavha
              </label>
              <input
                type="text"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Qisqacha matn
              </label>
              <textarea
                name="heroDescription"
                rows={3}
                value={formData.heroDescription}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Orqa fon rasmi (URL)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="url"
                  name="heroImage"
                  value={formData.heroImage}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    fieldErrors.heroImage ? "border-red-300 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                />
              </div>
              {fieldErrors.heroImage && <p className="text-xs text-red-500 mt-1">{fieldErrors.heroImage}</p>}
            </div>
          </div>
        </div>

        {/* Section: Biz haqimizda */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Info className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Biz haqimizda</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sarlavha
              </label>
              <input
                type="text"
                name="aboutTitle"
                value={formData.aboutTitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                To'liq matn
              </label>
              <textarea
                name="aboutDescription"
                rows={3}
                value={formData.aboutDescription}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Rasm (URL)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="url"
                  name="aboutImage"
                  value={formData.aboutImage}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    fieldErrors.aboutImage ? "border-red-300 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:border-blue-500"
                  }`}
                />
              </div>
              {fieldErrors.aboutImage && <p className="text-xs text-red-500 mt-1">{fieldErrors.aboutImage}</p>}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
