# 執行計畫 (plan.md) - 字體大小客製化設定 (Custom Font Sizing)

## 第一階段：解析器與數據模型升級 (Parser & Model)
本階段專注於讓系統「認識」`{size=N}` 語法，並將其轉化為內部的樣式屬性。

- [x] **Task: 建立字體標籤解析測試** 1b65f58
    - [x] 撰寫測試案例：驗證標題、段落及列表末尾的 `{size=N}` 能被正確識別。 1b65f58
    - [x] 撰寫測試案例：驗證標籤被提取後，原始內容文字不應包含該標籤。 1b65f58
- [x] **Task: 實作 AST 屬性提取邏輯** 1b65f58
    - [x] 修改 `services/parser/ast.ts` 中的 `mapNodeToBlock`。 1b65f58
    - [x] 使用 Regex 掃描內容末尾，將 `size` 數值存入 `ParsedBlock.metadata`。 1b65f58
- [ ] **Task: Conductor - User Manual Verification '第一階段：解析邏輯' (Protocol in workflow.md)**

## 第二階段：Markdown 更新器強化 (Persistence Logic)
實作智慧回寫功能，確保 Visual Tweaker 的調整能精確反映到原始碼。

- [ ] **Task: 實作屬性標籤更新函式**
    - [ ] 在 `services/markdownUpdater.ts` 新增 `updateElementAttribute`。
    - [ ] 邏輯開發：自動偵測現有標籤並替換，或在末尾追加新標籤。
- [ ] **Task: 建立回寫功能單元測試**
    - [ ] 驗證不同元素（標題 vs 列表）插入標籤時的字串處理正確性。
- [ ] **Task: Conductor - User Manual Verification '第二階段：回寫邏輯' (Protocol in workflow.md)**

## 第三階段：Tweaker UI 與即時預覽 (UI & Interaction)
在視覺調整介面中加入控制器，並實現 Web 端的即時渲染。

- [ ] **Task: 擴充 Visual Tweaker UI**
    - [ ] 在 `components/tweaker/TextTweaker.tsx` 加入字體大小輸入框。
    - [ ] 實作上下增減按鈕（每點擊一次 +/- 2pt）。
- [ ] **Task: 實作 Web 預覽渲染**
    - [ ] 修改 `components/editor/PreviewRenderers.tsx`。
    - [ ] 根據 `block.metadata.size` 動態設定 HTML 元素的 `style.fontSize`。
- [ ] **Task: Conductor - User Manual Verification '第三階段：UI 互動' (Protocol in workflow.md)**

## 第四階段：PPTX 導出支援與最終驗證 (Export & Release)
確保樣式設定能完美轉移至 PowerPoint 檔案中。

- [ ] **Task: 更新 PPTX 產生器**
    - [ ] 修改 `services/pptGenerator.ts`。
    - [ ] 在呼叫 `pptxgenjs` 時，優先使用 `metadata.size` 作為字體磅值。
- [ ] **Task: 版本升級與文件更新**
    - [ ] 更新 `package.json` 至 **V0.14.5**。
    - [ ] 更新 `CHANGELOG.md` 並同步 `README.md`。
- [ ] **Task: Conductor - User Manual Verification '第四階段：最終優化' (Protocol in workflow.md)**
