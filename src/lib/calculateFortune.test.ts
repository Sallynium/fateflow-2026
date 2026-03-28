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
