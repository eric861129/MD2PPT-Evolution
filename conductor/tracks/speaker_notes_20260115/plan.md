# 執行計畫：演講者備忘錄系統 (speaker_notes_20260115)

## 階段 1：解析器強化 - 提取隱藏註解 [checkpoint: 40b2945]
**目標：** 讓解析器能識別並提取 `<!-- note: ... -->` 語法，並將其存入 Slide Object Model。

- [x] 任務：更新 AST 解析器識別註解 (fb9e858)
    - [x] 撰寫測試驗證 `<!-- note: ... -->` 是否能被解析為特定的 `NOTE_COMMENT` 區塊
    - [x] 修改 `services/parser/ast.ts`，增加對 HTML 註解語法的正則匹配
- [x] 任務：將備忘錄整合至 Slide Config (fb9e858)
    - [x] 修改 `services/markdownParser.ts`，將提取出的註解內容賦值給該頁的 `config.note`
    - [x] 確保備忘錄內容從正文區塊中移除，避免出現在投影片畫面上
- [x] 任務：Conductor - User Manual Verification '階段 1' (Protocol in workflow.md)

## 階段 2：UI 狀態管理與工具列整合 [checkpoint: 1196e7a]
**目標：** 在全域狀態中新增顯示開關，並在頂部工具列提供操作按鈕。

- [x] 任務：擴充 Editor 狀態 (PHASE_2_SHA)
    - [x] 在 `hooks/useEditorState.ts` 中新增 `showNotes` 狀態與 `toggleNotes` 函式
    - [x] 更新 `contexts/EditorContext.tsx` 導出此狀態
- [x] 任務：實作 Header 切換按鈕 (PHASE_2_SHA)
    - [x] 在 `components/editor/EditorHeader.tsx` 中新增 `StickyNote` 按鈕
    - [x] 根據 `showNotes` 狀態實作按鈕的高亮效果
- [x] 任務：Conductor - User Manual Verification '階段 2' (Protocol in workflow.md) (PHASE_2_SHA)

## 階段 3：預覽介面渲染 [checkpoint: 98634d4]
**目標：** 在網頁預覽中，當開關開啟時顯示每張投影片的備忘錄。

- [x] 任務：實作 SlideNotes 渲染組件 (PHASE_3_SHA)
    - [x] 在 `components/editor/PreviewPane.tsx` 中，於 `SlideCard` 下方新增備忘錄顯示區域
    - [x] 使用琥珀色系樣式 (Amber Border/BG) 與 `StickyNote` 圖示裝飾
- [x] 任務：響應式佈局調整 (PHASE_3_SHA)
    - [x] 確保備忘錄展開時，預覽區域的滾動與間距依然維持美觀
- [x] 任務：Conductor - User Manual Verification '階段 3' (Protocol in workflow.md) (PHASE_3_SHA)

## 階段 4：PPTX 匯出與最終磨合 [checkpoint: 057eccb]
**目標：** 確保匯出的 PPTX 檔案包含原生備忘錄，並更新快捷側欄。

- [x] 任務：同步 PPTX 匯出引擎 (PHASE_4_SHA)
    - [x] 驗證 `services/pptGenerator.ts` 是否正確呼叫 `slide.addNotes()`
    - [x] 進行端到端測試，確認 PowerPoint 中的「備忘錄」欄位內容正確
- [x] 任務：更新快捷動作側欄與模板 (PHASE_4_SHA)
    - [x] 在 `components/editor/QuickActionSidebar.tsx` 中連結備忘錄按鈕
    - [x] 確保模板插入語法為 `<!-- note: $cursor -->`
- [x] 任務：更新預設教學內容 (PHASE_4_SHA)
    - [x] 修改 `constants/defaultContent.ts`，為關鍵分頁加上備忘錄範例
- [x] 任務：Conductor - User Manual Verification '階段 4' (Protocol in workflow.md) (PHASE_4_SHA)
