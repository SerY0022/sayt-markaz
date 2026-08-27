
import Link from "next/link"
import { Send, Instagram, User } from "lucide-react"
import { teachers as mockTeachers } from "@/data/site-data"
import { Container } from "../layout/container"
import { Section } from "../layout/section"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { TeacherImage } from "./teacher-image"

export type TeacherData = {
  id: string
  name: string
  position: string
  specialization: string
  experience: string
  image: string
  telegram?: string
  instagram?: string
  bio?: string
}

export function Teachers({ teachersData }: { teachersData?: TeacherData[] }) {
  const displayTeachers = teachersData && teachersData.length > 0 ? teachersData : mockTeachers as TeacherData[]

  return (
    <Section id="oqituvchilar" className="bg-background">
      <Container>
        <div className="text-center mb-12">
          <h2 className="h2 text-text mb-4">Bizning o'qituvchilar</h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTeachers.map((teacher: TeacherData) => (
            <Card key={teacher.id} className="text-center">
              <CardHeader className="pt-6">
                <div className="relative mx-auto size-24 md:size-32 rounded-full overflow-hidden mb-4 border-2 border-border bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {teacher.image ? (
                    <TeacherImage
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <CardTitle className="text-lg">{teacher.name}</CardTitle>
                <CardDescription className="font-medium text-primary">{teacher.position}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted">
                  <p>{teacher.specialization}</p>
                  <p>{teacher.experience}</p>
                </div>
                {teacher.bio && (
                  <p className="text-xs text-muted leading-relaxed line-clamp-3 px-2">
                    {teacher.bio}
                  </p>
                )}
                <div className="flex justify-center gap-3 pt-2">
                  {teacher.telegram && (
                    <Link href={teacher.telegram} className="text-muted hover:text-primary transition-colors" aria-label={`${teacher.name} Telegram`}>
                      <Send className="size-5" />
                    </Link>
                  )}
                  {teacher.instagram && (
                    <Link href={teacher.instagram} className="text-muted hover:text-primary transition-colors" aria-label={`${teacher.name} Instagram`}>
                      <Instagram className="size-5" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
