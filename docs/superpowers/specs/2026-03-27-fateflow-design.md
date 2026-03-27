# FateFlow 2026 — 設計規格文件

**日期**：2026-03-27
**版本**：1.3
**狀態**：修訂後待最終審核

---

## 概覽

FateFlow 2026 是一個以八字五行為基礎的命理 Web App，讓使用者輸入出生日期與時辰，即可獲得針對 2026 丙午火馬年的個人化命理分析。

---

## 技術棧

| 項目 | 選擇 |
|------|------|
| 框架 | Vite + React 18 + TypeScript |
| 樣式 | Tailwind CSS（自訂色彩 token） |
| 動畫 | Framer Motion（僅 import 用到的元件，依賴 Vite tree-shaking） |
| 字體 | Noto Serif TC / Noto Sans TC（Google Fonts，`display=swap`，`preconnect` 預載） |
| 部署 | Vercel（免費 Hobby 方案） |
| 農曆支援 | 前端切換 UI；計算層統一使用西曆（無農曆換算函式庫） |

---

## 檔案結構

```
fortune/
├── src/
│   ├── lib/
│   │   └── calculateFortune.ts   ← 核心推算邏輯
│   ├── constants/
│   │   └── fortune.ts            ← 天干地支對照表、文案字串
│   ├── types.ts                  ← FortuneResult 等共用型別
│   ├── components/
│   │   ├── HeroInput.tsx
│   │   ├── BaguaLoader.tsx
│   │   ├── ElementBars.tsx
│   │   ├── InsightCard.tsx
│   │   └── FireBanner.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## 應用狀態機

`App.tsx` 使用 `useState<'idle' | 'loading' | 'result' | 'error'>` 管理四段狀態：

```
idle（首頁輸入）
  ↓ 使用者按下「揭示我的命運」（通過前端驗證）
loading（八卦動畫，setTimeout 1500ms 模擬推算感）
  ↓ calculateFortune() 成功執行
result（儀表板顯示）
  ↓ 使用者按下「重新推算」
idle

loading / result
  ↓ calculateFortune() 拋出例外
error（顯示固定錯誤訊息「推算時發生錯誤，請確認出生日期與時辰後重試。」+ 「返回重試」按鈕 → idle；不對外顯示 calculateFortune 的原始 Error.message）
```

---

## 型別定義（`src/types.ts`）

```typescript
export type FireIntensity = 'low' | 'medium' | 'high' | 'extreme'

export interface ElementDistribution {
  火: number  // 0–100，各行強度百分比，五行總和 = 100
  土: number
  木: number
  水: number
  金: number
}

export interface InsightResult {
  score: number   // 0–10，已 clamp
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

---

## 核心推算邏輯：`calculateFortune`

### 函式簽名

```typescript
function calculateFortune(dob: string, time: string): FortuneResult
// 拋出 Error（含訊息字串）當輸入無效
```

**參數：**
- `dob`：ISO 日期字串，格式 `"YYYY-MM-DD"`，有效範圍 `1900-01-01` 至今（不含未來日期）
- `time`：時間字串，格式 `"HH:MM"` 或 `"HH:MM:SS"`（秒數自動截除），有效範圍 `"00:00"` – `"23:59"`

**輸入驗證（任一失敗則拋出 `Error`）：**
1. `dob` 必須為合法日期（`new Date(dob)` 不為 `Invalid Date`）
2. `dob` 必須在 `1900-01-01` 至今（含今日）之間
3. `time` 必須符合 `HH:MM` 格式，且 HH ∈ 00–23，MM ∈ 00–59
4. 2月29日僅在閏年有效（`new Date(dob)` 自動處理，無需額外邏輯）

---

### 四柱推算規則（簡化版）

本 App 採用**簡化八字法**，明確犧牲以下精準度換取實作可行性：

| 規則 | 標準八字 | 本 App 簡化 |
|------|---------|------------|
| 月柱換月 | 以節氣日（Solar Term）為界 | 以西曆月份直接對應 |
| 子時跨日 | 23:00–01:00 屬次日 | 不實作；時柱依當日時辰計算 |

**年柱天干**：`(出生年 - 4) % 10` → 對應天干表
**年柱地支**：`(出生年 - 4) % 12` → 對應地支表
**月柱天干**：依年柱天干與月份推算（五虎遁年法，見下表）
**月柱地支**：月份 1–12 對應固定地支（寅→卯→辰→...）
**日柱**：Julian Day Number 公式推算（見下方公式）
**時柱地支**：時辰對應（見下方完整對照表）
**時柱天干**：依日柱天干與時辰推算（五鼠遁日法，見下表）

---

#### 月柱天干：五虎遁年法

月天干起始索引（0 = 甲）依年天干決定：

| 年天干 | 甲/己 | 乙/庚 | 丙/辛 | 丁/壬 | 戊/癸 |
|--------|-------|-------|-------|-------|-------|
| 寅月（1月）天干起始 | 丙（2） | 戊（4） | 庚（6） | 壬（8） | 甲（0） |

月天干 = `(起始索引 + 月份 - 1) % 10` → 天干陣列

```typescript
// 天干陣列順序
const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
// 月柱地支順序（月份 1–12 對應索引 2–13 mod 12）
const MONTH_BRANCHES = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑']
// monthBranch = MONTH_BRANCHES[month - 1]
```

---

#### 日柱推算：Julian Day Number（整數公式）

使用儒略日（JDN）對應日干支，有效範圍 1900 年後：

```typescript
function getJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return day
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045
}

// 日天干索引 = (JDN + 9) % 10  → STEMS[index]
// 日地支索引 = (JDN + 1) % 12  → BRANCHES[index]
// BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
```

此為 Gregorian Proleptic 公式，1900 年後精確無誤。

---

#### 時柱地支：完整 12 時辰對照表

每個時辰均為 2 小時等寬窗格（簡化版，子時跨日規則已明確排除在外）：

| index | 時辰 | 地支 | 時間範圍（含起，不含終） |
|-------|------|------|------------------------|
| 0  | 子時 | 子 | 00:00 – 02:00 |
| 1  | 丑時 | 丑 | 02:00 – 04:00 |
| 2  | 寅時 | 寅 | 04:00 – 06:00 |
| 3  | 卯時 | 卯 | 06:00 – 08:00 |
| 4  | 辰時 | 辰 | 08:00 – 10:00 |
| 5  | 巳時 | 巳 | 10:00 – 12:00 |
| 6  | 午時 | 午 | 12:00 – 14:00 |
| 7  | 未時 | 未 | 14:00 – 16:00 |
| 8  | 申時 | 申 | 16:00 – 18:00 |
| 9  | 酉時 | 酉 | 18:00 – 20:00 |
| 10 | 戌時 | 戌 | 20:00 – 22:00 |
| 11 | 亥時 | 亥 | 22:00 – 24:00 |

```typescript
// hourBranchIndex = Math.floor(hour / 2)
// 適用 hour 0–23，無需特殊處理
```

---

#### 時柱天干：五鼠遁日法

時天干起始索引依日天干決定：

| 日天干 | 甲/己 | 乙/庚 | 丙/辛 | 丁/壬 | 戊/癸 |
|--------|-------|-------|-------|-------|-------|
| 子時天干 | 甲（0） | 丙（2） | 戊（4） | 庚（6） | 壬（8） |

時天干 = `(子時起始索引 + 時辰地支索引) % 10` → STEMS[index]

---

### 天干地支五行對應表（`src/constants/fortune.ts`）

```typescript
// 天干（10 個）→ 五行
export const STEM_ELEMENT: Record<string, keyof ElementDistribution> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
}

// 地支（12 個）→ 主五行
export const BRANCH_ELEMENT: Record<string, keyof ElementDistribution> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
}

// 各柱天干地支權重（天干 0.6，地支 0.4）
export const STEM_WEIGHT   = 0.6
export const BRANCH_WEIGHT = 0.4
```

**加權累計方式：**
1. 四柱各取天干（權重 0.6）+ 地支（權重 0.4），共 8 個加權分數
2. 按五行分類累加，得出各行原始分
3. 正規化：各行 / 原始總和 × 100（總和為零時拋出 Error；此情況在有效輸入下理論上不會發生，保留此防禦性保護）

---

### 洞察分數計算

元素值為 0–100 的百分比，計算前先除以 100 轉為 0–1：

```
e = elements（各行 ÷ 100）

career_raw = e.火 × 5.0 + e.木 × 3.0 + 2.0  （基礎分 2.0）
wealth_raw = e.土 × 6.0 + e.金 × 2.0 + 2.0
love_raw   = e.火 × 4.0 + e.水 × 3.0 + 2.0

score = Math.min(10, Math.max(0, raw))  // 強制 clamp 至 0–10
```

---

### 火行強度分級

```
火行值（0–100）：
  extreme : 火 >= 80
  high    : 60 <= 火 < 80
  medium  : 40 <= 火 < 60
  low     : 火 < 40
```

---

### 文案常數（`src/constants/fortune.ts`）

#### `fireAdvice2026`（依 `fireIntensity`）

```typescript
export const FIRE_ADVICE_2026: Record<FireIntensity, string> = {
  extreme: '您的火行（≥80%）與丙午流年形成極旺共鳴，能量充沛卻易失控。2026 請將熱情聚焦於單一目標，避免多線並進。秋季後宜放慢節奏，以水行（多喝水、近水居所）調節。',
  high:    '火行旺盛（60–79%），加上流年火馬助力，衝勁十足。事業上適合主動出擊，但需留意人際間的急躁言辭。夏季前後是全年能量高峰，重要決策宜在此時落定。',
  medium:  '火行平衡（40–59%），流年火氣適度補充，整體運勢穩中帶升。2026 適合在既有基礎上推進計畫，不必大幅冒險，穩定行動即能有所收穫。',
  low:     '您的火行偏弱（<40%），流年丙午雖帶來外部機遇，但內在動能需要刻意培養。建議主動增加社交、參與具挑戰性的專案，借外部火氣激活自身潛能。',
}
```

#### 事業建議（依 `fireIntensity`）

```typescript
export const CAREER_ADVICE: Record<FireIntensity, string> = {
  extreme: '火行旺盛，衝勁十足。2026 適合主動出擊、拓展領導職位或創業。第三季需防過度擴張，保留後勁。',
  high:    '事業運強勁，適合承擔新責任。注意避免因急躁而略過細節，穩健推進比急速衝刺更持久。',
  medium:  '事業發展平穩，適合深耕專業、建立長期信任。今年播下的種子，明年可見豐收。',
  low:     '事業運需主動開創。尋找能激發您熱情的機會，借助外部資源補足動力，貴人在社交場合中出現。',
}
```

#### 財運建議（依 `fireIntensity`）

```typescript
export const WEALTH_ADVICE: Record<FireIntensity, string> = {
  extreme: '火旺易生衝動消費，宜設立「冷靜 24 小時」原則再做大額決策。土行穩健，長線投資優於短線操作。',
  high:    '土行扶持，適合穩健積累。火旺帶來機遇，但需謹慎評估風險。二月、八月財運最旺。',
  medium:  '財運平穩，適合規律儲蓄與分散投資。今年避免大幅度資產調整，守成即是獲利。',
  low:     '金行稍弱，宜加強財務規劃。尋求專業建議，建立緊急預備金後再考慮投資機會。',
}
```

#### 感情建議（依 `fireIntensity`）

```typescript
export const LOVE_ADVICE: Record<FireIntensity, string> = {
  extreme: '火馬年情緣極旺，感情濃烈。舊緣可能突然升溫。注意激情過後的溝通品質，避免因衝動言語傷及感情。',
  high:    '火馬年情緣旺盛，感情升溫。舊緣加深，單身者春季易逢貴緣，緣分自然而至。',
  medium:  '感情運穩定，適合深化既有關係。單身者宜主動擴大社交圈，緣分在熟悉環境中萌發。',
  low:     '感情需要主動耕耘。水行為您帶來細膩感知，用真誠傾聽代替言辭，感情自然升溫。',
}
```

---

## UI 元件規格

### 色彩系統（Tailwind 自訂 token）

```typescript
// tailwind.config.ts
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
}
```

### 元件動畫規格（Framer Motion，單位：秒）

| 元件 | 動畫規格 |
|------|---------|
| `BaguaLoader` 旋轉 | `rotate: [0, 360]`，`duration: 4s`，`ease: 'linear'`，`repeat: Infinity` |
| `BaguaLoader` 三點 | `opacity: [1, 0.3, 1]`，`duration: 0.8s`，`repeat: Infinity`，三點 `delay` 依序 `0s / 0.2s / 0.4s` |
| `ElementBars` | 各行：`width: '0%' → 'N%'`，`duration: 0.8s`，`delay: i × 0.1s` |
| `InsightCard` | `opacity: 0, y: 20 → opacity: 1, y: 0`，`duration: 0.5s`，`delay: i × 0.15s` |
| `FireBanner` | 同 InsightCard，`delay: 0.6s` |
| 頁面切換 | `AnimatePresence`；`idle→loading`：fadeOut；`loading→result`：fadeIn + slideUp（y: 20 → 0） |

### 各元件職責與 Props

**`HeroInput`**
- Props：`onSubmit: (dob: string, time: string, gender: 'male' | 'female' | 'unspecified') => void`
- 農曆／西曆 toggle：切換後僅改變標籤文字為「農曆（推算自動轉換為西曆）」，輸入欄位不變
- `<input type="date" min="1900-01-01" max={today}>`，其中 `today` 在元件 render 時動態計算（`new Date().toISOString().split('T')[0]`），確保長時間停留的頁面仍使用正確日期
- `<input type="time">`（秒數由呼叫端截除後傳入 `calculateFortune`）
- 性別選填（`'male' | 'female' | 'unspecified'`）：傳入 `onSubmit`，目前版本不影響計算，`App.tsx` 接收後保留備用，預留給未來文案個人化使用
- 送出前執行前端驗證（日期非空、格式正確），失敗時在欄位下方顯示固定錯誤提示：「請輸入有效的出生日期與時辰」

**`BaguaLoader`**
- SVG 八卦圓環，八卦各以對應五行色彩繪製，陰陽符號居中靜止
- 文字：「天機推算中⋯⋯」+ 副文字「正在推算您的 2026 八字命盤」
- 三點跳動動畫（opacity pulse）

**`ElementBars`**
- Props：`elements: ElementDistribution`，`fireIntensity: FireIntensity`
- 五行依強度降序排列；相同強度時以固定優先順序排序：火 > 土 > 木 > 水 > 金（確保穩定渲染順序）
- `fireIntensity` 為 `high` 或 `extreme` 時，火行旁顯示「本命旺」徽章
- 底部顯示丙午年流年提示文字（固定文案）

**`InsightCard`**
- Props：`title: string`、`icon: string`（emoji 字串）、`score: number`、`advice: string`、`barColor: 'bg-accent' | 'bg-earth' | 'bg-fire'`
- `barColor` 使用完整 Tailwind 類別名（非動態拼接），合法值已加入 `tailwind.config.ts` 的 `safelist`（見下方）

**`tailwind.config.ts` safelist（防止 production build purge 動態色彩類別）：**
```typescript
safelist: [
  // InsightCard barColor
  'bg-accent', 'bg-earth', 'bg-fire',
  // ElementBars 五行條狀顏色
  'bg-wood-el', 'bg-water', 'bg-metal',
]
```
- 顯示：icon + 標題 + 分數（`score.toFixed(1)` / 10，固定一位小數）+ 建議文字 + 底部細進度條

**`FireBanner`**
- Props：`fireIntensity: FireIntensity`，`advice: string`
- 依 `fireIntensity` 切換背景漸層深淺（extreme 最深，low 最淺）

**返回按鈕（位於 `App.tsx` result 畫面頂部）**
- 文字：「重新推算」
- 點擊後：清除結果，狀態切換回 `idle`

---

## 視覺設計原則

- **日式極簡**：大量留白，避免視覺過載
- **字體層級**：標題用 Noto Serif TC（明體），內文用 Noto Sans TC（黑體）
- **色彩克制**：主調為米色系，僅五行相關元素使用對應色彩
- **動畫哲學**：沉穩輔助感知，不搶主角
- **字體載入**：`index.html` 加入 `<link rel="preconnect">` 及 `font-display: swap`

---

## 部署說明（GitHub README 用）

```bash
# 安裝依賴
npm install

# 本地開發
npm run dev

# 建置
npm run build

# 預覽建置結果
npm run preview
```

**Vercel 部署步驟：**
1. Push 至 GitHub repo
2. 在 Vercel 匯入該 repo
3. Framework Preset 選 `Vite`
4. 點擊 Deploy，30 秒上線

---

## 不在範圍內（Out of Scope）

- 後端 API / 資料庫
- 使用者帳號與歷史記錄
- 分享功能
- 農曆換算函式庫（UI 預留，邏輯留待後續版本）
- 節氣精確換月邏輯（本版本以西曆月份直接對應，明確接受此簡化）
- 子時跨日規則（本版本不實作）
- 無障礙（a11y）WCAG 合規（留待後續版本驗證色彩對比度）
- 行動裝置日期選擇器 polyfill（接受 `input[type=date]` 原生行為差異）
