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
  // Array of random greeting phrases
  const greetingPhrases = [
    "สวัสดีครับ ผมชื่อไต้ฝุ่น วันนี้คุณทำอะไรอยู่ครับ?",
    "หวัดดีครับ ผมไต้ฝุ่นนะครับ มีอะไรให้ช่วยเหลือไหมครับ?",
    "สวัสดีครับ ผมไต้ฝุ่น พร้อมจะคุยกับคุณแล้วครับ วันนี้เป็นยังไงบ้างครับ?",
    "ยินดีที่ได้รู้จักครับ ผมชื่อไต้ฝุ่น อยากคุยเรื่องอะไรครับ?",
    "สวัสดีครับ ผมไต้ฝุ่น ผู้ช่วยของคุณครับ มาคุยกันเถอะครับ!"
  ];

  // Pick a random greeting
  const randomGreeting = greetingPhrases[Math.floor(Math.random() * greetingPhrases.length)];
  
  return randomGreeting;
}