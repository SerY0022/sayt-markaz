import Link from "next/link"
import { Instagram, Send, Facebook, Youtube } from "lucide-react"
import { socialLinks as mockSocialLinks } from "@/data/site-data"
import { Container } from "../layout/container"
import { Section } from "../layout/section"
import { Button } from "../ui/button"

export type SocialLinkData = {
  platform: string
  url: string
}

const platformConfig: Record<string, { icon: React.ElementType, buttonClass: string, iconClass: string }> = {
  telegram: {
    icon: Send,
    buttonClass: "hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]",
    iconClass: "!size-8 text-sky-500 group-hover:text-white transition-transform duration-300 group-hover:-rotate-12",
  },
  instagram: {
    icon: Instagram,
    buttonClass: "hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent",
    iconClass: "!size-8 text-pink-600 group-hover:text-white transition-transform duration-300 group-hover:rotate-6",
  },
  facebook: {
    icon: Facebook,
    buttonClass: "hover:bg-blue-600 hover:text-white hover:border-blue-600",
    iconClass: "!size-8 text-blue-600 group-hover:text-white transition-transform duration-300 group-hover:rotate-6",
  },
  youtube: {
    icon: Youtube,
    buttonClass: "hover:bg-red-600 hover:text-white hover:border-red-600",
    iconClass: "!size-8 text-red-600 group-hover:text-white transition-transform duration-300 group-hover:rotate-6",
  }
}

export function SocialLinks({ socialData }: { socialData?: SocialLinkData[] }) {
  const displaySocials = socialData && socialData.length > 0
    ? socialData
    : mockSocialLinks

  return (
    <Section className="bg-surface border-y border-border">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="h3 text-text mb-2 text-center md:text-left">Bizni ijtimoiy tarmoqlarda kuzating</h2>
          <p className="text-muted text-center md:text-left">Eng so'nggi yangiliklar va foydali ma'lumotlarni o'tkazib yubormang.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
          {displaySocials
            .filter((link) => link.url && link.url.trim() !== '')
            .map((link) => {
              const url = link.url.startsWith('http') ? link.url : `https://${link.url}`
              const config = platformConfig[link.platform]
              const Icon = config ? config.icon : null

              return (
                <Button 
                  key={link.platform} 
                  variant="outline" 
                  className={`rounded-full w-14 h-14 group transition-all duration-300 ease-out transform hover:-translate-y-1.5 hover:scale-110 hover:shadow-lg active:scale-95 ${config ? config.buttonClass : ""}`} 
                  asChild
                >
                  <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                    {Icon ? <Icon className={config ? config.iconClass : ""} /> : <span className="sr-only">{link.platform}</span>}
                  </Link>
                </Button>
              )
            })}
        </div>
      </Container>
    </Section>
  )
}
