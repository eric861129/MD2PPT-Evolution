# 專案概覽: MD2PPT-Evolution

## 願景 (Vision)
MD2PPT-Evolution 是一個專為開發者與技術講者打造的生產力工具。它將「簡報即程式碼 (Presentation as Code)」的概念付諸實踐，讓使用者能對簡報內容 (Markdown) 進行版本控制，並自動產生一致且精美的 PowerPoint 簡報。

## 核心架構 (System Architecture)

專案採用現代化的前端架構，核心分為三層：

### 1. 編輯與互動層 (Editor Layer)
- **Editor Action Service**: 負責處理使用者的編輯操作（如插入模板、格式化文字）。
- **Quick Action Sidebar**: 提供視覺化的快捷操作介面，降低 Markdown 語法記憶負擔。
- **Markdown Updater**: 智慧解析與更新 Markdown 內容，支援拖放圖片時自動修改 YAML 配置。

### 2. 解析與轉換層 (Parser Layer)
- **Markdown Parser**: 基於 `marked`，將 Markdown 文本轉換為 AST (抽象語法樹)。
- **Chart Parser**: 專用的 AST 後處理器，將 `::: chart-*` 容器轉換為結構化的圖表數據物件。
- **YAML Parser**: 基於 `js-yaml`，解析每張投影片的 Frontmatter 配置 (Layout, Background)。
- **Slide Object Model (SOM)**: 中間層數據結構，標準化了投影片的內容、配置與圖表數據。

### 3. 渲染與輸出層 (Rendering Layer)
- **Web Preview**: 
    - 使用 React 與 Tailwind CSS 進行 1:1 的即時預覽渲染。
    - 整合 `Recharts` 進行互動式圖表預覽。
- **PPTX Engine**: 
    - 基於 `pptxgenjs`，將 SOM 轉換為原生的 PowerPoint 檔案。
    - **Builder Pattern**: 透過 `RendererRegistry` 動態調度 `ChartRenderer`, `TableRenderer`, `ListRenderer` 等組件，實現高度可擴充的匯出邏輯。

## 關鍵功能模組 (v0.6.0)

### 投影片管理 (Slide Management)
- **分頁機制**: 採用 `===` 作為標準分頁符號。
- **配置系統**: 採用 YAML Frontmatter (`---`) 進行單頁配置。

### 豐富內容 (Rich Content)
- **原生圖表 (Native Charts)**: 支援 Bar, Line, Pie, Area 等原生 PPTX 圖表物件。
- **圖片**: 支援拖放 (Drag & drop) 自動轉 Base64。
- **表格**: 預設生成具備專業樣式 (Modern Style) 的原生表格。
- **程式碼**: 支援語法高亮。

### 視覺效果 (Visuals)
- **佈局系統**: 內建 Grid, Center, Quote, Alert 等多種響應式佈局。
- **過場動畫**: 支援 Fade, Slide, Zoom 等切換效果。
- **演講者模式與 P2P 遙控 (v0.12+)**: 具備雙螢幕同步、手機 QR Code 掃描即連的無線控制能力。
- **對比感知引擎 (v0.12.5)**: 自動調整文字與背景的對比度，解決白底白字問題。

## 未來規劃 (Roadmap)
- **v0.7.0**: 演講者備忘錄 (Speaker Notes)。
- **v0.8.0**: 全域主題管理器 (Theme Manager)。
