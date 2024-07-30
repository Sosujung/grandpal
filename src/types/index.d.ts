export type SiteConfig = {
  name: string
  author: string
  description: string
  url: string
  links: {
    github: string
  }
  ogImage: string
}

export type Message = {
  role: "assistant" | "user"
  content: string
}
