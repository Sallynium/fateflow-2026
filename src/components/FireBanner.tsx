import { motion } from 'framer-motion'
import type { FireIntensity } from '../types'

interface Props {
  fireIntensity: FireIntensity
  advice: string
}

const BG_CLASS: Record<FireIntensity, string> = {
  extreme: 'from-fire/25 to-fire/10',
  high:    'from-fire/20 to-fire/5',
  medium:  'from-accent/15 to-accent/5',
  low:     'from-earth/15 to-earth/5',
}

const LABEL: Record<FireIntensity, string> = {
  extreme: '火行極旺',
  high:    '火行旺盛',
  medium:  '火行平衡',
  low:     '火行偏弱',
}

export function FireBanner({ fireIntensity, advice }: Props) {
  return (
    <motion.div
      className={`rounded-2xl p-6 bg-gradient-to-br ${BG_CLASS[fireIntensity]} border border-fire/20 space-y-3`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <h3 className="font-serif text-base text-ink tracking-widest">
          2026 火行年度建議
          <span className="ml-2 text-xs font-sans bg-fire/20 text-fire px-2 py-0.5 rounded-full">
            {LABEL[fireIntensity]}
          </span>
        </h3>
      </div>
      <p className="text-sm text-ink/70 leading-relaxed">{advice}</p>
    </motion.div>
  )
}
