import { Handshake, Moon, SunMedium } from "lucide-react"

export type IconKeys = keyof typeof icons

type IconsType = {
  [key in IconKeys]: React.ElementType
}

const icons = {
  logo: Handshake,
  sun: SunMedium,
  moon: Moon,
}

export const Icons: IconsType = icons
