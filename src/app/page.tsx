"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { MainVAD } from "./main"
import DailyCompanion from "@/components/daily-companion"

export default function Home() {
  const [showDailyCompanion, setShowDailyCompanion] = useState(false)

  if (showDailyCompanion) {
    return <DailyCompanion onBack={() => setShowDailyCompanion(false)} />
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="container flex h-full flex-1 flex-col items-center gap-4 text-center">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowDailyCompanion(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
          >
            <Heart size={16} />
            เพื่อนคู่ใจ
          </button>
        </div>
        <MainVAD />
      </div>
    </main>
  )
}
