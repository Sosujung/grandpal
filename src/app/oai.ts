"use server"

import { Message } from "@/types"
import axios from "axios"

import { env } from "@/env.mjs"

export const callOpenAI = async (messages: Message[]): Promise<string> => {
  const openAIMessages = [
    {
      role: "system",
      content: "You are a helpful assistant name Typhoon. You answer in Thai.",
    },
    ...messages.slice(-100),
  ]
  const resp = await axios.post(
    env.OPENAI_URL,
    {
      messages: openAIMessages,
      model: "typhoon-v2.1-12b-instruct",
      // max_tokens: 256,
      // temperature: 0.1,
      // top_p: 0.95,
      // ignore_eos: false,
      // stop: ["<|im_end|>", "<|im_start|>"],
      // repetition_penalty: 1.1,
    },
    {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + env.OPENAI_KEY,
      },
    }
  )
  return resp.data?.choices?.[0]?.message?.content
}


export const callGreeting = async (): Promise<string> => {

  // randomize prompt for greeting
  const openAIMessages = [
    {
      role: "system",
      content: "You are a helpful assistant name Typhoon. You answer in Thai.",
    },
    { role: "user", content: '' },
  ]
  const resp = await axios.post(
    env.OPENAI_URL,
    {
      messages: openAIMessages,
      model: "typhoon-v2.1-12b-instruct",
      // max_tokens: 256,
      // temperature: 0.1,
      // top_p: 0.95,
      // ignore_eos: false,
      // stop: ["<|im_end|>", "<|im_start|>"],
      // repetition_penalty: 1.1,
    },
    {
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + env.OPENAI_KEY,
      },
    }
  )
  return resp.data?.choices?.[0]?.message?.content
}