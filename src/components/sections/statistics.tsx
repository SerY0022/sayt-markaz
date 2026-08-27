import { statistics as mockStatistics } from "@/data/site-data"
import { Container } from "../layout/container"
import { Section } from "../layout/section"

export type StatisticData = {
  id: string
  label: string
  value: string
}

export function Statistics({ statisticsData }: { statisticsData?: StatisticData[] }) {
  const displayStatistics = statisticsData && statisticsData.length > 0 
    ? statisticsData 
    : mockStatistics

  return (
    <Section className="bg-primary text-primary-foreground">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {displayStatistics.map((stat) => (
            <div key={stat.id} className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-sm md:text-base font-medium opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
