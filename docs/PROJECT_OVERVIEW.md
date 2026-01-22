# 專案概覽: MD2PPT-Evolution

## 願景 (Vision)
MD2PPT-Evolution 是一個專為開發者與技術講者打造的生產力工具。它將「簡報即程式碼 (Presentation as Code)」的概念付諸實踐，讓使用者能對簡報內容 (Markdown) 進行版本控制，並自動產生一致且精美的 PowerPoint 簡報。

## 核心架構 (System Architecture)

專案採用現代化的前端架構 (React 19 + TypeScript + Vite)，核心分為三層：

### 1. 編輯與互動層 (Editor Layer)
- **Editor Controller**: 透過 `useEditorController` 統一管理編輯器狀態與業務邏輯，實現 UI 與數據分離。
- **Command Palette**: 基於 `kbar` 的指令中心，提供鍵盤驅動的高效操作體驗。
- **Visual Tweaker**: 雙向綁定的視覺化調整介面，支援點擊預覽區直接修改 AST 節點屬性。
- **PWA Engine**: 基於 `vite-plugin-pwa` 與 Workbox 的離線運作引擎。

### 2. 解析與轉換層 (Parser Layer)
- **Remark/Unified Pipeline**: 
    - 採用標準化的 AST (抽象語法樹) 解析流程，取代脆弱的正則表達式。
    - 支援 `remark-gfm` (表格)、`remark-frontmatter` (YAML) 與自定義指令 (`::: chart`)。
- **Slide Object Model (SOM)**: 中間層數據結構，標準化了投影片的內容、佈局、樣式與圖表數據，將解析邏輯與渲染端解耦。
- **Markdown Updater**: 具備上下文感知的源碼更新器，負責處理拖拽重排、Tweaker 回寫與屬性注入。

### 3. 渲染與輸出層 (Rendering Layer)
- **Web Preview**: 
    - 使用 React 與 Tailwind CSS 進行 1:1 的即時預覽渲染。
    - 整合 `Shiki` 進行語法高亮，`Recharts` 進行互動式圖表展示。
- **PPTX Engine**: 
    - 基於 `pptxgenjs`，將 SOM 轉換為原生的 PowerPoint 檔案。
    - **Registry Pattern**: 透過 `RendererRegistry` 動態調度 `ChartRenderer`, `TableRenderer`, `ListRenderer` 等組件，實現高度可擴充的匯出邏輯。
- **Image Export**: 整合 `html2canvas` 與 `jszip`，支援將投影片匯出為高解析度圖片包。

## 關鍵功能模組 (v0.16.1)

### 投影片管理 (Slide Management)
- **分頁機制**: 採用 `===` 作為標準分頁符號。
- **配置系統**: 採用 YAML Frontmatter (`---`) 進行單頁配置。
- **拖拽重排 (v0.14.1)**: 支援直覺的投影片順序調整，並自動同步 Markdown。

### 豐富內容 (Rich Content)
- **原生圖表 (Native Charts)**: 支援 Bar, Line, Pie, Area 等原生 PPTX 圖表物件。
- **圖片**: 支援拖放 (Drag & drop) 自動轉 Base64。
- **表格**: 預設生成具備專業樣式 (Modern Style) 的原生表格。
- **程式碼**: 支援 `Shiki` 驅動的語法高亮與深淺色模式切換。

### 視覺效果 (Visuals)
- **全域主題 (Theme Manager)**: 內建商務、科技、學術等專業主題，一鍵切換配色與字體。
- **生成式背景 (Generative Mesh)**: 支援動態生成 Mesh Gradient 背景。
- **字體客製化 (v0.15.0)**: 支援個別元素的字體大小微調與持久化儲存 (`{size=N}`)。
- **佈局系統**: 內建 Grid, Center, Quote, Alert, Two-Column 等多種響應式佈局。

### 演講與協作 (Presentation)
- **演講者模式 (v0.12+)**: 具備雙螢幕同步、備忘錄顯示與計時器。
- **P2P 手機遙控**: 利用 WebRTC 實現無伺服器的手機掃碼遙控功能。

## 未來規劃 (Roadmap)
- **v0.17.0**: 雲端同步與協作功能 (Cloud Sync)。
- **v0.18.0**: 更多生成式 AI 模型整合 (Direct LLM Integration)。