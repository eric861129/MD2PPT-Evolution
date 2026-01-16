# 軌跡規格：演講者備忘錄系統 (speaker_notes_20260115)

## 1. 概述 (Overview)
此軌跡旨在為 MD2PPT-Evolution 增加「演講者備忘錄 (Speaker Notes)」支援。使用者可以在 Markdown 中使用隱藏註解語法撰寫備忘錄，系統將支援在 Web 預覽中切換顯示，並在匯出時自動寫入 PowerPoint 投影片的備忘錄欄位。

## 2. 功能需求 (Functional Requirements)

### 2.1 備忘錄解析與提取
- **語法支援**：支援 `<!-- note: 備忘錄內容 -->` 語法。
- **多行支援**：解析器應能處理多行註解，例如：
  ```markdown
  <!-- note:
  第一點
  第二點
  -->
  ```
- **資料模型**：將解析出的備忘錄內容存入 `SlideData` 的 `config.note` 欄位。

### 2.2 UI 互動與預覽
- **全域切換開關**：在 `EditorHeader` (主工具列) 增加一個「顯示備忘錄」的切換按鈕 (Icon: `StickyNote`)。
- **預覽呈現**：當開關開啟時，`PreviewPane` 中每張投影片卡片的下方會出現一個專屬的備忘錄顯示區（採用琥珀色系邊框或背景）。
- **純文字渲染**：備忘錄內容僅支援純文字，不進行 Markdown 渲染，以確保與 PPTX 格式一致。

### 2.3 PPTX 匯出整合
- **原生備忘錄導出**：修改 `pptGenerator.ts`，調用 `slide.addNotes()` 將內容寫入 PPTX 檔案。
- **自動清理**：確保 `<!-- note: ... -->` 標記本身不會出現在 PPTX 的正文內容中。

## 3. 非功能需求 (Non-Functional Requirements)
- **隱私性**：備忘錄註解在一般 Markdown 渲染中應保持隱藏。
- **一致性**：預覽看到的文字內容與 PPTX 備忘錄欄位內容完全相同。

## 4. 驗收標準 (Acceptance Criteria)
- [ ] 在 Markdown 中寫入 `<!-- note: test -->`，匯出的 PPTX 備忘錄欄位應出現 `test`。
- [ ] 點擊 Header 的備忘錄圖示，預覽區應即時展開/收合所有頁面的備忘錄。
- [ ] 支援跨行備忘錄的完整提取。
- [ ] 快捷側欄增加一個「插入備忘錄」的快捷按鈕。

## 5. 超出範圍 (Out of Scope)
- 備忘錄內的 Rich Text (粗體、顏色) 渲染。
- 備忘錄內部的圖片或圖表。
