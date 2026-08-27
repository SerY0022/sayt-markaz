"use client"

import { useActionState } from "react"
import { loginAdminAction, type LoginActionState } from "../actions"
import { Lock, User, AlertCircle, Loader2, ShieldCheck } from "lucide-react"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    LoginActionState | null,
    FormData
  >(loginAdminAction, null)

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-4 shadow-sm border border-blue-100 dark:border-blue-900/50">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tizimga kirish
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Administrator paneliga kirish uchun ma'lumotlarni kiriting
        </p>
      </div>

      {/* Generic Error Message Display */}
      {state?.error && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{state.error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-5" noValidate>
        {/* Username / Email Field */}
        <div>
          <label
            htmlFor="usernameOrEmail"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
          >
            Login yoki Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <User className="w-5 h-5" />
            </div>
            <input
              id="usernameOrEmail"
              name="usernameOrEmail"
              type="text"
              required
              autoComplete="username"
              disabled={isPending}
              placeholder="admin yoki admin@example.com"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2"
          >
            Parol <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={isPending}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Tekshirilmoqda...</span>
            </>
          ) : (
            <span>Kirish</span>
          )}
        </button>
      </form>

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          O'quv Markaz Xavfsiz Administrator Tizimi &copy; 2026
        </p>
      </div>
    </div>
  )
}
