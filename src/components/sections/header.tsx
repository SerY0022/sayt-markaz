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
    <header className={`sticky top-0 z-50 w-full border-b border-border transition-colors ${isOpen ? "bg-background" : "bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60"}`}>
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
      <div 
        className={`fixed inset-0 top-0 left-0 w-full min-h-screen bg-background z-50 flex flex-col justify-start p-6 lg:hidden transition-all duration-300 ease-in-out transform ${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Top header inside menu */}
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            {settings.logo ? (
              <Image src={settings.logo} alt={settings.centerName} width={120} height={32} className="h-8 w-auto object-contain" priority />
            ) : (
              <span className="text-xl font-bold text-primary tracking-tight">{settings.centerName}</span>
            )}
          </Link>
          <button
            className="p-2 text-text"
            onClick={() => setIsOpen(false)}
            aria-label="Menyuni yopish"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-3 mt-6 text-lg overflow-y-auto pb-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="py-3 px-4 block text-text font-medium hover:bg-muted rounded-lg transition-all duration-200 hover:translate-x-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 pb-2 mt-4 border-t border-border">
            <Button className="w-full py-6 text-lg rounded-md" asChild onClick={() => setIsOpen(false)}>
              <Link href="#royxatdan-otish">Ro'yxatdan o'tish</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
