import { motion } from 'framer-motion'

const DOTS = [0, 0.2, 0.4]

// 八卦八個卦象，各對應五行色彩（Tailwind 自訂色彩的 hex 值）
const GUA_SEGMENTS = [
  { color: '#D4521A', label: '離' },  // 火
  { color: '#D4521A', label: '巽' },  // 木/火
  { color: '#4A7C59', label: '震' },  // 木
  { color: '#3A7CA5', label: '坎' },  // 水
  { color: '#3A7CA5', label: '艮' },  // 土/水
  { color: '#B8860B', label: '坤' },  // 土
  { color: '#7A7A7A', label: '兌' },  // 金
  { color: '#7A7A7A', label: '乾' },  // 金
]

export function BaguaLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* 八卦旋轉圓環 */}
      <div className="relative w-48 h-48">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
        >
          {GUA_SEGMENTS.map((gua, i) => {
            const startAngle = (i * 45 - 90) * (Math.PI / 180)
            const endAngle   = ((i + 1) * 45 - 90) * (Math.PI / 180)
            const r = 85
            const cx = 100
            const cy = 100
            const x1 = cx + r * Math.cos(startAngle)
            const y1 = cy + r * Math.sin(startAngle)
            const x2 = cx + r * Math.cos(endAngle)
            const y2 = cy + r * Math.sin(endAngle)
            return (
              <path
                key={i}
                d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                fill={gua.color}
                opacity={0.75}
                stroke="#F5F0E8"
                strokeWidth={2}
              />
            )
          })}
          {/* 中心遮罩 */}
          <circle cx="100" cy="100" r="55" fill="#F5F0E8" />
        </motion.svg>

        {/* 靜止陰陽符號 */}
        <div className="absolute inset-0 flex items-center justify-center text-5xl select-none pointer-events-none">
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
