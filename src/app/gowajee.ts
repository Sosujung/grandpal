"use server"

import axios from "axios"

import { env } from "@/env.mjs"

export const callASR = async (audioData: string): Promise<string> => {
  const resp = await axios.post(
    env.ASR_URL,
    { audioData },
    {
      headers: {
        "Content-type": "application/json",
        "x-api-key": env.GOWAJEE_API_KEY,
      },
    }
  )
  return (resp.data.results || []).reduce(
    (prev: string, cur: any) => prev + cur.transcript,
    ""
  )
}

export const callTTS = async (text: string) => {
  const resp = await axios.post(
    env.TTS_URL,
    { text },
    {
      responseType: "arraybuffer",
      headers: {
        "Content-type": "application/json",
        "x-api-key": env.GOWAJEE_API_KEY,
      },
    }
  )
  return resp.data
}
