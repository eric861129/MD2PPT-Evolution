# 實作計畫: Slash Command (斜線指令系統) - `slash_command_20260119`

## 第一階段：基礎設施與 UI 組件 (Foundation & UI)
本階段目標是建立選單的視覺組件，並能在編輯器中正確觸發彈出。

- [x] Task: 建立 SlashMenu 基礎組件 (cf1f4cf)
    - [ ] 在 `components/editor/` 中建立 `SlashMenu.tsx`。
    - [ ] 使用 Tailwind 實作懸浮 Popover 樣式，確保與現有主題一致。
- [ ] Task: 實作觸發偵測與座標計算
    - [ ] 在 `hooks/useMarkdownEditor.ts` 或相關 Context 中實作偵測 `/` 的邏輯。
    - [ ] 實作游標座標計算函數，確保選單能精確顯示在游標下方。
- [ ] Task: Conductor - User Manual Verification '第一階段：基礎設施與 UI' (Protocol in workflow.md)

## 第二階段：互動邏輯與鍵盤導航 (Interaction & Navigation)
本階段目標是讓選單具備搜尋過濾功能，並支援完全的鍵盤操作。

- [ ] Task: 實作列表過濾邏輯
    - [ ] 根據 `/` 之後輸入的文字，對指令列表進行即時 Fuzzy Search 篩選。
- [ ] Task: 實作鍵盤導航
    - [ ] 實作 `↑`/`↓` 鍵切換選取項目的邏輯。
    - [ ] 實作 `Enter` 確認選取及 `Esc` 關閉選單的事件處理。
- [ ] Task: Conductor - User Manual Verification '第二階段：互動邏輯' (Protocol in workflow.md)

## 第三階段：指令註冊表與插入功能 (Registry & Insertion)
本階段目標是定義所有指令的範本內容，並實作內容插入編輯器的邏輯。

- [ ] Task: 建立指令註冊表 (Command Registry)
    - [ ] 定義包含「基礎排版」、「佈局」、「元件」、「多媒體」四大類別的指令集。
    - [ ] 為每個指令編寫包含「範例數據」的 Markdown 模板。
- [ ] Task: 實作編輯器內容更新
    - [ ] 透過 `EditorContext` 實作選取指令後，將模板插入正確位置並移除 `/` 的功能。
    - [ ] 實作插入後的游標智慧定位（自動移至範例內容中間）。
- [ ] Task: Conductor - User Manual Verification '第三階段：指令插入' (Protocol in workflow.md)

## 第四階段：細節優化與整合測試 (Refinement & Final Test)
最後的拋光與確保邊緣案例（如靠近螢幕邊緣）的處理。

- [ ] Task: 邊界溢出處理與視覺拋光
    - [ ] 確保選單在編輯器底部或右側時不會被切掉（Auto-flip 邏輯）。
    - [ ] 加入選單開啟/關閉的微動畫。
- [ ] Task: 完整整合測試
    - [ ] 撰寫整合測試，驗證從輸入 `/` 到選取指令、內容渲染的完整流程。
- [ ] Task: Conductor - User Manual Verification '第四階段：最終優化' (Protocol in workflow.md)
