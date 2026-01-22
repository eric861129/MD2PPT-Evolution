# 規格說明書 (spec.md) - 字體大小客製化設定 (Custom Font Sizing)

## 1. 概述 (Overview)
本功能旨在提供元素等級的字體大小控制。使用者可以直接在預覽區點擊標題、段落或列表，透過 Visual Tweaker 調整字體大小。此設定將以 `{size=48}` 標籤的形式自動附加在 Markdown 原始碼中，實現「樣式與內容同步持久化」，確保簡報在不同設備間維持一致的視覺呈現。

## 2. 功能需求 (Functional Requirements)

### 2.1 語法支援 (Markdown Syntax)
- **支援格式**：在元素內容末尾支援 `{size=N}` 標籤。
- **範例**：
    - `# 標題一 {size=80}`
    - `- 列表項目 {size=24}`
    - `這是一段文字 {size=32}`
- **解析邏輯**：利用 Remark/Unified AST 解析器提取該標籤，將數值存入 SOM 的 `metadata` 中，並在渲染時移除原始碼中的標籤字串。

### 2.2 Visual Tweaker 增強 (UI/UX)
- **新增控制項**：在 Tweaker 彈窗中新增「字體大小 (Font Size)」輸入列。
- **操作元件**：
    - **數值輸入框**：可直接輸入精確的 pt 數值。
    - **增減按鈕 (+/-)**：位於輸入框右側，點擊一次增減 2pt。
- **即時預覽**：調整數值時，右側預覽畫面需即時反映字體大小變化。

### 2.3 內容回寫邏輯 (Markdown Update)
- **智慧更新**：
    - 若原始碼已有 `{size=N}`，則直接替換數值。
    - 若無，則在該元素末尾自動追加空間與標籤。
- **精確定位**：利用 AST 提供的 `endIndex` 確保標籤精確插入。

### 2.4 多端渲染一致性
- **Web 預覽**：透過 CSS `font-size` 動態套用。
- **PPTX 匯出**：在 `pptxgenjs` 渲染邏輯中，將 `metadata.size` 轉換為原生 PPT 磅值 (Points)。

## 3. 技術規格 (Technical Specifications)
- **解析器**：擴展 `services/parser/ast.ts` 的映射邏輯，使用 Regex 匹配內容末尾的屬性標籤。
- **更新器**：在 `services/markdownUpdater.ts` 實作屬性標籤的增刪改邏輯。

## 4. 驗收標準 (Acceptance Criteria)
1. 點擊預覽區標題，調大字體後，Markdown 原始碼對應位置出現正確的 `{size=...}`。
2. 手動在 Markdown 輸入 `{size=100}`，預覽區文字立即變大。
3. 包含字體標籤的檔案，匯出為 PPTX 後，PowerPoint 中的字體大小應與設定值一致。
4. 調整列表項目字體，不應影響同頁的其他段落。

## 5. 超出範圍 (Out of Scope)
- 字體顏色或字體名稱的個別設定（由主題與品牌系統統一管理）。
- 全語法的 CSS 類別支援（本階段僅限 size）。
