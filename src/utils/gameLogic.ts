import type { Card, Difficulty, DifficultyConfig } from '../types/game'

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { layers: 3, brandCount: 6, timeLimit: null, slotCount: 7 },
  normal: { layers: 5, brandCount: 10, timeLimit: 120, slotCount: 7 },
  hard: { layers: 7, brandCount: 16, timeLimit: 90, slotCount: 7 },
}

export const ALL_BRANDS = [
  'abarth', 'acura', 'alfa-romeo', 'aston-martin', 'audi',
  'bentley', 'bmw', 'bugatti', 'buick', 'byd',
  'cadillac', 'chevrolet', 'chrysler', 'citroen', 'dacia',
  'dodge', 'ferrari', 'fiat', 'ford', 'honda',
  'hyundai', 'jaguar', 'jeep', 'kia', 'lamborghini',
  'lancia', 'land-rover', 'lexus', 'lincoln', 'lotus',
  'maserati', 'mazda', 'mclaren', 'mercedes-benz', 'mini',
  'mitsubishi', 'nissan', 'opel', 'peugeot', 'porsche',
  'renault', 'rolls-royce', 'subaru', 'suzuki', 'tesla',
  'toyota', 'volkswagen', 'volvo',
]

const GRID_SIZE = 7

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateCards(difficulty: Difficulty): Card[] {
  const { layers, brandCount } = DIFFICULTY_CONFIG[difficulty]
  const brands = shuffle(ALL_BRANDS).slice(0, brandCount)

  // Each brand appears exactly 3 times per set; fill layers with sets
  const totalSlots = GRID_SIZE * GRID_SIZE * layers
  const setsNeeded = Math.ceil(totalSlots / (brandCount * 3))
  let pool: string[] = []
  for (let i = 0; i < setsNeeded; i++) {
    brands.forEach(b => { pool.push(b, b, b) })
  }
  pool = shuffle(pool).slice(0, totalSlots)

  // Ensure count divisible by 3 for each brand → trim to nearest multiple
  // Simple approach: fill pool brand-by-brand in triples
  const brandTriples: string[] = []
  for (const b of brands) {
    brandTriples.push(b, b, b)
  }
  // Repeat to fill layers
  let repeats: string[] = []
  while (repeats.length < totalSlots) {
    repeats = repeats.concat(shuffle(brandTriples))
  }
  repeats = repeats.slice(0, totalSlots)
  repeats = shuffle(repeats)

  const cards: Card[] = []
  let idx = 0
  for (let layer = 0; layer < layers; layer++) {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        cards.push({
          id: `${layer}-${row}-${col}`,
          brand: repeats[idx++],
          layer,
          row,
          col,
          isBlocked: false,
        })
      }
    }
  }

  return updateBlocked(cards)
}

export function updateBlocked(cards: Card[]): Card[] {
  // A card is blocked if any card on a higher layer overlaps it
  return cards.map(card => {
    const blocked = cards.some(
      other =>
        other.layer > card.layer &&
        other.row === card.row &&
        other.col === card.col
    )
    return { ...card, isBlocked: blocked }
  })
}

export function logoUrl(brand: string): string {
  return `/logos/${brand}.png`
}
