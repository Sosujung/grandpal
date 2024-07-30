import { MainVAD } from "./main"

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="container flex h-full flex-1 flex-col items-center gap-4 text-center">
        <MainVAD />
      </div>
    </main>
  )
}
