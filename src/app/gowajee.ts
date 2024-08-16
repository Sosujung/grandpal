"use server"

import axios from "axios"
import OpenAI from "openai"

import { env } from "@/env.mjs"

export const callASR = async (audioData: string): Promise<string> => {
  const resp = await axios.post(
    env.ASR_URL,
    { audioData },
    {
      headers: {
        "Content-type": "application/json",
        "x-api-key": env.ASR_API_KEY,
      },
    }
  )
  return (resp.data.output.results || []).reduce(
    (prev: string, cur: any) => prev + cur.transcript,
    ""
  )
}

export const callTTS = async (text: string, oai?: string | null) => {
  if (oai) {
    const openai = new OpenAI({
      apiKey: env.OAI_TTS_API_KEY,
    })
    const resp = await openai.audio.speech.create(
      {
        model: "tts-1",
        voice: oai as any,
        input: text,
      },
      {
        stream: true,
      }
    )

    const data = await new Promise<Buffer>((resolve, reject) => {
      let bufferStore = Buffer.from([])
      const stream = resp.body as unknown as NodeJS.ReadableStream

      if (!stream) {
        reject("No stream")
        return
      }

      stream.on("data", (chunk) => {
        console.log("buffer", chunk.length)
        bufferStore = Buffer.concat([bufferStore, chunk])
      })

      stream.on("end", () => {
        resolve(bufferStore)
      })

      stream.on("error", (err) => {
        reject(err)
      })
    })

    return data
    //return resp.arrayBuffer()
  }

  const resp = await axios.post(
    env.TTS_URL,
    { text },
    {
      responseType: "arraybuffer",
      headers: {
        "Content-type": "application/json",
        "x-api-key": env.TTS_API_KEY,
      },
    }
  )
  return resp.data
}
