import type { Difficulty } from '../types/game'

interface MenuScreenProps {
  onStart: (difficulty: Difficulty) => void
}

const DIFFICULTIES: { key: Difficulty; label: string; desc: string }[] = [
  { key: 'easy', label: '简单', desc: '3层 · 6种品牌 · 无限时' },
  { key: 'normal', label: '普通', desc: '5层 · 10种品牌 · 120秒' },
  { key: 'hard', label: '困难', desc: '7层 · 16种品牌 · 90秒' },
]

export function MenuScreen({ onStart }: MenuScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-2">🚗 Car Match 3</h1>
        <p className="text-gray-400 text-lg">找到三个相同的汽车品牌消除它们！</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {DIFFICULTIES.map(d => (
          <button
            key={d.key}
            onClick={() => onStart(d.key)}
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl px-6 py-4 text-left transition-all shadow-lg"
          >
            <div className="text-xl font-bold">{d.label}</div>
            <div className="text-sm text-blue-200">{d.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
