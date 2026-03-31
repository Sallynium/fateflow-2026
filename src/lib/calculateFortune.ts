import type { FortuneResult, ElementDistribution, FireIntensity } from '../types'
import {
  STEMS, BRANCHES, MONTH_BRANCHES,
  STEM_ELEMENT, STEM_GROUP, BRANCH_ELEMENT,
  STEM_WEIGHT, BRANCH_WEIGHT,
  TIGER_MONTH_START, RAT_HOUR_START,
  FIRE_ADVICE_2026, CAREER_ADVICE, WEALTH_ADVICE, LOVE_ADVICE,
} from '../constants/fortune'

// ─── 儒略日推算 ───────────────────────────────────────────────
function getJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

// ─── 輸入驗證 ────────────────────────────────────────────────
function validateInputs(
  dob: string,
  time: string,
): { year: number; month: number; day: number; hour: number } {
  // 日期格式
  const [yStr, mStr, dStr] = dob.split('-')
  const y = parseInt(yStr, 10)
  const m = parseInt(mStr, 10)
  const d = parseInt(dStr, 10)

  if (isNaN(y) || isNaN(m) || isNaN(d)) throw new Error('invalid_date')

  // 日期合法性（防止 2月30日等）
  const checkDate = new Date(y, m - 1, d)
  if (
    checkDate.getFullYear() !== y ||
    checkDate.getMonth() !== m - 1 ||
    checkDate.getDate() !== d
  ) {
    throw new Error('invalid_date')
  }

  // 年份範圍
  if (y < 1900) throw new Error('date_too_early')

  // 不允許未來日期（以本地年月日比較，避免時區問題）
  const now = new Date()
  const todayY = now.getFullYear()
  const todayM = now.getMonth() + 1
  const todayD = now.getDate()
  if (
    y > todayY ||
    (y === todayY && m > todayM) ||
    (y === todayY && m === todayM && d > todayD)
  ) {
    throw new Error('future_date')
  }

  // 時間格式
  const timeParts = time.split(':')
  if (timeParts.length < 2) throw new Error('invalid_time')
  const hour   = parseInt(timeParts[0], 10)
  const minute = parseInt(timeParts[1], 10)
  if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error('invalid_time')
  }

  return { year: y, month: m, day: d, hour }
}

// ─── 四柱推算 ────────────────────────────────────────────────
type StemIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type Pillar = { stem: typeof STEMS[number]; branch: typeof BRANCHES[number] }

function getFourPillars(
  year: number,
  month: number,
  day: number,
  hour: number,
): Pillar[] {
  // 年柱
  const yearStemIdx   = (((year - 4) % 10 + 10) % 10) as StemIndex
  const yearBranchIdx = ((year - 4) % 12 + 12) % 12
  const yearStem      = STEMS[yearStemIdx]
  const yearBranch    = BRANCHES[yearBranchIdx]

  // 月柱
  const monthStartIdx = TIGER_MONTH_START[yearStemIdx]
  const monthStemIdx  = (monthStartIdx + month - 1) % 10
  const monthStem     = STEMS[monthStemIdx]
  const monthBranch   = MONTH_BRANCHES[month - 1]

  // 日柱
  const jdn           = getJDN(year, month, day)
  const dayStemIdx    = (((jdn + 9) % 10 + 10) % 10) as StemIndex
  const dayBranchIdx  = ((jdn + 1) % 12 + 12) % 12
  const dayStem       = STEMS[dayStemIdx]
  const dayBranch     = BRANCHES[dayBranchIdx]

  // 時柱
  const hourBranchIdx = Math.floor(hour / 2)
  const hourStartIdx  = RAT_HOUR_START[dayStemIdx]
  const hourStemIdx   = (hourStartIdx + hourBranchIdx) % 10
  const hourStem      = STEMS[hourStemIdx]
  const hourBranch    = BRANCHES[hourBranchIdx]

  return [
    { stem: yearStem,  branch: yearBranch  },
    { stem: monthStem, branch: monthBranch },
    { stem: dayStem,   branch: dayBranch   },
    { stem: hourStem,  branch: hourBranch  },
  ]
}

// ─── 五行分布計算 ────────────────────────────────────────────
function calcElements(pillars: Pillar[]): ElementDistribution {
  const raw: ElementDistribution = { 火: 0, 土: 0, 木: 0, 水: 0, 金: 0 }

  for (const { stem, branch } of pillars) {
    raw[STEM_ELEMENT[stem]]     += STEM_WEIGHT
    raw[BRANCH_ELEMENT[branch]] += BRANCH_WEIGHT
  }

  const total = (Object.values(raw) as number[]).reduce((a, b) => a + b, 0)
  if (total === 0) throw new Error('element_sum_zero')

  const normalized: ElementDistribution = { 火: 0, 土: 0, 木: 0, 水: 0, 金: 0 }
  for (const key of Object.keys(raw) as Array<keyof ElementDistribution>) {
    normalized[key] = (raw[key] / total) * 100
  }
  return normalized
}

// ─── 火行強度分級 ─────────────────────────────────────────────
function getFireIntensity(fire: number): FireIntensity {
  if (fire >= 80) return 'extreme'
  if (fire >= 60) return 'high'
  if (fire >= 40) return 'medium'
  return 'low'
}

// ─── 分數 clamp ───────────────────────────────────────────────
function clamp(val: number): number {
  return Math.min(10, Math.max(0, val))
}

// ─── 主函式 ──────────────────────────────────────────────────
export function calculateFortune(dob: string, time: string): FortuneResult {
  const { year, month, day, hour } = validateInputs(dob, time)
  const pillars  = getFourPillars(year, month, day, hour)
  const elements = calcElements(pillars)

  const e = {
    火: elements.火 / 100,
    土: elements.土 / 100,
    木: elements.木 / 100,
    水: elements.水 / 100,
    金: elements.金 / 100,
  }

  const careerRaw = e.火 * 5.0 + e.木 * 3.0 + 2.0
  const wealthRaw = e.土 * 6.0 + e.金 * 2.0 + 2.0
  const loveRaw   = e.火 * 4.0 + e.水 * 3.0 + 2.0

  const fireIntensity = getFireIntensity(elements.火)
  const dayStemGroup  = STEM_GROUP[pillars[2].stem]

  return {
    elements,
    career:        { score: clamp(careerRaw), advice: CAREER_ADVICE[dayStemGroup][fireIntensity] },
    wealth:        { score: clamp(wealthRaw), advice: WEALTH_ADVICE[dayStemGroup][fireIntensity] },
    love:          { score: clamp(loveRaw),   advice: LOVE_ADVICE[dayStemGroup][fireIntensity] },
    fireIntensity,
    fireAdvice2026: FIRE_ADVICE_2026[dayStemGroup][fireIntensity],
    dayStemGroup,
  }
}
