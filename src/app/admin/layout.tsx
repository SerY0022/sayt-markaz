/**
 * Admin Root Layout — Passthrough
 *
 * Route group (dashboard) enforces requireAdmin() for protected routes.
 * /admin/login is served without protected layout wrapping to avoid redirect loops.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
