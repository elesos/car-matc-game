import { useGame } from './hooks/useGame'
import { MenuScreen } from './components/MenuScreen'
import { GameBoard } from './components/GameBoard'
import { SlotBar } from './components/SlotBar'
import { ResultScreen } from './components/ResultScreen'
import { DIFFICULTY_CONFIG } from './utils/gameLogic'
import type { Difficulty } from './types/game'

function fmt(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function App() {
  const { state, startGame, clickCard } = useGame()
  const { status, difficulty, score, elapsed, cards, slots } = state

  if (status === 'idle') {
    return <MenuScreen onStart={startGame} />
  }

  if (status === 'won' || status === 'lost') {
    return (
      <ResultScreen
        won={status === 'won'}
        score={score}
        elapsed={elapsed}
        difficulty={difficulty}
        onRestart={(d: Difficulty) => startGame(d)}
      />
    )
  }

  const config = DIFFICULTY_CONFIG[difficulty]
  const timeLeft =
    config.timeLimit !== null ? config.timeLimit - elapsed : null

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => startGame(difficulty)}
          className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded-lg border border-gray-600 hover:border-gray-400 transition-colors"
        >
          重开
        </button>
        <div className="text-center">
          <div className="text-white font-bold text-lg">🚗 Car Matc Game</div>
          <div className="text-gray-400 text-xs">
            {difficulty === 'easy' ? '简单' : difficulty === 'normal' ? '普通' : '困难'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-yellow-400 font-bold">{score}</div>
          {timeLeft !== null && (
            <div
              className={`text-sm font-mono ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}
            >
              {fmt(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <GameBoard cards={cards} onCardClick={clickCard} />
      </div>

      {/* Slot bar */}
      <div className="p-4 bg-gray-900 border-t border-gray-700">
        <p className="text-center text-gray-500 text-xs mb-2">
          手牌槽 · 凑齐 3 张相同品牌自动消除
        </p>
        <SlotBar slots={slots} />
      </div>
    </div>
  )
}
