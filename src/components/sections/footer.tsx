import Link from "next/link"
import { Send, Instagram, Phone, Mail, MapPin, Facebook, Youtube } from "lucide-react"
import { Container } from "../layout/container"
import { SettingsData } from "@/types/site"
import { socialLinks as mockSocialLinks } from "@/data/site-data"
import { SocialLinkData } from "./social"

const iconMap: Record<string, React.ReactNode> = {
  telegram: <Send className="size-5" />,
  instagram: <Instagram className="size-5" />,
  facebook: <Facebook className="size-5" />,
  youtube: <Youtube className="size-5" />
}

export function Footer({ settings, socialData }: { settings: SettingsData, socialData?: SocialLinkData[] }) {
  const displaySocials = socialData && socialData.length > 0
    ? socialData
    : mockSocialLinks

  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-primary tracking-tight">{settings.centerName}</span>
            </Link>
            <p className="text-sm text-muted">
              {settings.description}
            </p>
            <div className="flex gap-4 pt-2">
              {displaySocials
                .filter((link) => link.url && link.url.trim() !== '')
                .map((link) => {
                  const url = link.url.startsWith('http') ? link.url : `https://${link.url}`
                  return (
                    <Link key={link.platform} href={url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors" aria-label={link.platform}>
                      {iconMap[link.platform] || <span className="text-xs uppercase">{link.platform}</span>}
                    </Link>
                  )
                })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4">Bo'limlar</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#biz-haqimizda" className="text-sm text-muted hover:text-primary transition-colors">Biz haqimizda</Link>
              </li>
              <li>
                <Link href="#oquv-bolimlari" className="text-sm text-muted hover:text-primary transition-colors">O'quv bo'limlari</Link>
              </li>
              <li>
                <Link href="#oqituvchilar" className="text-sm text-muted hover:text-primary transition-colors">O'qituvchilar</Link>
              </li>
              <li>
                <Link href="#galereya" className="text-sm text-muted hover:text-primary transition-colors">Galereya</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text mb-4">Yordam</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-muted hover:text-primary transition-colors">Maxfiylik siyosati</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted hover:text-primary transition-colors">Foydalanish shartlari</Link>
              </li>
              <li>
                <Link href="#royxatdan-otish" className="text-sm text-muted hover:text-primary transition-colors">Ro'yxatdan o'tish</Link>
              </li>
            </ul>
          </div>

          <div id="aloqa">
            <h3 className="font-semibold text-text mb-4">Aloqa</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="size-5 text-primary shrink-0" />
                <span className="text-sm text-muted">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-5 text-primary shrink-0" />
                <a href={`tel:${settings.phone?.replace(/\s/g, '')}`} className="text-sm text-muted hover:text-primary transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-5 text-primary shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-sm text-muted hover:text-primary transition-colors">{settings.email}</a>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted text-center md:text-left">
            © {new Date().getFullYear()} {settings.centerName}. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </Container>
    </footer>
  )
}
