import { motion } from 'framer-motion'
import type { ElementDistribution, FireIntensity } from '../types'
import { ELEMENT_COLOR, ELEMENT_PRIORITY } from '../constants/fortune'

interface Props {
  elements: ElementDistribution
  fireIntensity: FireIntensity
}

const ELEMENT_LABEL: Record<keyof ElementDistribution, string> = {
  火: '火行', 土: '土行', 木: '木行', 水: '水行', 金: '金行',
}

export function ElementBars({ elements, fireIntensity }: Props) {
  // 依強度降序排列；相同時依固定優先順序（火>土>木>水>金）
  const sorted = [...ELEMENT_PRIORITY].sort((a, b) => {
    const diff = elements[b] - elements[a]
    if (diff !== 0) return diff
    return ELEMENT_PRIORITY.indexOf(a) - ELEMENT_PRIORITY.indexOf(b)
  })

  const showFireBadge = fireIntensity === 'high' || fireIntensity === 'extreme'

  return (
    <div className="bg-parchment-surface rounded-2xl p-6 space-y-4">
      <h2 className="font-serif text-lg text-ink tracking-widest text-center">五行分布</h2>

      <div className="space-y-3">
        {sorted.map((el, i) => (
          <div key={el} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-ink/70 tracking-wide flex items-center gap-2">
                {ELEMENT_LABEL[el]}
                {el === '火' && showFireBadge && (
                  <span className="text-xs bg-fire text-white px-1.5 py-0.5 rounded-full tracking-normal">
                    本命旺
                  </span>
                )}
              </span>
              <span className="text-ink font-medium">{elements[el].toFixed(1)}%</span>
            </div>
            <div className="h-2.5 bg-parchment rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${ELEMENT_COLOR[el]}`}
                initial={{ width: '0%' }}
                animate={{ width: `${elements[el]}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 丙午年提示 */}
      <p className="text-xs text-ink/50 text-center pt-2 tracking-wide">
        2026 丙午火馬年 · 流年五行以火為主
      </p>
    </div>
  )
}
