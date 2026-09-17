/// <reference types="vite/client" />

declare global {
  interface Window {
    render_game_to_text: () => string
    advanceTime: (ms: number) => void
    advanceRecycling?: (ms: number) => void
    recyclingState?: () => unknown
    advancePractice?: (ms: number) => void
    practiceState?: () => unknown
  }
}

export {}
