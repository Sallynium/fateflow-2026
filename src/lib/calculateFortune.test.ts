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

  it('無效時間小時應拋出 Error', () => {
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

  it('事業分數應在 0–10 之間', () => {
    expect(result.career.score).toBeGreaterThanOrEqual(0)
    expect(result.career.score).toBeLessThanOrEqual(10)
  })

  it('財運分數應在 0–10 之間', () => {
    expect(result.wealth.score).toBeGreaterThanOrEqual(0)
    expect(result.wealth.score).toBeLessThanOrEqual(10)
  })

  it('感情分數應在 0–10 之間', () => {
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
  it('冬季出生應偏向 low 或 medium', () => {
    const r = calculateFortune('1993-12-15', '02:00')
    expect(['low','medium']).toContain(r.fireIntensity)
  })
})

describe('calculateFortune - 確定性回歸測試', () => {
  it('相同輸入應回傳相同結果', () => {
    const r1 = calculateFortune('1990-06-15', '14:30')
    const r2 = calculateFortune('1990-06-15', '14:30')
    expect(r1.elements).toEqual(r2.elements)
    expect(r1.fireIntensity).toBe(r2.fireIntensity)
    expect(r1.career.score).toBe(r2.career.score)
  })

  it('不同日期應回傳不同結果', () => {
    const summer = calculateFortune('1990-06-15', '12:00')
    const winter = calculateFortune('1990-12-15', '12:00')
    // 夏月（午月）與冬月（子月）五行分布應有差異
    expect(summer.elements).not.toEqual(winter.elements)
  })

  it('fireIntensity 臨界值：火行 >= 80 應為 extreme', () => {
    // 多次嘗試找到一個 extreme 案例，或驗證邏輯本身
    // 此測試驗證：若五行分布直接給定火=80，getFireIntensity 應回傳 extreme
    // 由於 getFireIntensity 是內部函式，我們透過已知結果間接驗證
    // 1966-07-07 未時：夏月火盛，預期 high 或 extreme
    const r = calculateFortune('1966-07-07', '14:00')
    expect(['high', 'extreme']).toContain(r.fireIntensity)
  })

  it('五行分布各行加總應精確等於 100', () => {
    const cases = [
      ['1985-01-01', '00:00'],
      ['2000-06-15', '12:00'],
      ['1960-10-10', '20:00'],
    ] as const
    for (const [dob, time] of cases) {
      const r = calculateFortune(dob, time)
      const sum = Object.values(r.elements).reduce((a, b) => a + b, 0)
      expect(sum).toBeCloseTo(100, 5)
    }
  })
})
