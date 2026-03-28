import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeroInput }        from './components/HeroInput'
import { BaguaLoader }      from './components/BaguaLoader'
import { ElementBars }      from './components/ElementBars'
import { InsightCard }      from './components/InsightCard'
import { FireBanner }       from './components/FireBanner'
import { calculateFortune } from './lib/calculateFortune'
import type { FortuneResult } from './types'

type AppState = 'idle' | 'loading' | 'result' | 'error'

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle')
  const [result,   setResult]   = useState<FortuneResult | null>(null)

  const handleSubmit = (
    dob: string,
    time: string,
    _gender: 'male' | 'female' | 'unspecified',
  ) => {
    setAppState('loading')
    setTimeout(() => {
      try {
        const fortune = calculateFortune(dob, time)
        setResult(fortune)
        setAppState('result')
      } catch {
        setAppState('error')
      }
    }, 1500)
  }

  const handleReset = () => {
    setResult(null)
    setAppState('idle')
  }

  return (
    <div className="min-h-[100dvh] bg-parchment font-sans">
      <AnimatePresence mode="wait">
        {appState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroInput onSubmit={handleSubmit} />
          </motion.div>
        )}

        {appState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BaguaLoader />
          </motion.div>
        )}

        {appState === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto px-4 py-12 space-y-6"
          >
            <button
              onClick={handleReset}
              className="text-sm text-ink/50 hover:text-ink transition-colors tracking-widest flex items-center gap-1"
            >
              ← 重新推算
            </button>

            <h2 className="font-serif text-2xl text-ink tracking-[0.15em] text-center">
              您的 2026 命盤
            </h2>

            <ElementBars elements={result.elements} fireIntensity={result.fireIntensity} />

            <div className="space-y-4">
              <InsightCard
                title="事業運"
                icon="🏯"
                score={result.career.score}
                advice={result.career.advice}
                barColor="bg-accent"
                delay={0}
              />
              <InsightCard
                title="財運"
                icon="🪙"
                score={result.wealth.score}
                advice={result.wealth.advice}
                barColor="bg-earth"
                delay={0.15}
              />
              <InsightCard
                title="感情運"
                icon="🌸"
                score={result.love.score}
                advice={result.love.advice}
                barColor="bg-fire"
                delay={0.3}
              />
            </div>

            <FireBanner
              fireIntensity={result.fireIntensity}
              advice={result.fireAdvice2026}
            />

            <p className="text-xs text-ink/30 tracking-wide text-center">
              僅供娛樂參考，不構成任何建議
            </p>
          </motion.div>
        )}

        {appState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 px-4"
          >
            <p className="font-serif text-xl text-ink/70 text-center tracking-wide">
              推算時發生錯誤，<br />請確認出生日期與時辰後重試。
            </p>
            <button
              onClick={handleReset}
              className="bg-ink text-parchment px-8 py-3 rounded-xl font-serif tracking-[0.2em] text-sm hover:bg-wood transition-colors"
            >
              返回重試
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
