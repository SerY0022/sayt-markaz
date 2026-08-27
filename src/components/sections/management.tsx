import { management as mockManagement } from "@/data/site-data"
import { Container } from "../layout/container"
import { Section } from "../layout/section"
import { Card, CardContent } from "../ui/card"
import { ManagementImage } from "./management-image"

export type ManagementData = {
  id: string
  name: string
  position: string
  bio: string
  image: string
}

export function Management({ managementData }: { managementData?: ManagementData[] }) {
  const displayManagement = managementData && managementData.length > 0 ? managementData : mockManagement as ManagementData[]

  return (
    <Section id="rahbariyat" className="bg-surface border-t border-border">
      <Container>
        <div className="text-center mb-12">
          <h2 className="h2 text-text mb-4">Markaz rahbariyati</h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {displayManagement.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-1/3 aspect-square sm:aspect-auto h-48 sm:h-auto">
                  <ManagementImage
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 sm:w-2/3 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm font-medium text-primary mb-3">{member.position}</p>
                  <p className="text-sm text-muted">{member.bio}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
