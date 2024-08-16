import { useEffect, useRef } from "react"
import { Message } from "@/types"
import { toast } from "sonner"
import { create } from "zustand"

import { predictVoice } from "./voice"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const useVoiceStore = create<{
  isLoading: boolean
  isPlayingAudio: boolean
  messages: Message[]
  soundLevel: number
}>(() => ({
  isLoading: false,
  isPlayingAudio: false,
  messages: [],
  soundLevel: 0,
}))

export const useVoice = () => {
  const audioCtxRef = useRef<AudioContext>()
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const soundLevelUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const { isLoading, isPlayingAudio, messages, soundLevel } = useVoiceStore()

  const get = useVoiceStore.getState
  const set = useVoiceStore.setState

  useEffect(() => {
    audioCtxRef.current = new AudioContext()
  }, [])

  const handleStopAudio = () => {
    currentSourceRef.current?.stop()
    currentSourceRef.current = null
    if (soundLevelUpdateIntervalRef.current)
      clearInterval(soundLevelUpdateIntervalRef.current)
    soundLevelUpdateIntervalRef.current = null
    set({ isPlayingAudio: false })
  }

  const handlePlayAudio = (voice?: ArrayBuffer) => {
    if (voice) {
      audioCtxRef
        .current!.decodeAudioData(voice)
        .then(async (audioBuffer: any) => {
          if (currentSourceRef.current) {
            console.log("stop previous audio")
            currentSourceRef.current!.stop()
            currentSourceRef.current?.disconnect()
            await wait(300)
          }
          const source = audioCtxRef.current!.createBufferSource()
          const analyser = audioCtxRef.current!.createAnalyser()
          source.buffer = audioBuffer
          source.connect(audioCtxRef.current!.destination)
          source.connect(analyser)

          analyser.fftSize = 32
          const bufferLength = analyser.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)
          const updateSoundLevel = () => {
            analyser.getByteFrequencyData(dataArray)
            const sum = dataArray.reduce((acc, v) => acc + v * v, 0)
            const average = Math.sqrt(sum / bufferLength)
            set({ soundLevel: average / 100 })
          }
          const c = setInterval(updateSoundLevel, 150)

          soundLevelUpdateIntervalRef.current = c
          source.onended = () => {
            handleStopAudio()
          }
          currentSourceRef.current = source
          source.start()
          set({ isPlayingAudio: true })
        })
    }
  }

  const predict = async (
    audio?: string,
    options?: {
      ttsOAI?: string | null
    }
  ) => {
    if (!audio) {
      return
    }
    if (get().isLoading) {
      console.log("Skip due to previous loading")
      return
    }
    set({
      isLoading: true,
    })

    const resp = await predictVoice(get().messages, audio, options?.ttsOAI)

    if (resp.status === "empty") {
      set({
        isLoading: false,
      })
      return
    }

    if (resp.status === "error") {
      set({
        isLoading: false,
      })
      toast.error("AI Service Error", {
        description: resp.message,
      })
      return
    }

    console.log("Performance", resp.performance)
    handlePlayAudio(new Uint8Array(resp.audio).buffer)

    set((s) => ({
      messages: [
        ...s.messages,
        {
          role: "user",
          content: resp.transcript,
        },
        { role: "assistant", content: resp.message },
      ],
      isLoading: false,
    }))
  }

  return {
    isLoading,
    predict,
    messages,
    isPlayingAudio,
    handleStopAudio,
    getVoice: get,
    setVoice: set,
    responseSoundLevel: soundLevel,
  }
}
