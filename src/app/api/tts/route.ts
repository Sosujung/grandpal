import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

import { env } from "@/env.mjs"

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams
  const input = searchParams.get("input")
  const voice = searchParams.get("voice")

  if (!input) {
    return Response.json({ error: "input is required" }, { status: 400 })
  }

  const openai = new OpenAI({
    apiKey: env.OAI_TTS_API_KEY,
  })

  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: (voice as any) || "nova",
    input: input,
    response_format: "mp3",
    speed: 1,
  })

  return new Response(response.body, {
    headers: {
      "Content-Type": "audio/mp3",
    },
  })
}
