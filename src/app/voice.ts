"use server"

import { Message } from "@/types"
import axios from "axios"

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

export type PredictVoiceNoTTSResponse =
  | {
      status: "empty"
    }
  | {
      status: "success"
      transcript: string
      message: string
      performance: {
        asr: number
        gpt: number
      }
    }
  | {
      status: "error"
      message: string
    }

export const predictVoiceNoTTS = async (
  messages: Message[],
  audioData: string
): Promise<PredictVoiceNoTTSResponse> => {
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

    return {
      status: "success",
      transcript,
      message: respMessage,
      performance: {
        asr: t2 - t1,
        gpt: t3 - t2,
      },
    }
  } catch (e: any) {
    if (axios.isAxiosError(e)) {
      return {
        status: "error",
        message: e.response?.data.message || e.cause?.message || e.message,
      }
    }

    return {
      status: "error",
      message: e.message || e,
    }
  }
}

export const predictVoice = async (
  messages: Message[],
  audioData: string,
  ttsOAI: string | null = null
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
    const newAudio = (await callTTS(respMessage, ttsOAI)) as ArrayBuffer

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
    if (axios.isAxiosError(e)) {
      return {
        status: "error",
        message: e.response?.data.message || e.cause?.message || e.message,
      }
    }

    return {
      status: "error",
      message: e.message || e,
    }
  }
}
