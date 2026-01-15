# 執行計畫：快捷動作側欄與直覺式資產管理 (quick_action_sidebar_20260115)

## 階段 1：快捷動作側欄 (UI & Component) [checkpoint: d8013f4]
**目標：** 建立左側欄 UI，支援展開/收合狀態管理，並定義動作按鈕清單。

- [x] 任務：建立 QuickActionSidebar 組件
    - [x] 撰寫測試驗證側欄的渲染與收合/展開邏輯
    - [x] 實作 Sidebar UI (使用 Lucide Icons)
    - [x] 定義按鈕配置清單 (Icon, Label, ActionType)
- [x] 任務：整合至主佈局 (App/MarkdownEditor)
    - [x] 調整 `MarkdownEditor.tsx` 的 Flex 佈局，將 Sidebar 嵌入左側
    - [x] 確保 EditorPane 在 Sidebar 展開/收合時能響應式調整寬度
- [x] 任務：Conductor - User Manual Verification '階段 1' (Protocol in workflow.md)

## 階段 2：編輯器動作與語法插入邏輯 [checkpoint: 919c8a8]
**目標：** 實現點擊按鈕後，將特定語法模板插入 Monaco Editor 的游標位置。

- [ ] 任務：開發 EditorActionService
    - [ ] 撰寫測試：模擬 Monaco Editor 行為，驗證文字插入與游標移動邏輯
    - [ ] 實作 `insertText(editor, template)` 函式，支援佔位符 ($cursor)
- [ ] 任務：實作基礎結構與佈局動作
    - [ ] 連接「新增投影片」、「Grid 佈局」、「Quote 佈局」按鈕
    - [ ] 定義對應的 YAML 模板字串 (e.g. `===
---
layout: grid
---
`)
- [ ] 任務：實作元件與樣式動作
    - [ ] 連接「表格」、「圖片」、「粗體」等按鈕
    - [ ] 實現樣式包裹邏輯 (Wrapping selected text)
- [ ] 任務：Conductor - User Manual Verification '階段 2' (Protocol in workflow.md)

## 階段 3：拖放式圖片管理 (Drag & Drop) [checkpoint: 45e0027]
**目標：** 實現圖片拖放轉 Base64，以及預覽區背景圖拖放功能。

- [ ] 任務：實作 Editor 圖片拖放
    - [ ] 撰寫測試驗證檔案讀取與 Base64 轉換流程
    - [ ] 在 `MarkdownEditor` 層級監聽 `onDrop` 事件
    - [ ] 實作圖片插入邏輯，並將游標自動定位至 Alt Text
- [ ] 任務：實作預覽區背景拖放
    - [ ] 在 `PreviewPane` 的 `SlideCard` 上實作 `onDrop` 處理器
    - [ ] 開發 YAML 更新邏輯：解析當前文件，找到對應投影片的 YAML 區塊並注入 `bgImage`
- [ ] 任務：Conductor - User Manual Verification '階段 3' (Protocol in workflow.md)

## 階段 4：整合驗證與清理
**目標：** 進行端到端測試，確保所有功能流暢運作，並清理未使用的程式碼。

- [x] 任務：UI 細節打磨
    - [x] 優化 Tooltip 提示，確保使用者知道每個按鈕的用途
    - [x] 統一深色/淺色主題下的 Sidebar 樣式
- [x] 任務：E2E 流程測試
    - [x] 手動驗證：點擊側欄 -> 插入內容 -> 拖放圖片 -> 設定背景 -> 匯出 PPTX
- [x] 任務：Conductor - User Manual Verification '階段 4' (Protocol in workflow.md)
