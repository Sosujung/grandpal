import { ReactRealTimeVADOptions, useMicVAD } from "@ricky0123/vad-react"

interface VADResult {
  listening: boolean
  errored:
    | false
    | {
        message: string
      }
  loading: boolean
  userSpeaking: boolean
  pause: () => void
  start: () => void
  toggle: () => void
}

export const useVAD = (props: Partial<ReactRealTimeVADOptions>): VADResult => {
  const vad = useMicVAD({
    modelURL: "/silero_vad.onnx",
    workletURL: "/vad.worklet.bundle.min.js",
    startOnLoad: false,
    ...props,
  })

  return vad
}
