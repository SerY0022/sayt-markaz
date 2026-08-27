"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

export function GalleryImage({
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
      <div className={`absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <ImageIcon className="w-12 h-12 text-slate-400" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  )
}
