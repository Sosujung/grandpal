"use client"

import { useEffect, useState } from "react"
import { utils } from "@ricky0123/vad-react"
import _ from "lodash"
import { MessageCircle, MessageCircleOff, Mic, MicOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSoundmeter } from "@/hooks/use-soundmeter"
import { useVAD } from "@/hooks/use-vad"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Bubbly } from "./bubbly"
import { LoadingDots } from "./loading-dots"
import { useVoice } from "./use-voice"

const MainVAD = ({ className }: { className?: string }) => {
  const [stream, setStream] = useState<MediaStream>()
  useEffect(() => {
    window.navigator.mediaDevices.getUserMedia({ audio: true }).then((v) => {
      setStream(v)
    })
  }, [])

  const { soundLevel } = useSoundmeter({ stream })
  const [isResponding, setIsResponding] = useState(false)
  const [canInterupt, setCanInterupt] = useState(true)
  const [ttsOAI, setTtsOAI] = useState<
    null | "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"
  >("fable")

  const {
    predict,
    isLoading,
    isPlayingAudio,
    getVoice,
    setVoice,
    handleStopAudio,
    responseSoundLevel,
    messages,
  } = useVoice()
  const { toggle, listening, userSpeaking } = useVAD({
    submitUserSpeechOnPause: true,
    positiveSpeechThreshold: 0.6,
    stream,
    onSpeechStart: () => {
      if (isPlayingAudio && canInterupt) {
        handleStopAudio()
      }
    },
    onSpeechEnd: (audio) => {
      const wavBuffer = utils.encodeWAV(audio)
      const base64 = utils.arrayBufferToBase64(wavBuffer)
      predict(base64, {
        ttsOAI,
      })
    },
  })

  const M = listening ? Mic : MicOff
  const S = canInterupt ? MessageCircle : MessageCircleOff

  return (
    <>
      <div className="flex-1" />
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <Bubbly
          isActive={listening}
          isTalking={userSpeaking}
          soundLevel={soundLevel}
          responseSoundLevel={responseSoundLevel}
          isResponding={isPlayingAudio}
          onClick={toggle}
        />
      </div>
      <div className="flex-1" />
      {isPlayingAudio && (
        <div className="max-h-40 overflow-y-auto text-sm">
          {_.last(messages)?.content}
        </div>
      )}
      <div className={cn("mb-10 flex w-full items-center gap-1 rounded-md")}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <M className="size-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Listen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={listening ? "on" : "off"}
              onValueChange={toggle}
            >
              <DropdownMenuRadioItem value="on">On</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="off">Off</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex-1" />
        <LoadingDots
          shown={isLoading}
          className="left-0 right-0 ml-auto mr-auto"
        />
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MessageCircle className="size-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Interrupt</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={canInterupt ? "allow" : "disallow"}
              onValueChange={(v) => setCanInterupt(v === "allow")}
            >
              <DropdownMenuRadioItem value="allow">Allow</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="disallow">
                Disallow
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Text-to-Speech</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={ttsOAI ? "true" : "false"}
              onValueChange={(v) => setTtsOAI(v === "true" ? "alloy" : null)}
            >
              <DropdownMenuRadioItem value="false">
                Gowajee
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="true">
                Open AI
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            {ttsOAI && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Voice</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={ttsOAI}
                  onValueChange={(v) => setTtsOAI(v as any)}
                >
                  {["alloy", "echo", "fable", "onyx", "nova", "shimmer"].map(
                    (v) => (
                      <DropdownMenuRadioItem key={v} value={v}>
                        {_.startCase(v)}
                      </DropdownMenuRadioItem>
                    )
                  )}
                </DropdownMenuRadioGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
MainVAD.displayName = "MainVAD"

export { MainVAD }
