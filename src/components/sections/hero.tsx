import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import { Container } from "../layout/container"
import { Section } from "../layout/section"
import { SettingsData } from "@/types/site"

export function Hero({ settings }: { settings: SettingsData }) {
  return (
    <Section id="bosh-sahifa" className="pt-8 md:pt-16 pb-16 md:pb-32 bg-background relative overflow-hidden">
      <Container className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="flex flex-col gap-6 text-center lg:text-left z-10">
          <h1 className="h1 text-text">
            {settings.heroTitle}
          </h1>
          <p className="body-text text-lg max-w-2xl mx-auto lg:mx-0">
            {settings.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" asChild>
              <Link href="#royxatdan-otish">Ro'yxatdan o'tish</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#oquv-bolimlari">O'quv bo'limlarini ko'rish</Link>
            </Button>
          </div>
        </div>
        
        <div className="relative aspect-video lg:aspect-square w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-sm border border-border">
          <Image
            src={settings.heroImage}
            alt="Ta'lim jarayoni"
            fill
            className="object-cover"
            priority
          />
        </div>
      </Container>
    </Section>
  )
}
