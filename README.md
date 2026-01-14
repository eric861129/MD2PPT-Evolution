# MD2PPT-EVOLUTION

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

**MD2PPT-EVOLUTION** 是一個基於 Web 的工具，專為將 **Markdown** 直接轉換為專業的 **PowerPoint (PPTX)** 簡報而設計。

本專案衍生自 `BookPublisher_MD2Doc`，保留了強大的分割視窗編輯體驗，但將輸出引擎轉向服務那些偏好使用 Markdown 寫作，但需要以 PowerPoint 進行發表的講者、演示者與教育工作者。

## 🚀 核心功能

- **Markdown 轉投影片**: 根據標題或分隔線自動將內容分割為多張投影片。
- **原生圖表 (Native Charts)**: 將 Markdown 表格轉換為可編輯的 PowerPoint 圖表（不僅僅是圖片！）。
- **語法高亮**: 在輸出的投影片中保留程式碼區塊的樣式與顏色。
- **現代主題**: 內建深色/霓虹 (Dark/Neon) 主題，適合高衝擊力的簡報演示。
- **隱私優先**: 所有處理皆在您的瀏覽器中進行。沒有任何資料會被傳送到伺服器。

## 🛠️ 技術堆疊

- **核心**: React 19, TypeScript, Vite 6
- **PPT 生成**: `pptxgenjs`
- **Markdown 解析**: `marked`
- **圖表**: `mermaid` (渲染) / Native PPT Charts (匯出)

## 📦 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

## 🤝 參與貢獻

我們歡迎任何形式的貢獻！請查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解更多指南。

## 📄 授權條款

MIT © EricHuang