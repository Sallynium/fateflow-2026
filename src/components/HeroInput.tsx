import { useState } from 'react'

interface Props {
  onSubmit: (dob: string, time: string, gender: 'male' | 'female' | 'unspecified') => void
}

type CalendarMode = 'gregorian' | 'lunar'
type Gender = 'male' | 'female' | 'unspecified'

export function HeroInput({ onSubmit }: Props) {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('gregorian')
  const [dob,  setDob]                  = useState('')
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
              { value: 'unspecified' as Gender, label: '不指定' },
              { value: 'male'        as Gender, label: '男' },
              { value: 'female'      as Gender, label: '女' },
            ]).map(({ value, label }) => (
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
