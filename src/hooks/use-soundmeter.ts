import { useEffect, useState } from "react"

export const useSoundmeter = ({
  stream,
  interval = 150,
}: {
  stream?: MediaStream
  interval?: number
}) => {
  // Quiet around 0.3, loud around 0.7-1
  const [soundLevel, setSoundLevel] = useState(0)

  useEffect(() => {
    if (!stream) return
    const audio = new window.AudioContext()
    // get the audio sound level and update the state periodically
    const analyser = audio.createAnalyser()
    const source = audio.createMediaStreamSource(stream)
    source.connect(analyser)
    analyser.fftSize = 32
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const updateSoundLevel = () => {
      analyser.getByteFrequencyData(dataArray)
      const sum = dataArray.reduce((acc, v) => acc + v * v, 0)
      const average = Math.sqrt(sum / bufferLength)
      setSoundLevel(average / 100)
    }
    const c = setInterval(updateSoundLevel, interval)
    return () => {
      clearInterval(c)
      audio.close()
    }
  }, [stream, interval])

  return {
    soundLevel,
  }
}
