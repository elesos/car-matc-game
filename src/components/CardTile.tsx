import type { Card } from '../types/game'
import { logoUrl } from '../utils/gameLogic'

interface CardTileProps {
  card: Card
  onClick: (card: Card) => void
  maxLayer: number
}

export function CardTile({ card, onClick, maxLayer }: CardTileProps) {
  const blocked = card.isBlocked

  // Depth effect: higher layers appear brighter / on top
  const brightness = 60 + Math.round((card.layer / maxLayer) * 40)
  const zIndex = card.layer * 10

  return (
    <div
      className="absolute"
      style={{
        // Offset cards by layer for depth illusion
        left: `${card.col * 56 + card.layer * 2}px`,
        top: `${card.row * 56 + card.layer * 2}px`,
        zIndex,
        filter: blocked ? `brightness(${brightness}%)` : 'brightness(100%)',
        cursor: blocked ? 'not-allowed' : 'pointer',
        transition: 'filter 0.15s',
      }}
      onClick={() => !blocked && onClick(card)}
    >
      <div
        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center bg-white shadow-md select-none ${
          blocked
            ? 'border-gray-400 opacity-70'
            : 'border-blue-400 hover:border-yellow-400 hover:scale-105 active:scale-95'
        } transition-transform`}
      >
        <img
          src={logoUrl(card.brand)}
          alt={card.brand}
          className="w-9 h-9 object-contain"
          draggable={false}
        />
      </div>
    </div>
  )
}
