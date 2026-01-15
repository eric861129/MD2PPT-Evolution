# 規格說明書 (Specification): 核心引擎優化與架構重構

## 1. 概述 (Overview)
本 Track 旨在解決 MD2PPT-Evolution 核心引擎的架構債務。我們將重構 `pptGenerator.ts` 以支援模組化 Renderer，同時將原本的非同步渲染流程改為「預處理 (Async) + 渲染 (Sync)」的二段式架構，徹底解決因 `pptxgenjs` 與 `async/await` 衝突導致的 PPTX 損壞問題。此外，將引入嚴格的型別定義並提升測試覆蓋率。

## 2. 功能需求 (Functional Requirements)
- **同步渲染架構 (A1)**：
    - 在 `generatePpt` 階段執行所有非同步操作：圖片轉 Base64、Shiki Token 生成、Mermaid SVG 生成。
    - 將預處理後的資料存入 `ParsedBlock.metadata`。
    - `renderBlocksToArea` 及其呼叫的所有 `BlockRenderer` 必須是純同步函數。
- **型別定義強化 (A2)**：
    - 定義 `SlideMetadata` 介面，明確規範 `bg`, `bgImage`, `layout`, `note`, `cols` 等欄位。
    - 使用漸進式型別定義，允許 `[key: string]: any` 擴充。
- **測試覆蓋率提升 (A3)**：
    - 使用 Vitest Mocking `pptxgenjs` 模組。
    - 編寫測試案例驗證各類 `BlockRenderer` 是否正確呼叫 `slide.addText`, `slide.addImage` 等方法。

## 3. 非功能需求 (Non-Functional Requirements)
- **穩定性**：匯出的 PPTX 檔案必須能在 PowerPoint 中正常開啟，不跳出「損壞修復」提示。
- **可維護性**：採用註冊表模式 (Registry Pattern)，使未來新增區塊類型時無需修改主引擎。

## 4. 驗收標準 (Acceptance Criteria)
- [ ] 成功建立並切換至 `refactor/core-engine-sync-architecture` 分支。
- [ ] `services/pptGenerator.ts` 不再包含非同步渲染呼叫 (`await` 僅存在於預處理階段)。
- [ ] 實作 `RendererRegistry` 與至少 5 種同步 `BlockRenderer` (Heading, Paragraph, List, Image, Code)。
- [ ] 通過新增的 Mock 測試案例。
- [ ] 手動測試：匯出的包含程式碼高亮與圖片的 PPT 可正常開啟且內容正確。

## 5. 不在範圍內 (Out of Scope)
- 更改前端 UI 配色 (已在 v0.3.1 完成)。
- 實作新的 Markdown 語法。
