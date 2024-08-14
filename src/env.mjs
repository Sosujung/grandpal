import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
  },
  server: {
    OPENAI_KEY: z.string().min(1),
    OPENAI_URL: z.string().url(),
    TTS_URL: z.string().url(),
    TTS_API_KEY: z.string().min(1),
    ASR_URL: z.string().url(),
    ASR_API_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    OPENAI_KEY: process.env.OPENAI_KEY,
    OPENAI_URL: process.env.OPENAI_URL,
    TTS_URL: process.env.TTS_URL,
    TTS_API_KEY: process.env.TTS_API_KEY,
    ASR_URL: process.env.ASR_URL,
    ASR_API_KEY: process.env.ASR_API_KEY,
  },
})
