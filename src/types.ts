export type FireIntensity = 'low' | 'medium' | 'high' | 'extreme'

export interface ElementDistribution {
  火: number
  土: number
  木: number
  水: number
  金: number
}

export interface InsightResult {
  score: number
  advice: string
}

export interface FortuneResult {
  elements: ElementDistribution
  career: InsightResult
  wealth: InsightResult
  love: InsightResult
  fireIntensity: FireIntensity
  fireAdvice2026: string
}
