import Image from "next/image"
import Link from "next/link"
import { departments as mockDepartments } from "@/data/site-data"
import { Container } from "../layout/container"
import { Section } from "../layout/section"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Button } from "../ui/button"

export type DepartmentData = {
  id: string
  title: string
  description: string
  image: string
  features: string[]
}

export function Departments({ departmentsData }: { departmentsData?: DepartmentData[] }) {
  const displayDepartments = departmentsData && departmentsData.length > 0 ? departmentsData : mockDepartments

  return (
    <Section id="oquv-bolimlari" className="bg-background">
      <Container>
        <div className="text-center mb-12">
          <h2 className="h2 text-text mb-4">O'quv bo'limlarimiz</h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayDepartments.map((dept) => (
            <Card key={dept.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-48 w-full bg-muted overflow-hidden">
                <Image
                  src={dept.image}
                  alt={dept.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <CardTitle>{dept.title}</CardTitle>
                <CardDescription>{dept.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {dept.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center text-sm text-text">
                      <div className="size-1.5 rounded-full bg-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#royxatdan-otish">Batafsil</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
