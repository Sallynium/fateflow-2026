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

## 技術棧

| 項目 | 技術 |
|------|------|
| 框架 | Vite + React 18 + TypeScript |
| 樣式 | Tailwind CSS 3（日式極簡配色） |
| 動畫 | Framer Motion |
| 字體 | Noto Serif TC / Noto Sans TC |
| 測試 | Vitest |
| 部署 | Vercel |

## 功能

- 八字四柱推算（年柱、月柱、日柱、時柱）
- 五行分布分析（火、土、木、水、金）
- 2026 丙午火馬年個人化建議
- 事業、財運、感情三大面向洞察
- 農曆 / 西曆切換輸入

## 免責聲明

本 App 僅供娛樂參考，不構成任何算命或投資建議。
