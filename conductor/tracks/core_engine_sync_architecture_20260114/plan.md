# 實作計畫 (Plan): 核心引擎優化與架構重構

本計畫將重構 PPT 生成引擎為同步架構，並引入模組化設計與嚴格型別。

## 階段 1: 環境準備與型別定義 (Setup & Types)
目標：建立開發分支並定義基礎型別。

- [x] 任務 1: 建立並切換至 `refactor/core-engine-sync-architecture` 分支。(20d67d0)
- [x] 任務 2: 更新 `services/types.ts`，定義 `SlideMetadata` 介面並強化 `ParsedBlock` 的型別。(4751e21)
- [x] 任務 3: 建立新的目錄結構 `services/ppt/builders/` 並定義同步介面 `BlockRenderer` 與 `RenderContext`。(b61478b)
- [ ] Task: Conductor - User Manual Verification '階段 1: 環境準備與型別定義' (Protocol in workflow.md)

## 階段 2: 註冊表與 Mock 測試基礎 (Registry & Testing) [checkpoint: 7e22a09]
目標：建立核心註冊機制並確保測試環境就緒。

- [x] 任務 1: 實作 `RendererRegistry` (同步版本)。(8eff33d)
- [x] 任務 2: 設置 Vitest Mock `pptxgenjs` 並編寫基礎生成引擎的測試腳本。(3dfa797)
- [x] 任務 3: 實作 `services/ppt/builders/index.ts` 進行手動匯出管理。(2ded42a)
- [x] Task: Conductor - User Manual Verification '階段 2: 註冊表與 Mock 測試基礎' (Protocol in workflow.md)

## 階段 3: 同步 Renderer 遷移與預處理邏輯 (Migration & Pre-processing) [checkpoint: a6acc56]
目標：遷移所有區塊並實作預處理。

- [x] 任務 1: 在 `services/pptGenerator.ts` 的 `generatePpt` 中實作統一的非同步預處理器 (處理圖片與程式碼高亮)。(045ecd9)
- [x] 任務 2: 遷移並實作 `HeadingRenderer` 與 `ParagraphRenderer` (同步)。(b0fd07c)
- [x] 任務 3: 遷移並實作 `ListRenderer`, `ImageRenderer` 與 `CodeBlockRenderer` (同步，讀取預處理資料)。(9790368)
- [x] 任務 4: 遷移並實作 `ChatCustomRenderer` (同步)。(9768fac)
- [x] Task: Conductor - User Manual Verification '階段 3: 同步 Renderer 遷移與預處理邏輯' (Protocol in workflow.md)

## 階段 4: 最終整合與清理 (Integration & Cleanup)
目標：移除舊邏輯並確保穩定性。

- [x] 任務 1: 在 `renderBlocksToArea` 中切換至 Registry 模式，並移除舊的 `switch-case` 邏輯。(b7abc72)
- [ ] 任務 2: 執行完整的 Mock 測試與迴歸測試。
- [ ] 任務 3: 合併分支 (由使用者決定)。
- [ ] Task: Conductor - User Manual Verification '階段 4: 最終整合與清理' (Protocol in workflow.md)
