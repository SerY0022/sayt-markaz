"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/button"
import { Container } from "../layout/container"
import { SettingsData } from "@/types/site"

const navLinks = [
  { href: "#bosh-sahifa", label: "Bosh sahifa" },
  { href: "#biz-haqimizda", label: "Biz haqimizda" },
  { href: "#oquv-bolimlari", label: "O'quv bo'limlari" },
  { href: "#oqituvchilar", label: "O'qituvchilar" },
  { href: "#rahbariyat", label: "Rahbariyat" },
  { href: "#galereya", label: "Galereya" },
  { href: "#aloqa", label: "Aloqa" },
]

export function Header({ settings }: { settings: SettingsData }) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Prevent scrolling when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {settings.logo ? (
            <Image src={settings.logo} alt={settings.centerName} width={120} height={32} className="h-8 w-auto object-contain" priority />
          ) : (
            <span className="text-xl font-bold text-primary tracking-tight">{settings.centerName}</span>
          )}
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-sm font-medium text-text hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild>
            <Link href="#royxatdan-otish">Ro'yxatdan o'tish</Link>
          </Button>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="lg:hidden p-2 text-text"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Menyuni yopish" : "Menyuni ochish"}
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-surface lg:hidden border-t border-border">
          <nav className="flex flex-col p-6 gap-6 h-full overflow-y-auto">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-lg font-medium text-text hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-auto mb-16 border-t border-border">
              <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                <Link href="#royxatdan-otish">Ro'yxatdan o'tish</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
