# MD2PPT-Evolution 🚀

[English](README_EN.md) | [繁體中文](README.md)

**將 Markdown 筆記轉化為專業 PowerPoint 簡報的終極工具。**

<!-- Social & Status -->
[![GitHub stars](https://img.shields.io/github/stars/eric861129/MD2PPT-Evolution?style=social)](https://github.com/eric861129/MD2PPT-Evolution/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/eric861129/MD2PPT-Evolution?style=social)](https://github.com/eric861129/MD2PPT-Evolution/network/members)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/github/actions/workflow/status/eric861129/MD2PPT-Evolution/deploy.yml)

<!-- Tech Stack -->
![React](https://img.shields.io/badge/React-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)

<!-- 建議：在此處插入一個 10秒左右的操作演示 GIF，能大幅提升轉換率 -->
<!-- ![Demo GIF](https://your-demo-url.com/demo.gif) -->

**MD2PPT-Evolution** 是一個基於 Web 的簡報製作工具，專為開發者、講師與技術寫作者設計。它讓您專注於內容創作（Markdown），並自動處理排版設計（PPTX）。無需安裝任何軟體，打開瀏覽器即可開始創作。

---

## ✨ 核心功能 (Key Features)

*   **⚡ 即時預覽 & 編輯**: 雙欄式介面，左側編寫 Markdown 代碼，右側即時渲染最終效果。
*   **🎨 全域主題系統**: 內建 多款專業級主題（商務/科技/學術/現代），支援深色模式與自定義品牌色。
*   **🧠 智慧指令中心**: 按下 `Ctrl + K` 喚起命令面板，快速搜尋投影片、切換佈局或匯出檔案。
*   **📊 原生圖表轉換**: 將簡單的 Markdown 表格直接轉化為 PowerPoint 可編輯的圖表 (Bar/Line/Pie/Area)。
*   **🖥️ 專業演講模式**: 內建雙螢幕投影視窗、演講者備忘錄、計時器，以及 **P2P 手機遙控器**。
*   **📱 PWA 離線支援**: 支援安裝為桌面應用程式，在飛機上或無網路環境也能流暢使用。
*   **🧩 豐富佈局庫**: 提供網格 (Grid)、雙欄 (Two-Column)、引用 (Quote)、告警 (Alert) 等多種響應式版型。
*   **🤖 AI 輔助生成**: 內建針對 ChatGPT/Gemini 優化的 Prompt，讓 AI 幫您自動生成整份簡報代碼。

### 🔒 隱私優先 (Privacy First)
*   **100% 用戶端運算**: 所有解析與生成皆在您的瀏覽器中完成。
*   **資料不落地**: 您的筆記與圖片**絕不會**上傳至任何伺服器。

---

## 🚀 快速上手 (Quick Start)

### 線上體驗
[點此立即試用 Demo](https://eric861129.github.io/MD2PPT-Evolution/) 

### 基礎語法範例

```markdown
---
title: "我的簡報"
theme: academic
---

# 第一頁：標題頁
這是簡報的開場白。

===

---
layout: two-column
---

## 左側重點
- 重點 A
- 重點 B

:: right ::

## 右側圖表

::: chart-pie { "title": "市場佔比" }
| 產品 | 數值 |
| :--- | :--- |
| A    | 60   |
| B    | 40   |
:::
```

---

## 🛠️ 安裝與開發 (Installation)

如果您希望在本地端運行或參與開發：

1.  **Clone 專案**
    ```bash
    git clone https://github.com/eric861129/MD2PPT-Evolution.git
    cd MD2PPT-Evolution
    ```

2.  **安裝依賴**
    ```bash
    npm install
    ```

3.  **啟動開發伺服器**
    ```bash
    npm run dev
    ```
    瀏覽器將自動開啟 `http://localhost:3000`。

---

## 📚 詳細文件 (Documentation)

*   [**使用者手冊 & 客製化指南 (CUSTOMIZATION.md)**](CUSTOMIZATION.md)
    *   學習 YAML 配置參數
    *   掌握所有佈局 (Layouts) 的用法
    *   圖表與進階元件語法
*   [**AI 生成指南 (AI Guide)**](docs/AI_GENERATION_GUIDE.md)
    *   如何讓 ChatGPT/Claude 幫你寫出完美的 MD2PPT 代碼
*   [**API 參考 (English)**](docs/API_REFERENCE.md)
    *   開發者與進階使用者的技術參考

---

## 🤝 貢獻 (Contributing)

我們非常歡迎社群貢獻！如果您想新增佈局或修復 Bug，請查看 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📄 授權 (License)

MIT © 2026 EricHuang
