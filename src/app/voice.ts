"use server"

import { Message } from "@/types"

import { callASR, callTTS } from "./gowajee"
import { callOpenAI } from "./oai"

export type PredictVoiceResponse =
  | {
      status: "empty"
    }
  | {
      status: "success"
      audio: number[]
      transcript: string
      message: string
      performance: {
        asr: number
        gpt: number
        tts: number
      }
    }
  | {
      status: "error"
      message: string
    }

export const predictVoice = async (
  messages: Message[],
  audioData: string
): Promise<PredictVoiceResponse> => {
  try {
    const t1 = performance.now()
    const transcript = await callASR(audioData)

    if (transcript.trim() === "") {
      return {
        status: "empty",
      }
    }

    const t2 = performance.now()
    const respMessage = await callOpenAI([
      ...messages,
      { role: "user", content: transcript },
    ])

    const t3 = performance.now()
    const newAudio = (await callTTS(respMessage)) as ArrayBuffer

    return {
      status: "success",
      audio: Array.from(new Uint8Array(newAudio)),
      transcript,
      message: respMessage,
      performance: {
        asr: t2 - t1,
        gpt: t3 - t2,
        tts: performance.now() - t3,
      },
    }
  } catch (e: any) {
    return {
      status: "error",
      message: e.message || e,
    }
  }
}
