import {
  Send,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react"
import { SocialPlatform } from "@prisma/client"
import { ElementType } from "react"

export const platformIcons: Record<SocialPlatform, ElementType> = {
  [SocialPlatform.telegram]: Send,
  [SocialPlatform.instagram]: Instagram,
  [SocialPlatform.facebook]: Facebook,
  [SocialPlatform.youtube]: Youtube,
}

export const platformNames: Record<SocialPlatform, string> = {
  [SocialPlatform.telegram]: "Telegram",
  [SocialPlatform.instagram]: "Instagram",
  [SocialPlatform.facebook]: "Facebook",
  [SocialPlatform.youtube]: "YouTube",
}
