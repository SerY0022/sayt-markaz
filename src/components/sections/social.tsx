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

const iconMap: Record<string, React.ReactNode> = {
  telegram: <Send className="size-5" />,
  instagram: <Instagram className="size-5" />,
  facebook: <Facebook className="size-5" />,
  youtube: <Youtube className="size-5" />
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
        
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {displaySocials
            .filter((link) => link.url && link.url.trim() !== '')
            .map((link) => {
              const url = link.url.startsWith('http') ? link.url : `https://${link.url}`
              return (
                <Button key={link.platform} variant="outline" size="icon" className="rounded-full" asChild>
                  <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                    {iconMap[link.platform] || <span className="sr-only">{link.platform}</span>}
                  </Link>
                </Button>
              )
            })}
        </div>
      </Container>
    </Section>
  )
}
