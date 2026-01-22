# 執行計畫 (plan.md) - 遷移至 Remark/Unified 解析管線

## 第零階段：分支建立與環境準備 (Branching & Setup)
確保開發環境獨立，並安裝必要的 Unified 生態系套件。

- [x] **Task: 建立開發分支** 06cb5cc
    - [x] 執行 `git checkout -b feature/remark-pipeline`。 06cb5cc
- [x] **Task: 安裝 Remark 相關依賴** c612a21
    - [x] 安裝 `unified`, `remark-parse`, `remark-frontmatter`, `remark-gfm`, `remark-directive`。 c612a21
- [ ] **Task: Conductor - User Manual Verification '第零階段：分支準備' (Protocol in workflow.md)**

## 第一階段：核心 AST 解析管線實作 (Core Pipeline)
建立基礎的 Remark 解析鏈，並實作自定義插件。

- [ ] **Task: 實作分頁 (===) 解析插件**
    - [ ] 撰寫測試：驗證 AST 能夠正確識別 Thematic Break 並進行節點分群。
    - [ ] 實作插件邏輯：將 MDAST 轉換為初步的投影片樹狀結構。
- [ ] **Task: 實作指令 (Directive) 處理器**
    - [ ] 撰寫測試：驗證 `::: chart` 與 `:: right` 能被解析為 Directive 節點。
    - [ ] 實作屬性提取邏輯：將 JSON 配置從指令中正確解析。
- [ ] **Task: Conductor - User Manual Verification '第一階段：核心管線' (Protocol in workflow.md)**

## 第二階段：SOM 2.0 數據映射與升級 (SOM Enhancement)
將 Remark 產生的 MDAST 映射至我們自定義的 SOM 模型，並引入位置資訊。

- [ ] **Task: 更新 SOM 介面定義**
    - [ ] 在 `SlideObject` 與其子節點加入 `position` (start/end offsets) 屬性。
- [ ] **Task: 開發 MDAST-to-SOM 轉換器**
    - [ ] 確保現有的佈局與內容邏輯在 AST 架構下依然正確。
    - [ ] 驗證巢狀結構（如列表內部的表格）的解析完整性。
- [ ] **Task: Conductor - User Manual Verification '第二階段：數據映射' (Protocol in workflow.md)**

## 第三階段：功能兼容性與回寫優化 (Compatibility & Tweaker)
確保現現有功能在 AST 架構下正常運作，並利用位置資訊強化 Visual Tweaker。

- [ ] **Task: 遷移現有 Markdown 工具函式**
    - [ ] 基於 AST 重構 `reorderSlides` 與 `updateSlideYaml`。
- [ ] **Task: 強化 Visual Tweaker 回寫精度**
    - [ ] 實作基於 Offset 的 Markdown 原地更新邏輯。
- [ ] **Task: 版本升級與文件更新**
    - [ ] 更新 `package.json` 至 **V0.14.3**。
    - [ ] 更新 `CHANGELOG.md`。
- [ ] **Task: Conductor - User Manual Verification '第三階段：功能驗證' (Protocol in workflow.md)**
