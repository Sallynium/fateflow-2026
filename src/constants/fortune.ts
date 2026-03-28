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

// 五行顯示顏色（對應 Tailwind 自訂色彩，使用完整類別名防止 purge）
export const ELEMENT_COLOR: Record<keyof ElementDistribution, string> = {
  火: 'bg-fire',
  土: 'bg-earth',
  木: 'bg-wood-el',
  水: 'bg-water',
  金: 'bg-metal',
}

// 五行固定排序優先順序（相同強度時使用）
export const ELEMENT_PRIORITY: Array<keyof ElementDistribution> = ['火','土','木','水','金']
