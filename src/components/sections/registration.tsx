"use client"
import * as React from "react"
import { Container } from "../layout/container"
import { Section } from "../layout/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { submitRegistration } from "@/app/actions/registration"
import { Loader2 } from "lucide-react"

export type DepartmentMin = {
  id: string
  title: string
}

export function Registration({ departmentsData }: { departmentsData?: DepartmentMin[] }) {
  const [loading, setLoading] = React.useState(false)
  const [status, setStatus] = React.useState<{type: 'success' | 'error', message: string} | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const formData = new FormData(e.currentTarget)
    const result = await submitRegistration(formData)

    setLoading(false)
    if (result.success) {
      setStatus({ type: 'success', message: result.message! })
      e.currentTarget.reset()
    } else {
      setStatus({ type: 'error', message: result.error! })
    }
  }

  // Fallback departments if none provided or database is empty
  const displayDepartments = departmentsData && departmentsData.length > 0 
    ? departmentsData 
    : [
        { id: "it", title: "IT va Dasturlash (Fallback)" },
        { id: "languages", title: "Xorijiy tillar (Fallback)" },
        { id: "computer-literacy", title: "Kompyuter savodxonligi (Fallback)" }
      ]

  return (
    <Section id="royxatdan-otish" className="bg-background">
      <Container className="max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="h2 text-text mb-4">Ro'yxatdan o'tish</h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto"></div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Yangi kurslarga qabul</CardTitle>
            <CardDescription>Ma'lumotlaringizni qoldiring, biz siz bilan tez orada bog'lanamiz.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {status && (
                <div className={`p-4 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {status.message}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Ism va familiya <span className="text-error">*</span></Label>
                <Input id="fullName" name="fullName" placeholder="Masalan: Sardor Qodirov" required disabled={loading} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon raqam <span className="text-error">*</span></Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+998 90 123 45 67" required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email manzil</Label>
                  <Input id="email" name="email" type="email" placeholder="example@mail.com" disabled={loading} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId">O'quv bo'limi <span className="text-error">*</span></Label>
                <Select id="departmentId" name="departmentId" required disabled={loading}>
                  <option value="">Bo'limni tanlang...</option>
                  {displayDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.title}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Qo'shimcha izoh</Label>
                <Textarea id="message" name="message" placeholder="O'zingizni qiziqtirgan savollar..." disabled={loading} />
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="privacyAccepted" 
                  name="privacyAccepted"
                  className="mt-1 size-4 rounded border-border text-primary focus:ring-primary"
                  required 
                  disabled={loading}
                />
                <Label htmlFor="privacyAccepted" className="text-sm font-normal text-muted leading-snug">
                  Men maxfiylik siyosati bilan tanishdim va ma'lumotlarim qayta ishlanishiga rozilik bildiraman.
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Container>
    </Section>
  )
}
