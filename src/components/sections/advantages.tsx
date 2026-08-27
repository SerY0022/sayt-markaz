import { GraduationCap, BookOpen, Briefcase, Award } from "lucide-react"
import { advantages } from "@/data/site-data"
import { Container } from "../layout/container"
import { Section } from "../layout/section"

const iconMap: Record<string, React.ReactNode> = {
  'graduation-cap': <GraduationCap className="size-8 text-primary" />,
  'book-open': <BookOpen className="size-8 text-primary" />,
  'briefcase': <Briefcase className="size-8 text-primary" />,
  'award': <Award className="size-8 text-primary" />
}

export function Advantages() {
  return (
    <Section className="bg-surface border-y border-border">
      <Container>
        <div className="text-center mb-12">
          <h2 className="h2 text-text mb-4">Nega biz?</h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv) => (
            <div key={adv.id} className="flex flex-col items-center text-center p-6 space-y-4">
              <div className="p-4 bg-primary/10 rounded-full">
                {iconMap[adv.icon]}
              </div>
              <h3 className="h3 text-xl">{adv.title}</h3>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
