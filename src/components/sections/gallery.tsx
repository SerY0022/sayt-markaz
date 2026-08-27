import { gallery as mockGallery } from "@/data/site-data"
import { Container } from "../layout/container"
import { Section } from "../layout/section"
import { GalleryImage } from "./gallery-image"

export type GalleryData = {
  id: string
  title: string
  description?: string
  image: string
}

export function Gallery({ galleryData }: { galleryData?: GalleryData[] }) {
  const displayGallery = galleryData && galleryData.length > 0
    ? galleryData
    : mockGallery

  return (
    <Section id="galereya" className="bg-background">
      <Container>
        <div className="text-center mb-12">
          <h2 className="h2 text-text mb-4">Markazimiz hayotidan</h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayGallery.map((item) => (
            <div key={item.id} className="group relative aspect-video rounded-xl overflow-hidden bg-muted">
              <GalleryImage
                src={item.image}
                alt={item.title}
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white pointer-events-none">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-white/80">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
