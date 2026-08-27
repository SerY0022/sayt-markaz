"use client"

import { useState } from "react"
import { User } from "lucide-react"
import Image from "next/image"

export function TeacherImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [error, setError] = useState(false)

  if (error || !src) {
    return <User className="w-10 h-10 text-slate-400" />
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  )
}
