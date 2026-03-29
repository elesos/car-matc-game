import type { Difficulty } from '../types/game'

interface ResultScreenProps {
  won: boolean
  score: number
  elapsed: number
  onRestart: (difficulty: Difficulty) => void
  difficulty: Difficulty
}

function fmt(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}分${sec}秒` : `${sec}秒`
}

export function ResultScreen({
  won,
  score,
  elapsed,
  onRestart,
  difficulty,
}: ResultScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      <div className="text-center">
        <div className="text-6xl mb-4">{won ? '🏆' : '😢'}</div>
        <h2 className="text-4xl font-bold text-white mb-2">
          {won ? '恭喜通关！' : '挑战失败'}
        </h2>
        <p className="text-gray-300 text-lg">
          得分：<span className="text-yellow-400 font-bold">{score}</span>
        </p>
        <p className="text-gray-400">用时：{fmt(elapsed)}</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onRestart(difficulty)}
          className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl px-6 py-4 text-lg font-bold transition-all"
        >
          再玩一次
        </button>
        <button
          onClick={() => onRestart('normal')}
          className="bg-gray-700 hover:bg-gray-600 active:scale-95 text-white rounded-xl px-6 py-4 text-lg transition-all"
        >
          返回主菜单
        </button>
      </div>
    </div>
  )
}
