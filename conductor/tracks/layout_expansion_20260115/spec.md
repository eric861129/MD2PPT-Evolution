# 軌跡規格：核心佈局擴展與 YAML 配置化 (core_layout_directives_expansion)

## 1. 概述 (Overview)
此軌跡旨在重構投影片的配置邏輯，從目前的指令式語法 (`::: layout`) 遷移至基於 **YAML Frontmatter** 的宣告式配置。同時，我們將增加四種新的佈局類型 (`grid`, `center`, `quote`, `alert`)，並支援投影片層級的背景與過場動畫設定。

## 2. 功能需求 (Functional Requirements)

### 2.1 YAML 配置系統
- **語法變更**：每一張投影片（以 `---` 分隔）的頂部支援選填的 YAML 區塊。
- **支援欄位**：
    - `layout`: 指定佈局類型 (`default`, `grid`, `center`, `quote`, `alert`, `split`)。
    - `background`: 支援十六進位顏色、漸層或圖片路徑。
    - `transition`: 指定投影片過場動畫（如 `fade`, `slide`, `zoom`）。
- **取代舊語法**：正式廢除 `::: layout` 指令，將其功能完全遷移至 YAML。

### 2.2 新增佈局渲染器
- **Grid (網格)**：支援彈性的內容配置，可在 YAML 中進一步定義 `columns` 或 `rows`。
- **Center (居中)**：內容在投影片中垂直且水平居中，適合標題頁或強調頁。
- **Quote (引用)**：專為大字體與引用風格設計的佈局。
- **Alert (告警)**：用於顯示警告、提示或重要資訊的強調佈局。

### 2.3 元件級指令強化
- **Table 樣式**：支援 `::: table-modern` 容器語法，用於包覆 Markdown 表格並套用現代化的 PPTX 表格樣式（如主題色標題列、交錯列背景）。

### 2.4 PPTX 引擎整合
- 更新 `services/pptx/builders`，確保上述 YAML 設定能準確對應至 `pptxgenjs` 的投影片屬性與元素定位。

## 3. 非功能需求 (Non-Functional Requirements)
- **視覺一致性**：Web 預覽區域必須 1:1 還原 YAML 定義的佈局與背景效果。
- **容錯處理**：若 YAML 語法錯誤，應回退至 `default` 佈局並提供友善的錯誤提示。

## 4. 驗收標準 (Acceptance Criteria)
- [ ] 使用者能在 YAML 中設定 `layout: grid` 並在預覽與 PPTX 中看到正確排版。
- [ ] 設定 `background: "#FF0000"` 能正確改變該張投影片的背景顏色。
- [ ] 匯出的 PPTX 檔案應包含指定的投影片過場動畫 (`transition`)。
- [ ] 被 `::: table-modern` 包覆的表格在 PPTX 中呈現專業的格線與配色。
- [ ] 原本的 `::: layout` 指令不再生效（或視為一般文字），強制引導使用 YAML。

## 5. 超出範圍 (Out of Scope)
- 多層級的過渡動畫細節設定（僅支援基礎效果）。
- 圖片的高級編輯功能（僅支援背景嵌入）。