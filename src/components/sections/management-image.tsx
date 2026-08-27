"use client"

import { useState } from "react"
import { User } from "lucide-react"
import Image from "next/image"

export function ManagementImage({
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
    return (
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <User className="w-16 h-16 text-slate-400" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  )
}
