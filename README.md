# MD2PPT-EVOLUTION 🚀

![Version](https://img.shields.io/badge/version-0.7.0-orange.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

**將 Markdown 筆記瞬間轉換為專業 PowerPoint (PPTX) 的極致工具。**

> 專為開發者、技術講者與教育工作者設計。告別繁瑣的排版，專注於內容創作。

[🔴 Live Demo (Coming Soon)](#) | [📖 完整文件](CUSTOMIZATION.md) | [🐛 回報問題](../../issues)

---

## ✨ 為什麼選擇 MD2PPT?

### 1. 極致的寫作流暢度
- **所見即所得 (WYSIWYG)**: 右側預覽區提供 1:1 的 PPTX 模擬，字體大小、間距與配色完全同步。
- **快捷動作側欄**: 左側懸浮工具列讓您一鍵插入複雜的佈局與元件，無需記憶語法。
- **拖放式資產管理**: 
    - 🖼️ **插入圖片**: 直接拖入編輯器，自動轉 Base64。
    - 🎨 **設定背景**: 將圖片拖到預覽卡片上，立即設為該頁背景。

### 2. 強大的原生圖表 (Native Charts)
不再需要 Excel 截圖！直接在 Markdown 中定義數據，生成 **PowerPoint 原生可編輯圖表**。
- 支援 **長條圖 (Bar)**、**折線圖 (Line)**、**圓餅圖 (Pie)** 與 **區域圖 (Area)**。
- 點擊 PPT 中的圖表即可修改數據，保持簡報的靈活性。

### 3. 企業級排版系統
- **演講者備忘錄 (Speaker Notes)**: 支援 `<!-- note: ... -->` 語法，可在預覽中切換顯示，並同步匯出至 PPTX 備忘錄欄位。
- **分層配置 (YAML)**: 使用 `===` 分頁，並透過每頁頂部的 YAML 區塊 (`---`) 獨立控制佈局、背景與轉場。
- **專業佈局庫**: 內建 `Grid` (網格)、`Quote` (引用)、`Center` (居中)、`Alert` (告警) 等多種響應式版面。
- **現代化表格**: 自動將 Markdown 表格轉換為具備主題色與斑馬紋 (Zebra striping) 的專業表格。

### 4. 隱私優先 (Privacy First)
- **100% 用戶端運算**: 所有解析與生成皆在您的瀏覽器中完成。
- **資料不落地**: 您的筆記與圖片**絕不會**上傳至任何伺服器。

---

## ⚡ 快速上手 (Quick Start)

### 基礎語法範例

```markdown
---
title: "我的簡報"
author: "Presenter"
---

# 第一頁：標題頁
這是簡報的開場白。

===
---
layout: two-column
---

# 第二頁：雙欄佈局

### 左邊內容
- 重點 1
- 重點 2

### 右邊內容
這裡會自動分到右側欄位。

===
---
layout: center
background: "#1e293b"
transition: zoom
---

# 第三頁：轉場頁
垂直居中 + 深色背景 + 縮放特效

<!-- note: 這是演講者備忘錄，只會出現在預覽與 PPTX 備忘錄欄位。 -->
```

### 圖表語法範例

```markdown
::: chart-bar { "title": "季度營收", "showValues": true }

| 季度 | 2024 | 2025 |
| :--- | :--- | :--- |
| Q1   | 100  | 150  |
| Q2   | 120  | 180  |

:::
```

👉 **更多進階語法與 YAML 參數，請參閱 [客製化指南 (CUSTOMIZATION.md)](CUSTOMIZATION.md)。**

---

## 🤖 AI 輔助生成 (AI Assistant)

想要快速將手邊的筆記轉為簡報嗎？您可以複製以下 Prompt 給 ChatGPT、Claude 或 Gemini，讓 AI 幫您自動排版：

```text
你現在是一位專業的簡報設計師，精通「MD2PPT-Evolution」的專屬 Markdown 格式。
專案網址：https://github.com/eric861129/MD2PPT-Evolution

請將我提供的內容轉換為符合以下規範的 Markdown 簡報代碼：

### 1. 結構規範
- 使用 `===` (三個等號) 作為投影片之間的分頁符號。
- 第一頁必須包含 YAML Frontmatter，定義 `title` (標題)、`author` (作者)。
- 每一頁的頂部（`===` 之後）可以包含 YAML 區塊 `--- ... ---` 來設定該頁屬性。

### 2. YAML 配置參數
- **layout**: 支援 `default` (預設), `two-column` (雙欄), `center` (居中), `grid` (網格), `quote` (引用), `alert` (告警)。
- **background**: 設定背景色 (如 `#1e293b`)。
- **columns**: 當 `layout: grid` 時，指定欄數 (如 `2` 或 `3`)。

### 3. 特殊元件語法
- **圖表**: 使用 `::: chart-bar`, `::: chart-line`, `::: chart-pie` 包裹表格。
  範例:
  ::: chart-bar { "title": "標題", "showLegend": true }
  | 類別 | 數值 |
  | :--- | :--- |
  | A | 10 |
  :::
- **表格**: 直接使用標準 Markdown 表格即可。
- **圖片**: 使用 `![Alt Text](URL)`。

### 4. 轉換要求
- 自動為適合的內容選擇最佳 Layout（例如：對比內容用 `two-column`，數據用 `chart`，金句用 `quote`）。
- 確保所有表格都有表頭分隔線 `|---|`。
- 如果內容包含多個小點，嘗試使用 `grid` 佈局。

請將我的內容轉換為上述格式：
[在此貼上您的內容]
```

---

## 🛠️ 開發與部署

### 本地開發 (Local Development)

本專案基於 **React 19**, **TypeScript** 與 **Vite** 構建。

```bash
# 1. Clone 專案
git clone https://github.com/your-username/MD2PPT-Evolution.git

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

### 部署 (Deployment)

您可以將此專案部署至任何靜態網站託管服務 (GitHub Pages, Vercel, Netlify)。

```bash
# 建置生產版本
npm run build

# 產物將位於 dist/ 目錄
```

---

## 🗺️ 開發藍圖 (Roadmap)

- [x] **v0.5.0**: 快捷側欄、拖放圖片、YAML 配置系統。
- [x] **v0.6.0**: 原生圖表 (Native Charts) 支援。
- [x] **v0.7.0**: 演講者備忘錄 (Speaker Notes)。
- [ ] **v0.8.0**: 全域主題管理器 (Theme Manager)。

## 🤝 貢獻 (Contributing)

我們非常歡迎社群貢獻！如果您想新增佈局或修復 Bug，請查看 [CONTRIBUTING.md](CONTRIBUTING.md) (Coming Soon)。

## 📄 授權 (License)

MIT © 2026 EricHuang
