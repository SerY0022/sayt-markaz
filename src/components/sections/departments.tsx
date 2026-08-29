"use client"

import { useState } from "react"
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
  const [selectedDept, setSelectedDept] = useState<DepartmentData | null>(null)

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
                <Button 
                  onClick={() => setSelectedDept(dept)}
                  className="w-full rounded-md font-medium text-white"
                >
                  Batafsil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Modal Overlay */}
        {selectedDept && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedDept(null)}
          >
            <div 
              className="bg-background relative rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedDept(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-colors"
                aria-label="Yopish"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Banner Image */}
              <div className="relative h-64 sm:h-80 w-full bg-muted">
                <Image
                  src={selectedDept.image}
                  alt={selectedDept.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <h3 className="text-3xl font-bold text-text mb-4">{selectedDept.title}</h3>
                <p className="text-muted text-lg mb-8 leading-relaxed">
                  {selectedDept.description}
                </p>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-text mb-4">Ushbu kursda o'rganiladigan yo'nalishlar:</h4>
                  <ul className="space-y-3">
                    {selectedDept.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start text-text">
                        <div className="size-2 rounded-full bg-primary mt-2 mr-3 shrink-0" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Register Button */}
                <Button 
                  asChild 
                  className="w-full text-lg py-6 rounded-md font-medium text-white shadow-lg transition-all hover:-translate-y-1"
                >
                  <Link href="#royxatdan-otish" onClick={() => setSelectedDept(null)}>
                    Ro'yxatdan o'tish (Ariza qoldirish)
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  )
}
