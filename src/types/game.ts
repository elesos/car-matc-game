// TypeScript types for car-match-3

export type Difficulty = 'easy' | 'normal' | 'hard'

export interface DifficultyConfig {
  layers: number
  brandCount: number
  timeLimit: number | null // seconds, null = no limit
  slotCount: number
}

export interface Card {
  id: string
  brand: string
  layer: number
  row: number
  col: number
  isBlocked: boolean // covered by cards above
}

export interface GameState {
  cards: Card[]
  slots: (Card | null)[]
  score: number
  elapsed: number // seconds
  status: 'idle' | 'playing' | 'won' | 'lost'
  difficulty: Difficulty
}
