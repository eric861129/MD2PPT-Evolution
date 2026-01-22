# 執行計畫 (plan.md) - 投影片拖拽重排 (Drag & Drop Reordering)

## 第一階段：核心算法與基礎測試 (Core Logic) [checkpoint: 6bde63c]
本階段專注於不依賴 UI 的 Markdown 字串處理邏輯，確保順序重排後內容正確。

- [x] **Task: 建立 Markdown 重排測試** 1d3374c
    - [x] 撰寫測試案例：驗證將中間投影片移至首位時，全域 YAML 是否保留。 1d3374c
    - [x] 撰寫測試案例：驗證移動後分頁符號 `===` 的空行正確性。 1d3374c
- [x] **Task: 實作 `reorderMarkdown` 算法** 1d3374c
    - [x] 開發邏輯：精確切割 `===` 區塊，跳過全域 Header，執行重組。 1d3374c
- [x] **Task: Conductor - User Manual Verification '第一階段：核心算法' (Protocol in workflow.md)** 6bde63c

## 第二階段：UI 組件與拖拽基礎 (UI Infrastructure)
將拖拽功能整合進 React 元件中，並實作基礎的互動。

- [x] **Task: 安裝並設定 `@dnd-kit`** f891fbf
    - [x] 安裝 `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`。 f891fbf
- [x] **Task: 實作可拖拽的投影片容器** bd06dbc
    - [x] 在側欄 (Sidebar) 與主頁面預覽 (Preview) 整合 `SortableContext`。 bd06dbc
    - [x] 新增 `DragHandle` 組件並套用至所有投影片左上角。 bd06dbc
- [x] **Task: 實作視覺反饋** c56555f
    - [x] 實作 `Ghost Image` (拖動時的半透明縮圖)。 c56555f
    - [x] 實作 `Placeholder` (目標位置的佔位視覺)。 c56555f
- [x] **Task: 連結編輯器狀態更新** 930ecdb
    - [x] 在 `onDragEnd` 事件中呼叫 `reorderMarkdown` 並更新 `editorContent`。 930ecdb
- [x] **Task: 演講者主控台同步** 930ecdb
    - [x] 確保主控台調整順序後，能透過 `BroadcastChannel` 同步至觀眾視窗。 930ecdb
- [x] **Task: 實作自動捲動 (Auto-scroll)** 930ecdb
    - [x] 設定 `dnd-kit` 的捲動監測，確保長清單操作順暢。 930ecdb
- [x] **Task: Conductor - User Manual Verification '第三階段：同步整合' (Protocol in workflow.md)** 930ecdb

## 第四階段：優化與行動端相容 (Polish & Mobile)
完善使用者體驗並確保跨裝置穩定。

- [ ] **Task: 加入平滑過渡動畫**
    - [ ] 使用 `framer-motion` 或 `dnd-kit` 內建動畫優化位置交換的視覺效果。
- [ ] **Task: 行動端觸控優化**
    - [ ] 測試並調整觸控長按與把手觸發的靈敏度。
- [ ] **Task: 最終品質門檻檢查**
    - [ ] 執行完整建置與測試覆蓋率檢查。
- [ ] **Task: Conductor - User Manual Verification '第四階段：最終優化' (Protocol in workflow.md)**
