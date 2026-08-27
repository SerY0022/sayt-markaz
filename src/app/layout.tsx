import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { prisma } from "@/lib/prisma"

export async function generateMetadata(): Promise<Metadata> {
  let siteSettings = null
  try {
    siteSettings = await prisma.siteSettings.findUnique({ where: { id: 1 } })
  } catch (error) {
    console.error("Metadata fetch error:", error)
  }

  const title = siteSettings?.centerName || "O'quv Markaz"
  const description = siteSettings?.description || "Zamonaviy ta'lim va amaliy ko'nikmalar markazi. Kelajagingizni bugundan boshlang."
  const keywords = ["o'quv markaz", "ta'lim", "kurslar", "IT", "dasturlash", "tillar", "ingliz tili", "zamonaviy kasblar", "Toshkent", "o'quv kurslari"]

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://oquv-markaz.uz"),
    title: {
      default: `${title} | Zamonaviy Ta'lim`,
      template: `%s | ${title}`
    },
    description,
    keywords,
    authors: [{ name: title }],
    creator: title,
    publisher: title,
    openGraph: {
      title: `${title} | Zamonaviy Ta'lim`,
      description,
      url: "/",
      siteName: title,
      locale: "uz_UZ",
      type: "website",
      images: [
        {
          url: "/og-image.jpg", // Default OG image path
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Zamonaviy Ta'lim`,
      description,
      images: ["/og-image.jpg"]
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
