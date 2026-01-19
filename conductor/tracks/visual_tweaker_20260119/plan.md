# 實作計畫: Visual Tweaker (視覺化即時調整) - `visual_tweaker_20260119`

## 第一階段：雙向綁定基礎設施 (Infrastructure) [checkpoint: 9413c5f]
本階段目標是建立預覽元素與 Markdown 原始碼之間的映射關係，並實作通用的彈窗控制器。

- [x] Task: 實作 Markdown Source Mapping 81b62c9
    - [x] 修改 `markdownParser.ts`，在產生的 AST 節點中注入行號 (Line Number) 與區塊資訊。
    - [x] 修改渲染器 (Renderers)，在 HTML 元素上加入 `data-source-line` 等屬性以便識別。
- [x] Task: 建立 VisualTweaker 容器與 Context 25d1de6
    - [x] 建立 `VisualTweakerContext` 來管理當前選中的元素與彈窗狀態。
    - [x] 實作全域 `TweakerOverlay` 組件，負責根據座標渲染隨選彈窗 (Popover)。
- [x] Task: Conductor - User Manual Verification '第一階段：基礎設施' (Protocol in workflow.md) 9413c5f

## 第二階段：混合模式回寫引擎 (Hybrid Updater Engine) [checkpoint: c507c74]
本階段目標是實作核心的「Markdown 回寫」邏輯，區分即時與確認後更新的處理方式。

- [x] Task: 實作智慧內容替換器 (Smart Content Replacer) 9dff127
    - [x] 開發工具函式，根據行號與原始內容，精確替換 Markdown 中的特定區塊。
    - [x] 實作「即時同步 (Real-time)」與「確認後更新 (Commit)」兩種策略的 API 介面。
- [x] Task: 實作文字快速編輯 (Text Tweaker) fbeb1af
    - [x] 開發 `TextTweaker` 組件，支援 `contentEditable` 互動。
    - [x] 整合即時回寫邏輯，驗證輸入時編輯器同步更新。
- [x] Task: Conductor - User Manual Verification '第二階段：回寫引擎與文字編輯' (Protocol in workflow.md) c507c74

## 第三階段：進階元件互動 (Charts & Images)
本階段目標是實作圖表與圖片的專屬調整介面。

- [ ] Task: 實作圖片屬性調整器 (Image Tweaker)
    - [ ] 開發 `ImageTweaker` 工具列，包含 URL 輸入框與樣式選項。
    - [ ] 串接「確認後更新」邏輯。
- [ ] Task: 實作圖表數據編輯器 (Chart Data Editor)
    - [ ] 開發微型表格介面，允許修改圖表的 JSON 設定與 CSV 數據。
    - [ ] 實作從 AST 提取圖表參數並反向組裝為 Markdown 語法的邏輯。
- [ ] Task: Conductor - User Manual Verification '第三階段：進階元件' (Protocol in workflow.md)
