import { useState, useMemo } from 'react'

interface Props {
  onSubmit: (dob: string, time: string, gender: 'male' | 'female' | 'unspecified') => void
}

type CalendarMode = 'gregorian' | 'lunar'
type Gender = 'male' | 'female' | 'unspecified'

const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const HOURS  = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00')

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function HeroInput({ onSubmit }: Props) {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('gregorian')
  const [gender, setGender]             = useState<Gender>('unspecified')
  const [error,  setError]              = useState('')

  const currentYear = new Date().getFullYear()

  const [selYear,  setSelYear]  = useState<string>('')
  const [selMonth, setSelMonth] = useState<string>('')
  const [selDay,   setSelDay]   = useState<string>('')
  const [selHour,  setSelHour]  = useState<string>('')

  const years = useMemo(
    () => Array.from({ length: currentYear - 1899 }, (_, i) => String(currentYear - i)),
    [currentYear],
  )

  const daysInMonth = useMemo(() => {
    if (!selYear || !selMonth) return 31
    return getDaysInMonth(Number(selYear), Number(selMonth))
  }, [selYear, selMonth])

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => String(i + 1)),
    [daysInMonth],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selYear || !selMonth || !selDay || !selHour) {
      setError('請完整選擇出生年月日與時辰')
      return
    }
    const dob  = `${selYear}-${String(selMonth).padStart(2,'0')}-${String(selDay).padStart(2,'0')}`
    const time = selHour
    setError('')
    onSubmit(dob, time, gender)
  }

  const selectClass = 'w-full bg-parchment border border-wood/30 rounded-xl px-3 py-3 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-wood/40 appearance-none cursor-pointer'

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

        {calendarMode === 'lunar' && (
          <p className="text-xs text-ink/50 text-center -mt-2 tracking-wide">
            農曆日期將自動轉換為西曆推算
          </p>
        )}

        {/* 年月日選擇 */}
        <div className="space-y-1.5">
          <label className="text-xs text-ink/60 tracking-widest">出生日期</label>
          <div className="grid grid-cols-3 gap-2">
            {/* 年 */}
            <div className="relative">
              <select
                value={selYear}
                onChange={(e) => { setSelYear(e.target.value); setSelDay('') }}
                className={selectClass}
              >
                <option value="">年</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 text-xs">▾</span>
            </div>
            {/* 月 */}
            <div className="relative">
              <select
                value={selMonth}
                onChange={(e) => { setSelMonth(e.target.value); setSelDay('') }}
                className={selectClass}
              >
                <option value="">月</option>
                {MONTHS.map((m, i) => <option key={i+1} value={String(i+1)}>{m}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 text-xs">▾</span>
            </div>
            {/* 日 */}
            <div className="relative">
              <select
                value={selDay}
                onChange={(e) => setSelDay(e.target.value)}
                className={selectClass}
              >
                <option value="">日</option>
                {days.map((d) => <option key={d} value={d}>{d}日</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 text-xs">▾</span>
            </div>
          </div>
        </div>

        {/* 時辰選擇 */}
        <div className="space-y-1.5">
          <label className="text-xs text-ink/60 tracking-widest">出生時辰</label>
          <div className="relative">
            <select
              value={selHour}
              onChange={(e) => setSelHour(e.target.value)}
              className={selectClass}
            >
              <option value="">選擇時辰</option>
              {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 text-xs">▾</span>
          </div>
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
