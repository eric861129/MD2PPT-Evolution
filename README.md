# MD2PPT-EVOLUTION

![Version](https://img.shields.io/badge/version-0.2.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

**MD2PPT-EVOLUTION** 是一個基於 Web 的工具，專為將 **Markdown** 直接轉換為專業的 **PowerPoint (PPTX)** 簡報而設計。

本專案衍生自 `BookPublisher_MD2Doc`，保留了強大的分割視窗編輯體驗，但將輸出引擎轉向服務那些偏好使用 Markdown 寫作，但需要以 PowerPoint 進行發表的講者、演示者與教育工作者。

## 🚀 核心功能

- **專業排版佈局**: 支援雙欄 (Two-column)、強調頁 (Impact) 與全螢幕背景 (Full-bg) 等佈局。
- **分層配置系統**: 使用 `===` 分頁，並支援在每頁頂部透過 `---` YAML 區塊進行獨立視覺設定。
- **所見即所得縮放預覽**: 獨家的動態縮放預覽系統，確保在不同視窗大小下內容皆不跑版。
- **自動圖片預處理**: 匯出時自動將 URL 圖片轉為 Base64，解決 CORS 問題並確保 PPT 相容性。
- **加強型角色對話**: 內建工程師友善的對話模式語法，生成具商務質感的對話氣泡。
- **現代商務樣式**: 預設採用純白簡潔主題與 PowerPoint 特徵橘紅色系。

## 🛠️ 技術堆疊

- **核心**: React 19, TypeScript, Vite 6
- **PPT 生成**: `pptxgenjs`
- **Markdown 解析**: `marked` (AST-based)
- **視覺控制**: 逐頁 YAML 配置支援

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

MIT © 2026 EricHuang
