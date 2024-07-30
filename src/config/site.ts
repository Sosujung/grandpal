import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "Grandpal",
  author: "yoisha and frens",
  description: "Chat with your grandpal using voice!",
  url: env.NEXT_PUBLIC_APP_URL,
  links: {
    github: "https://github.com/redpangilinan/next-entree",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}
