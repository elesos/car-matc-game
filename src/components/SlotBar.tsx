import type { Card } from '../types/game'
import { logoUrl } from '../utils/gameLogic'

interface SlotBarProps {
  slots: (Card | null)[]
}

export function SlotBar({ slots }: SlotBarProps) {
  return (
    <div className="flex gap-2 justify-center p-3 bg-gray-800 rounded-xl border border-gray-600">
      {slots.map((card, idx) => (
        <div
          key={idx}
          className="w-12 h-12 rounded-lg border-2 border-gray-500 bg-gray-700 flex items-center justify-center"
        >
          {card && (
            <img
              src={logoUrl(card.brand)}
              alt={card.brand}
              className="w-9 h-9 object-contain"
            />
          )}
        </div>
      ))}
    </div>
  )
}
