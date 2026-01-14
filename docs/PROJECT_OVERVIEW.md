# 專案概覽: MD2PPT-Evolution

## 願景 (Vision)
MD2PPT 是一個專為開發者與技術講者打造的生產力工具。它將「簡報即程式碼 (Presentation as Code)」的概念付諸實踐，讓使用者能對簡報內容 (Markdown) 進行版本控制，並自動產生一致且精美的樣式。

## 核心能力 (已實作與規劃中)

### 1. 投影片管理 (Slide Management)
- **投影片分割**:
    - `---` (水平分隔線) 作為投影片換頁符號。
    - `h1` / `h2` 可設定自動觸發新投影片 (可配置)。
- **版面配置 (Layouts)**: 透過 Markdown frontmatter 或特殊語法支援「標題投影片 (Title Slide)」、「內容投影片 (Content Slide)」、「雙欄 (Two Column)」與「大數字 (Big Number)」等版面。

### 2. 豐富內容 (Rich Content)
- **圖片**: 支援拖放 (Drag & drop)，並自動縮放以適應投影片邊界。
- **程式碼區塊**: 轉換為原生的 PowerPoint 文字方塊，包含等寬字體與背景著色。
- **表格**: 轉換為原生的 PowerPoint 表格。

### 3. 視覺效果 (Visuals)
- **Mermaid 圖表**: 在投影片上渲染為高解析度圖片。
- **原生圖表 (Native Charts)**: 指定格式的 Markdown 表格可標記為渲染成 PPT 圖表（長條圖、折線圖、圓餅圖）。

## 架構 (Architecture)
- **前端**: 單頁應用程式 (SPA)。
- **引擎**: `services/pptGenerator.ts` 負責協調解析 (AST) 到 PPTX 物件的映射。
- **註冊表**: `services/ppt/registry.ts` (待實作) 將 Markdown token 映射到 Slide Builders。
