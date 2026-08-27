import Image from "next/image"
import { Container } from "../layout/container"
import { Section } from "../layout/section"
import { SettingsData } from "@/types/site"

export function About({ settings }: { settings: SettingsData }) {
  return (
    <Section id="biz-haqimizda" className="bg-surface">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm border border-border order-2 lg:order-1">
            <Image
              src={settings.aboutImage}
              alt={settings.aboutTitle}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <div>
              <h2 className="h2 text-text mb-4">{settings.aboutTitle}</h2>
              <div className="w-12 h-1 bg-primary rounded-full mb-6"></div>
            </div>
            
            <p className="body-text whitespace-pre-wrap">
              {settings.aboutDescription}
            </p>
            
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="h3">Missiyamiz</h3>
              <p className="body-text">
                Sifatli ta'lim orqali jamiyat rivojiga hissa qo'shish va yoshlarning o'z salohiyatlarini to'laqonli ro'yobga chiqarishlariga ko'maklashish.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
