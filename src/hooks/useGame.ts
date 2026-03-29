import { useState, useEffect, useCallback, useRef } from 'react'
import type { Card, Difficulty, GameState } from '../types/game'
import {
  generateCards,
  updateBlocked,
  DIFFICULTY_CONFIG,
} from '../utils/gameLogic'

const SLOT_COUNT = 7

export function useGame() {
  const [state, setState] = useState<GameState>({
    cards: [],
    slots: Array(SLOT_COUNT).fill(null),
    score: 0,
    elapsed: 0,
    status: 'idle',
    difficulty: 'normal',
  })

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startGame = useCallback((difficulty: Difficulty) => {
    clearTimer()
    const cards = generateCards(difficulty)
    setState({
      cards,
      slots: Array(SLOT_COUNT).fill(null),
      score: 0,
      elapsed: 0,
      status: 'playing',
      difficulty,
    })

    const config = DIFFICULTY_CONFIG[difficulty]
    if (config.timeLimit !== null) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.status !== 'playing') return prev
          const next = prev.elapsed + 1
          if (config.timeLimit !== null && next >= config.timeLimit) {
            clearTimer()
            return { ...prev, elapsed: next, status: 'lost' }
          }
          return { ...prev, elapsed: next }
        })
      }, 1000)
    }
  }, [])

  const clickCard = useCallback((card: Card) => {
    setState(prev => {
      if (prev.status !== 'playing') return prev
      if (card.isBlocked) return prev

      // Add card to first empty slot
      const slots = [...prev.slots]
      const emptyIdx = slots.findIndex(s => s === null)
      if (emptyIdx === -1) return prev // no space (shouldn't happen if we check first)

      slots[emptyIdx] = card

      // Remove card from board
      let cards = prev.cards.filter(c => c.id !== card.id)
      cards = updateBlocked(cards)

      // Check for triple match
      const brandSlots = slots.filter(s => s?.brand === card.brand)
      let score = prev.score
      let newSlots = slots

      if (brandSlots.length === 3) {
        // Remove matched cards from slots
        newSlots = slots.map(s => (s?.brand === card.brand ? null : s))
        // Compact slots: move non-null to front
        const filled = newSlots.filter(s => s !== null)
        newSlots = [
          ...filled,
          ...Array(SLOT_COUNT - filled.length).fill(null),
        ]
        score += 300
      }

      // Check win: no cards left on board and no cards in slots
      if (cards.length === 0 && newSlots.every(s => s === null)) {
        clearTimer()
        return { ...prev, cards, slots: newSlots, score, status: 'won' }
      }

      // Check lose: slots all filled with no possible match
      const filledSlots = newSlots.filter(s => s !== null)
      if (filledSlots.length === SLOT_COUNT) {
        clearTimer()
        return { ...prev, cards, slots: newSlots, score, status: 'lost' }
      }

      return { ...prev, cards, slots: newSlots, score }
    })
  }, [])

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [])

  return { state, startGame, clickCard }
}
