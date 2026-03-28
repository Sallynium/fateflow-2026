import { motion } from 'framer-motion'

interface Props {
  title: string
  icon: string
  score: number
  advice: string
  barColor: 'bg-accent' | 'bg-earth' | 'bg-fire'
  delay?: number
}

export function InsightCard({ title, icon, score, advice, barColor, delay = 0 }: Props) {
  return (
    <motion.div
      className="bg-parchment-surface rounded-2xl p-5 space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-serif text-base text-ink tracking-widest">{title}</h3>
      </div>

      <div className="flex items-end gap-1">
        <span className="font-serif text-3xl text-ink">{score.toFixed(1)}</span>
        <span className="text-ink/50 text-sm mb-1">/ 10</span>
      </div>

      {/* 分數進度條 */}
      <div className="h-1.5 bg-parchment rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: '0%' }}
          animate={{ width: `${(score / 10) * 100}%` }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
        />
      </div>

      <p className="text-sm text-ink/70 leading-relaxed">{advice}</p>
    </motion.div>
  )
}
