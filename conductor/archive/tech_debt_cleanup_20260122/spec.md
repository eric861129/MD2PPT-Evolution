# 規格說明書 (spec.md) - 技術債清理：移除舊解析器與修復測試 (Technical Debt Cleanup)

## 1. 概述 (Overview)
專案已成功遷移至 Remark/Unified AST 解析架構 (v0.15.0)，但仍殘留舊有的正規表示式解析器 `services/markdownParser.ts` 及其相關過時測試。這導致測試套件出現大量失敗（32 個失敗）。本 Track 旨在徹底移除過時代碼，並將有價值的測試案例遷移至新架構，確保測試套件 100% 通過。

## 2. 功能需求 (Functional Requirements)

### 2.1 代碼清理 (Code Cleanup)
- **移除檔案**：永久刪除 `services/markdownParser.ts`。
- **清理引用**：移除所有測試檔案中對 `parseMarkdown` 的引用。

### 2.2 測試遷移與重寫 (Test Migration)
- **整併測試案例**：
    - 將 `tests/markdownParser.test.ts` 中的基礎語法案例遷移至 `tests/astParser.test.ts`。
    - 將 `tests/boundaryCases.test.ts` 中的邊界情況案例遷移至 `tests/astParser.test.ts`。
    - 將 `tests/yamlParsing.test.ts` 中的配置案例遷移至 `tests/astParser.test.ts`。
- **更新斷言**：調整測試斷言以符合 AST 解析器輸出的 `ParsedBlock[]` 結構。

### 2.3 修復整合測試 (Mock Fixes)
- **更新 Mock 簽章**：修改 `ChartTweaker.test.tsx`, `ImageTweaker.test.tsx`, `VisualTweakerContext.test.tsx` 等檔案，確保它們預期的是不帶 `range` 參數的呼叫（或符合最新的 `updateContent` 簽章）。
- **修復 PresenterConsole 測試**：檢查 DOM 結構變更，修正 `PresenterConsole.test.tsx` 找不到元素的錯誤。

## 3. 非功能需求 (Non-Functional Requirements)
- **測試覆蓋率**：確保新的 AST 解析器核心覆蓋率維持在 90% 以上。
- **穩定性**：執行 `npm test` 必須達到 **0 failures**。

## 4. 驗收標準 (Acceptance Criteria)
1. `services/markdownParser.ts` 檔案已不存在。
2. 執行 `npm test` 全數通過 (100% Pass)。
3. 所有原本測試舊解析器的核心案例（如圖表解析、分頁邏輯）都已在 AST 測試中重新實作並通過。
4. 專案建置 `npm run build` 依然成功。

## 5. 超出範圍 (Out of Scope)
- 新功能的開發。
- 對 `services/parser/ast.ts` 本身的邏輯重構（僅限於修復發現的 Bug）。
