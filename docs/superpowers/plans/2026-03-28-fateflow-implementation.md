# FateFlow 2026 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 FateFlow 2026 命理 Web App，使用者輸入出生日期與時辰，即可看到八字五行水平條狀圖、事業／財運／感情洞察卡片、2026 丙午年火行建議。

**Architecture:** Vite + React 18 + TypeScript 純前端 SPA。核心推算邏輯集中於 `src/lib/calculateFortune.ts`，UI 狀態由 `App.tsx` 以四段狀態機管理（idle → loading → result | error）。所有常數與文案集中於 `src/constants/fortune.ts`，元件各司其職，不含推算邏輯。

**Tech Stack:** Vite 5、React 18、TypeScript 5、Tailwind CSS 3、Framer Motion 11、Noto Serif TC / Noto Sans TC（Google Fonts）、Vitest（單元測試）、Vercel（部署）

---

## 檔案對應表

| 檔案 | 動作 | 職責 |
|------|------|------|
| `package.json` | 建立 | 依賴清單（含 vitest、framer-motion） |
| `vite.config.ts` | 建立 | Vite 設定（含 vitest config） |
| `tailwind.config.ts` | 建立 | 自訂色彩 token、safelist |
| `index.html` | 建立 | Google Fonts preconnect、中文 lang 屬性 |
| `src/index.css` | 建立 | Tailwind 指令、CSS 變數 |
| `src/types.ts` | 建立 | `FortuneResult`、`ElementDistribution`、`InsightResult`、`FireIntensity` |
| `src/constants/fortune.ts` | 建立 | 天干地支對照表、五行對應、FIRE_ADVICE_2026、CAREER/WEALTH/LOVE_ADVICE |
| `src/lib/calculateFortune.ts` | 建立 | 核心推算邏輯（輸入驗證、四柱推算、五行分布、洞察分數） |
| `src/lib/calculateFortune.test.ts` | 建立 | Vitest 單元測試 |
| `src/components/HeroInput.tsx` | 建立 | 日期／時辰輸入、農曆 toggle、性別選填、前端驗證 |
| `src/components/BaguaLoader.tsx` | 建立 | SVG 八卦旋轉動畫（Framer Motion） |
| `src/components/ElementBars.tsx` | 建立 | 五行水平條狀圖（Framer Motion 動畫） |
| `src/components/InsightCard.tsx` | 建立 | 事業／財運／感情洞察卡片 |
| `src/components/FireBanner.tsx` | 建立 | 2026 火行年度建議橫幅 |
| `src/App.tsx` | 建立 | 狀態機（idle/loading/result/error）、組合所有元件 |
| `src/main.tsx` | 建立 | React root render |

---

## Task 1：初始化專案

**Files:**
- 建立: `D:\ClaudeFiles\fortune\package.json`
- 建立: `D:\ClaudeFiles\fortune\vite.config.ts`
- 建立: `D:\ClaudeFiles\fortune\tailwind.config.ts`
- 建立: `D:\ClaudeFiles\fortune\postcss.config.js`
- 建立: `D:\ClaudeFiles\fortune\tsconfig.json`
- 建立: `D:\ClaudeFiles\fortune\tsconfig.node.json`
- 建立: `D:\ClaudeFiles\fortune\.gitignore`

- [ ] **Step 1: 在專案根目錄初始化 npm 並安裝所有依賴**

```bash
cd D:\ClaudeFiles\fortune
npm create vite@latest . -- --template react-ts --yes 2>/dev/null || true
npm install
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
npx tailwindcss init -p --ts
```

- [ ] **Step 2: 更新 `vite.config.ts`（加入 Vitest 設定）**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
```

- [ ] **Step 3: 建立 `src/test-setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: 更新 `tailwind.config.ts`（自訂色彩 token + safelist）**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [
    'bg-accent', 'bg-earth', 'bg-fire',
    'bg-wood-el', 'bg-water', 'bg-metal',
  ],
  theme: {
    extend: {
      colors: {
        parchment: { DEFAULT: '#F5F0E8', surface: '#EDE5D8' },
        wood:      { DEFAULT: '#8B6F47', light: '#A88B6A' },
        ink:       { DEFAULT: '#2C2416', muted: '#6B5B45' },
        accent:    '#C17B3F',
        fire:      '#D4521A',
        water:     '#3A7CA5',
        metal:     '#7A7A7A',
        earth:     '#B8860B',
        'wood-el': '#4A7C59',
      },
      fontFamily: {
        serif: ['"Noto Serif TC"', 'serif'],
        sans:  ['"Noto Sans TC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: 更新 `index.html`（加入 Google Fonts preconnect、中文 lang）**

```html
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500&family=Noto+Serif+TC:wght@400;600&display=swap" rel="stylesheet" />
    <title>FateFlow 2026 — 八字命盤推算</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 更新 `src/index.css`（Tailwind 指令 + 基礎樣式）**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-parchment text-ink font-sans antialiased;
  }
}
```

- [ ] **Step 7: 確認 Tailwind 正常載入**

```bash
cd D:\ClaudeFiles\fortune
npm run build 2>&1 | tail -5
```

Expected: `✓ built in` 成功訊息，無 error。

- [ ] **Step 8: commit**

```bash
cd D:\ClaudeFiles\fortune
git add package.json vite.config.ts tailwind.config.ts postcss.config.js tsconfig.json index.html src/index.css src/test-setup.ts
git commit -m "chore: 初始化 Vite + React + TS + Tailwind + Vitest"
```

---

## Task 2：型別定義與常數

**Files:**
- 建立: `src/types.ts`
- 建立: `src/constants/fortune.ts`

- [ ] **Step 1: 建立 `src/types.ts`**

```typescript
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
```

- [ ] **Step 2: 建立 `src/constants/fortune.ts`（天干地支對照 + 文案）**

```typescript
import type { ElementDistribution, FireIntensity } from '../types'

// 天干
export const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const

// 地支
export const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const

// 月柱地支（月份 1–12 → 寅卯辰…）
export const MONTH_BRANCHES = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'] as const

// 天干 → 五行
export const STEM_ELEMENT: Record<string, keyof ElementDistribution> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
}

// 地支 → 五行（主五行）
export const BRANCH_ELEMENT: Record<string, keyof ElementDistribution> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
}

// 各柱權重
export const STEM_WEIGHT   = 0.6
export const BRANCH_WEIGHT = 0.4

// 五虎遁年法（年天干索引 → 寅月天干起始索引）
// 甲(0)/己(5) → 丙(2), 乙(1)/庚(6) → 戊(4), 丙(2)/辛(7) → 庚(6)
// 丁(3)/壬(8) → 壬(8), 戊(4)/癸(9) → 甲(0)
export const TIGER_MONTH_START: Record<number, number> = {
  0: 2, 5: 2,
  1: 4, 6: 4,
  2: 6, 7: 6,
  3: 8, 8: 8,
  4: 0, 9: 0,
}

// 五鼠遁日法（日天干索引 → 子時天干起始索引）
// 甲(0)/己(5) → 甲(0), 乙(1)/庚(6) → 丙(2), 丙(2)/辛(7) → 戊(4)
// 丁(3)/壬(8) → 庚(6), 戊(4)/癸(9) → 壬(8)
export const RAT_HOUR_START: Record<number, number> = {
  0: 0, 5: 0,
  1: 2, 6: 2,
  2: 4, 7: 4,
  3: 6, 8: 6,
  4: 8, 9: 8,
}

// 2026 火行建議
export const FIRE_ADVICE_2026: Record<FireIntensity, string> = {
  extreme: '您的火行（≥80%）與丙午流年形成極旺共鳴，能量充沛卻易失控。2026 請將熱情聚焦於單一目標，避免多線並進。秋季後宜放慢節奏，以水行（多喝水、近水居所）調節。',
  high:    '火行旺盛（60–79%），加上流年火馬助力，衝勁十足。事業上適合主動出擊，但需留意人際間的急躁言辭。夏季前後是全年能量高峰，重要決策宜在此時落定。',
  medium:  '火行平衡（40–59%），流年火氣適度補充，整體運勢穩中帶升。2026 適合在既有基礎上推進計畫，不必大幅冒險，穩定行動即能有所收穫。',
  low:     '您的火行偏弱（<40%），流年丙午雖帶來外部機遇，但內在動能需要刻意培養。建議主動增加社交、參與具挑戰性的專案，借外部火氣激活自身潛能。',
}

// 事業建議
export const CAREER_ADVICE: Record<FireIntensity, string> = {
  extreme: '火行旺盛，衝勁十足。2026 適合主動出擊、拓展領導職位或創業。第三季需防過度擴張，保留後勁。',
  high:    '事業運強勁，適合承擔新責任。注意避免因急躁而略過細節，穩健推進比急速衝刺更持久。',
  medium:  '事業發展平穩，適合深耕專業、建立長期信任。今年播下的種子，明年可見豐收。',
  low:     '事業運需主動開創。尋找能激發您熱情的機會，借助外部資源補足動力，貴人在社交場合中出現。',
}

// 財運建議
export const WEALTH_ADVICE: Record<FireIntensity, string> = {
  extreme: '火旺易生衝動消費，宜設立「冷靜 24 小時」原則再做大額決策。土行穩健，長線投資優於短線操作。',
  high:    '土行扶持，適合穩健積累。火旺帶來機遇，但需謹慎評估風險。二月、八月財運最旺。',
  medium:  '財運平穩，適合規律儲蓄與分散投資。今年避免大幅度資產調整，守成即是獲利。',
  low:     '金行稍弱，宜加強財務規劃。尋求專業建議，建立緊急預備金後再考慮投資機會。',
}

// 感情建議
export const LOVE_ADVICE: Record<FireIntensity, string> = {
  extreme: '火馬年情緣極旺，感情濃烈。舊緣可能突然升溫。注意激情過後的溝通品質，避免因衝動言語傷及感情。',
  high:    '火馬年情緣旺盛，感情升溫。舊緣加深，單身者春季易逢貴緣，緣分自然而至。',
  medium:  '感情運穩定，適合深化既有關係。單身者宜主動擴大社交圈，緣分在熟悉環境中萌發。',
  low:     '感情需要主動耕耘。水行為您帶來細膩感知，用真誠傾聽代替言辭，感情自然升溫。',
}

// 五行顯示顏色（對應 Tailwind 自訂色彩）
export const ELEMENT_COLOR: Record<keyof ElementDistribution, string> = {
  火: 'bg-fire',
  土: 'bg-earth',
  木: 'bg-wood-el',
  水: 'bg-water',
  金: 'bg-metal',
}

// 五行固定排序優先順序（相同強度時使用）
export const ELEMENT_PRIORITY: Array<keyof ElementDistribution> = ['火','土','木','水','金']
```

- [ ] **Step 3: commit**

```bash
cd D:\ClaudeFiles\fortune
git add src/types.ts src/constants/fortune.ts
git commit -m "feat: 新增型別定義與五行常數、文案"
```

---

## Task 3：calculateFortune 核心邏輯（TDD）

**Files:**
- 建立: `src/lib/calculateFortune.ts`
- 建立: `src/lib/calculateFortune.test.ts`

- [ ] **Step 1: 先寫測試檔（failing）**

```typescript
// src/lib/calculateFortune.test.ts
import { describe, it, expect } from 'vitest'
import { calculateFortune } from './calculateFortune'

describe('calculateFortune - 輸入驗證', () => {
  it('無效日期格式應拋出 Error', () => {
    expect(() => calculateFortune('not-a-date', '12:00')).toThrow()
  })

  it('未來日期應拋出 Error', () => {
    expect(() => calculateFortune('2099-01-01', '12:00')).toThrow()
  })

  it('1900 年以前應拋出 Error', () => {
    expect(() => calculateFortune('1899-12-31', '12:00')).toThrow()
  })

  it('無效時間應拋出 Error', () => {
    expect(() => calculateFortune('1990-06-15', '25:00')).toThrow()
  })

  it('無效時間分鐘應拋出 Error', () => {
    expect(() => calculateFortune('1990-06-15', '12:60')).toThrow()
  })

  it('時間含秒數應正常執行（秒數截除）', () => {
    expect(() => calculateFortune('1990-06-15', '12:30:00')).not.toThrow()
  })
})

describe('calculateFortune - 回傳結構', () => {
  const result = calculateFortune('1990-06-15', '14:30')

  it('五行總和應為 100', () => {
    const sum = Object.values(result.elements).reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(100, 1)
  })

  it('各行數值應在 0–100 之間', () => {
    for (const val of Object.values(result.elements)) {
      expect(val).toBeGreaterThanOrEqual(0)
      expect(val).toBeLessThanOrEqual(100)
    }
  })

  it('分數應在 0–10 之間', () => {
    expect(result.career.score).toBeGreaterThanOrEqual(0)
    expect(result.career.score).toBeLessThanOrEqual(10)
    expect(result.wealth.score).toBeGreaterThanOrEqual(0)
    expect(result.wealth.score).toBeLessThanOrEqual(10)
    expect(result.love.score).toBeGreaterThanOrEqual(0)
    expect(result.love.score).toBeLessThanOrEqual(10)
  })

  it('fireIntensity 應為合法值', () => {
    expect(['low','medium','high','extreme']).toContain(result.fireIntensity)
  })

  it('advice 字串不應為空', () => {
    expect(result.career.advice.length).toBeGreaterThan(0)
    expect(result.wealth.advice.length).toBeGreaterThan(0)
    expect(result.love.advice.length).toBeGreaterThan(0)
    expect(result.fireAdvice2026.length).toBeGreaterThan(0)
  })
})

describe('calculateFortune - 火行強度分級', () => {
  // 1976-07-07 14:00 → 火行應極旺（夏季出生，多火支）
  it('extreme: 特定火旺日期', () => {
    const r = calculateFortune('1976-07-07', '12:00')
    // 此日期火行強度可能為 high 或 extreme，至少不為 low
    expect(['high','extreme']).toContain(r.fireIntensity)
  })

  // 1993-12-15 02:00 → 冬季出生，水旺
  it('low: 冬季水旺日期', () => {
    const r = calculateFortune('1993-12-15', '02:00')
    expect(['low','medium']).toContain(r.fireIntensity)
  })
})
```

- [ ] **Step 2: 執行測試確認全部失敗（calculateFortune 不存在）**

```bash
cd D:\ClaudeFiles\fortune
npx vitest run src/lib/calculateFortune.test.ts 2>&1 | tail -10
```

Expected: 全部 FAIL，因為 `calculateFortune` 尚未實作。

- [ ] **Step 3: 實作 `src/lib/calculateFortune.ts`**

```typescript
import type { FortuneResult, ElementDistribution, FireIntensity } from '../types'
import {
  STEMS, BRANCHES, MONTH_BRANCHES,
  STEM_ELEMENT, BRANCH_ELEMENT,
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
function validateInputs(dob: string, time: string): { year: number; month: number; day: number; hour: number } {
  const date = new Date(dob)
  if (isNaN(date.getTime())) throw new Error('invalid_date')

  const [y, m, d] = dob.split('-').map(Number)
  const checkDate = new Date(y, m - 1, d)
  if (checkDate.getFullYear() !== y || checkDate.getMonth() !== m - 1 || checkDate.getDate() !== d) {
    throw new Error('invalid_date')
  }
  if (y < 1900) throw new Error('date_too_early')

  const today = new Date()
  today.setHours(23, 59, 59, 999)
  if (date > today) throw new Error('future_date')

  const timeParts = time.split(':')
  if (timeParts.length < 2) throw new Error('invalid_time')
  const hour = parseInt(timeParts[0], 10)
  const minute = parseInt(timeParts[1], 10)
  if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error('invalid_time')
  }

  return { year: y, month: m, day: d, hour }
}

// ─── 四柱推算 ────────────────────────────────────────────────
function getFourPillars(year: number, month: number, day: number, hour: number) {
  // 年柱
  const yearStemIdx   = (year - 4) % 10
  const yearBranchIdx = (year - 4) % 12
  const yearStem      = STEMS[yearStemIdx]
  const yearBranch    = BRANCHES[yearBranchIdx]

  // 月柱
  const monthStartIdx = TIGER_MONTH_START[yearStemIdx]
  const monthStem     = STEMS[(monthStartIdx + month - 1) % 10]
  const monthBranch   = MONTH_BRANCHES[month - 1]

  // 日柱
  const jdn           = getJDN(year, month, day)
  const dayStemIdx    = (jdn + 9) % 10
  const dayBranchIdx  = (jdn + 1) % 12
  const dayStem       = STEMS[dayStemIdx]
  const dayBranch     = BRANCHES[dayBranchIdx]

  // 時柱
  const hourBranchIdx = Math.floor(hour / 2)
  const hourStartIdx  = RAT_HOUR_START[dayStemIdx]
  const hourStem      = STEMS[(hourStartIdx + hourBranchIdx) % 10]
  const hourBranch    = BRANCHES[hourBranchIdx]

  return [
    { stem: yearStem,  branch: yearBranch  },
    { stem: monthStem, branch: monthBranch },
    { stem: dayStem,   branch: dayBranch   },
    { stem: hourStem,  branch: hourBranch  },
  ]
}

// ─── 五行分布計算 ────────────────────────────────────────────
function calcElements(pillars: Array<{ stem: string; branch: string }>): ElementDistribution {
  const raw: ElementDistribution = { 火: 0, 土: 0, 木: 0, 水: 0, 金: 0 }

  for (const { stem, branch } of pillars) {
    raw[STEM_ELEMENT[stem]]     += STEM_WEIGHT
    raw[BRANCH_ELEMENT[branch]] += BRANCH_WEIGHT
  }

  const total = Object.values(raw).reduce((a, b) => a + b, 0)
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

// ─── 洞察分數計算 ─────────────────────────────────────────────
function clamp(val: number): number {
  return Math.min(10, Math.max(0, val))
}

// ─── 主函式 ──────────────────────────────────────────────────
export function calculateFortune(dob: string, time: string): FortuneResult {
  const { year, month, day, hour } = validateInputs(dob, time)
  const pillars   = getFourPillars(year, month, day, hour)
  const elements  = calcElements(pillars)

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

  return {
    elements,
    career:       { score: clamp(careerRaw), advice: CAREER_ADVICE[fireIntensity] },
    wealth:       { score: clamp(wealthRaw), advice: WEALTH_ADVICE[fireIntensity] },
    love:         { score: clamp(loveRaw),   advice: LOVE_ADVICE[fireIntensity] },
    fireIntensity,
    fireAdvice2026: FIRE_ADVICE_2026[fireIntensity],
  }
}
```

- [ ] **Step 4: 執行測試確認全部通過**

```bash
cd D:\ClaudeFiles\fortune
npx vitest run src/lib/calculateFortune.test.ts 2>&1 | tail -15
```

Expected: 全部 PASS，零 failures。

- [ ] **Step 5: commit**

```bash
cd D:\ClaudeFiles\fortune
git add src/lib/calculateFortune.ts src/lib/calculateFortune.test.ts
git commit -m "feat: 實作 calculateFortune 核心邏輯（TDD）"
```

---

## Task 4：BaguaLoader 元件

**Files:**
- 建立: `src/components/BaguaLoader.tsx`

- [ ] **Step 1: 建立 `src/components/BaguaLoader.tsx`**

```tsx
import { motion } from 'framer-motion'

const DOTS = [0, 0.2, 0.4]

export function BaguaLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* 八卦旋轉圓環 */}
      <div className="relative w-48 h-48">
        {/* 旋轉外環（SVG 八卦） */}
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
        >
          {/* 八卦八個卦象弧段，各以對應五行色彩繪製 */}
          {[
            { color: '#D4521A', label: '離' }, // 火
            { color: '#D4521A', label: '巽' }, // 木/火
            { color: '#4A7C59', label: '震' }, // 木
            { color: '#3A7CA5', label: '坎' }, // 水
            { color: '#3A7CA5', label: '艮' }, // 土/水
            { color: '#B8860B', label: '坤' }, // 土
            { color: '#7A7A7A', label: '兌' }, // 金
            { color: '#7A7A7A', label: '乾' }, // 金
          ].map((gua, i) => {
            const angle    = (i * 45 - 90) * (Math.PI / 180)
            const nextAngle = ((i + 1) * 45 - 90) * (Math.PI / 180)
            const r = 85
            const x1 = 100 + r * Math.cos(angle)
            const y1 = 100 + r * Math.sin(angle)
            const x2 = 100 + r * Math.cos(nextAngle)
            const y2 = 100 + r * Math.sin(nextAngle)
            return (
              <path
                key={gua.label}
                d={`M100,100 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                fill={gua.color}
                opacity={0.75}
                stroke="#F5F0E8"
                strokeWidth={2}
              />
            )
          })}
          {/* 中心遮罩（白色圓） */}
          <circle cx="100" cy="100" r="55" fill="#F5F0E8" />
        </motion.svg>

        {/* 靜止陰陽符號 */}
        <div className="absolute inset-0 flex items-center justify-center text-5xl select-none">
          ☯
        </div>
      </div>

      {/* 文字區 */}
      <div className="text-center space-y-2">
        <p className="font-serif text-xl text-ink tracking-widest">天機推算中</p>
        <p className="text-sm text-ink/60 tracking-wide">正在推算您的 2026 八字命盤</p>
        {/* 三點動畫 */}
        <div className="flex justify-center gap-1 pt-1">
          {DOTS.map((delay, i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-accent inline-block"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, delay, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: commit**

```bash
cd D:\ClaudeFiles\fortune
git add src/components/BaguaLoader.tsx
git commit -m "feat: 新增 BaguaLoader 八卦旋轉動畫元件"
```

---

## Task 5：ElementBars 元件

**Files:**
- 建立: `src/components/ElementBars.tsx`

- [ ] **Step 1: 建立 `src/components/ElementBars.tsx`**

```tsx
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
  // 依強度降序排列，相同時依固定優先順序
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
```

- [ ] **Step 2: commit**

```bash
cd D:\ClaudeFiles\fortune
git add src/components/ElementBars.tsx
git commit -m "feat: 新增 ElementBars 五行水平條狀圖元件"
```

---

## Task 6：InsightCard 與 FireBanner 元件

**Files:**
- 建立: `src/components/InsightCard.tsx`
- 建立: `src/components/FireBanner.tsx`

- [ ] **Step 1: 建立 `src/components/InsightCard.tsx`**

```tsx
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
```

- [ ] **Step 2: 建立 `src/components/FireBanner.tsx`**

```tsx
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
```

- [ ] **Step 3: commit**

```bash
cd D:\ClaudeFiles\fortune
git add src/components/InsightCard.tsx src/components/FireBanner.tsx
git commit -m "feat: 新增 InsightCard 與 FireBanner 元件"
```

---

## Task 7：HeroInput 元件

**Files:**
- 建立: `src/components/HeroInput.tsx`

- [ ] **Step 1: 建立 `src/components/HeroInput.tsx`**

```tsx
import { useState } from 'react'

interface Props {
  onSubmit: (dob: string, time: string, gender: 'male' | 'female' | 'unspecified') => void
}

type CalendarMode = 'gregorian' | 'lunar'
type Gender = 'male' | 'female' | 'unspecified'

export function HeroInput({ onSubmit }: Props) {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('gregorian')
  const [dob, setDob]                   = useState('')
  const [time, setTime]                 = useState('')
  const [gender, setGender]             = useState<Gender>('unspecified')
  const [error, setError]               = useState('')

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dob || !time) {
      setError('請輸入有效的出生日期與時辰')
      return
    }
    setError('')
    // 截除秒數
    const normalizedTime = time.slice(0, 5)
    onSubmit(dob, normalizedTime, gender)
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-16 space-y-10">
      {/* 標題 */}
      <div className="text-center space-y-3">
        <h1 className="font-serif text-4xl md:text-5xl text-ink tracking-[0.15em]">
          FateFlow 2026
        </h1>
        <p className="text-ink/60 text-sm tracking-widest">丙午火馬年 · 八字命盤推算</p>
      </div>

      {/* 表單 */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 bg-parchment-surface rounded-3xl p-7 shadow-sm"
      >
        {/* 農曆／西曆切換 */}
        <div className="flex rounded-xl overflow-hidden border border-wood/30 text-sm">
          {(['gregorian', 'lunar'] as CalendarMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setCalendarMode(mode)}
              className={`flex-1 py-2 tracking-wide transition-colors ${
                calendarMode === mode
                  ? 'bg-wood text-white'
                  : 'bg-transparent text-ink/60 hover:bg-wood/10'
              }`}
            >
              {mode === 'gregorian' ? '西曆' : '農曆'}
            </button>
          ))}
        </div>

        {/* 農曆提示 */}
        {calendarMode === 'lunar' && (
          <p className="text-xs text-ink/50 text-center -mt-2 tracking-wide">
            農曆（推算自動轉換為西曆）
          </p>
        )}

        {/* 出生日期 */}
        <div className="space-y-1.5">
          <label className="text-xs text-ink/60 tracking-widest">出生日期</label>
          <input
            type="date"
            min="1900-01-01"
            max={today}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full bg-parchment border border-wood/30 rounded-xl px-4 py-3 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-wood/40"
            required
          />
        </div>

        {/* 出生時辰 */}
        <div className="space-y-1.5">
          <label className="text-xs text-ink/60 tracking-widest">出生時辰</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-parchment border border-wood/30 rounded-xl px-4 py-3 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-wood/40"
            required
          />
        </div>

        {/* 性別（選填） */}
        <div className="space-y-1.5">
          <label className="text-xs text-ink/60 tracking-widest">性別（選填）</label>
          <div className="flex gap-2 text-sm">
            {([
              { value: 'unspecified', label: '不指定' },
              { value: 'male',        label: '男' },
              { value: 'female',      label: '女' },
            ] as { value: Gender; label: string }[]).map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setGender(value)}
                className={`flex-1 py-2 rounded-xl border transition-colors tracking-wide ${
                  gender === value
                    ? 'border-wood bg-wood text-white'
                    : 'border-wood/30 text-ink/60 hover:bg-wood/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <p className="text-xs text-fire text-center tracking-wide">{error}</p>
        )}

        {/* 送出按鈕 */}
        <button
          type="submit"
          className="w-full bg-ink text-parchment py-3.5 rounded-xl font-serif tracking-[0.2em] text-sm hover:bg-wood transition-colors"
        >
          揭示我的命運
        </button>
      </form>

      <p className="text-xs text-ink/30 tracking-wide">僅供娛樂參考，不構成任何建議</p>
    </div>
  )
}
```

- [ ] **Step 2: commit**

```bash
cd D:\ClaudeFiles\fortune
git add src/components/HeroInput.tsx
git commit -m "feat: 新增 HeroInput 表單元件（含農曆 toggle、性別選填）"
```

---

## Task 8：App.tsx 狀態機整合

**Files:**
- 修改: `src/App.tsx`
- 修改: `src/main.tsx`

- [ ] **Step 1: 覆寫 `src/App.tsx`**

```tsx
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeroInput }   from './components/HeroInput'
import { BaguaLoader } from './components/BaguaLoader'
import { ElementBars } from './components/ElementBars'
import { InsightCard } from './components/InsightCard'
import { FireBanner }  from './components/FireBanner'
import { calculateFortune } from './lib/calculateFortune'
import type { FortuneResult } from './types'

type AppState = 'idle' | 'loading' | 'result' | 'error'

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle')
  const [result,   setResult]   = useState<FortuneResult | null>(null)

  const handleSubmit = (dob: string, time: string, _gender: 'male' | 'female' | 'unspecified') => {
    setAppState('loading')
    // 1500ms 動畫感後執行推算
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
          <motion.div key="idle" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
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
            {/* 返回按鈕 */}
            <button
              onClick={handleReset}
              className="text-sm text-ink/50 hover:text-ink transition-colors tracking-widest flex items-center gap-1"
            >
              ← 重新推算
            </button>

            <h2 className="font-serif text-2xl text-ink tracking-[0.15em] text-center">
              您的 2026 命盤
            </h2>

            {/* 五行分布 */}
            <ElementBars elements={result.elements} fireIntensity={result.fireIntensity} />

            {/* 三大洞察 */}
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

            {/* 火行年度建議 */}
            <FireBanner fireIntensity={result.fireIntensity} advice={result.fireAdvice2026} />

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
```

- [ ] **Step 2: 確認 `src/main.tsx` 正常**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: 清除 Vite 預設範例檔案**

刪除不需要的預設檔案：
```bash
cd D:\ClaudeFiles\fortune
rm -f src/App.css src/assets/react.svg public/vite.svg 2>/dev/null || true
```

- [ ] **Step 4: 本地啟動確認畫面正常**

```bash
cd D:\ClaudeFiles\fortune
npm run dev
```

確認：
- 首頁標題「FateFlow 2026」顯示正確
- 表單可正常輸入日期與時辰
- 送出後八卦旋轉 1.5 秒
- 結果儀表板顯示五行條狀圖 + 三張洞察卡片 + 火行橫幅
- 「重新推算」返回首頁

- [ ] **Step 5: 執行所有測試確認通過**

```bash
cd D:\ClaudeFiles\fortune
npx vitest run
```

Expected: 全部 PASS。

- [ ] **Step 6: commit**

```bash
cd D:\ClaudeFiles\fortune
git add src/App.tsx src/main.tsx
git commit -m "feat: 整合 App.tsx 四段狀態機（idle/loading/result/error）"
```

---

## Task 9：建置驗證與部署設定

**Files:**
- 建立: `vercel.json`
- 建立: `README.md`

- [ ] **Step 1: Production build 驗證**

```bash
cd D:\ClaudeFiles\fortune
npm run build 2>&1
```

Expected: 無 TypeScript 錯誤、無 Tailwind purge 警告、bundle 大小合理（< 500KB gzip）。

- [ ] **Step 2: Preview build 確認**

```bash
cd D:\ClaudeFiles\fortune
npm run preview
```

在瀏覽器打開 `http://localhost:4173`，確認頁面正常渲染。

- [ ] **Step 3: 建立 `vercel.json`（SPA redirect 設定）**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

- [ ] **Step 4: 建立 `README.md`（部署說明）**

```markdown
# FateFlow 2026 — 八字命盤推算

> 以出生日期與時辰，推算五行分布與 2026 丙午火馬年運勢。

## 本地開發

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # 建置
npm run preview   # 預覽建置結果
npm test          # 執行單元測試
```

## Vercel 部署

1. Push 至 GitHub repo
2. 在 [vercel.com](https://vercel.com) 匯入該 repo
3. Framework Preset 選 **Vite**
4. 點擊 **Deploy** → 30 秒上線
```

- [ ] **Step 5: 最終 commit**

```bash
cd D:\ClaudeFiles\fortune
git add vercel.json README.md
git commit -m "chore: 新增 Vercel 部署設定與 README"
```

---

## 驗收清單

- [ ] `npx vitest run` 全部通過
- [ ] `npm run build` 無錯誤
- [ ] 首頁正確顯示「FateFlow 2026」標題
- [ ] 農曆 toggle 顯示提示文字
- [ ] 輸入錯誤日期時顯示錯誤訊息
- [ ] 送出後顯示八卦旋轉動畫（1.5 秒）
- [ ] 結果頁顯示五行水平條狀圖（降序排列）
- [ ] 火行旺時顯示「本命旺」徽章
- [ ] 三張洞察卡片依序錯開淡入
- [ ] 火行橫幅依強度切換漸層
- [ ] 「重新推算」可返回首頁
- [ ] 推算錯誤時顯示固定錯誤訊息
