import type { Card } from '../types/game'
import { CardTile } from './CardTile'

interface GameBoardProps {
  cards: Card[]
  onCardClick: (card: Card) => void
}

const GRID_SIZE = 7

export function GameBoard({ cards, onCardClick }: GameBoardProps) {
  const maxLayer = cards.reduce((m, c) => Math.max(m, c.layer), 0)
  const boardPx = GRID_SIZE * 56 + maxLayer * 2 + 8

  return (
    <div className="flex items-center justify-center w-full overflow-auto">
      <div
        className="relative"
        style={{ width: `${boardPx}px`, height: `${boardPx}px` }}
      >
        {cards.map(card => (
          <CardTile
            key={card.id}
            card={card}
            onClick={onCardClick}
            maxLayer={maxLayer}
          />
        ))}
      </div>
    </div>
  )
}
