# 實作計畫: 動態背景生成器 (Generative Backgrounds) - `generative_backgrounds_20260119`

## 第一階段：核心生成引擎與 YAML 解析 [checkpoint: 8c9c485]
本階段目標是建立 SVG 背景生成邏輯，並讓解析器能識別新的 YAML 配置。

- [x] Task: 建立背景生成服務 (`GenerativeBgService.ts`) 6ac9e24
    - [x] 撰寫單元測試驗證 Mesh Gradient SVG 字串生成與參數校驗。
    - [x] 實作 Mesh Gradient 算法，支援傳入顏色陣列、隨機種子與模糊度。
- [x] Task: 擴展 Markdown 解析與渲染邏輯 6ac9e24
    - [x] 撰寫測試驗證 YAML 中 `bg: mesh` 及其細節參數 (`colors`, `seed`) 的正確解析。
    - [x] 修改 `PreviewPane.tsx` 的 `SlideCard` 元件，使其能動態注入生成的 SVG 背景層。
- [x] Task: Conductor - User Manual Verification '第一階段：核心引擎與渲染' (Protocol in workflow.md) 8c9c485

## 第二階段：視覺化編輯整合 (Tweaker) [checkpoint: 71626e1]
本階段目標是讓使用者能直接在預覽區透過點擊來微調背景效果。

- [x] Task: 實作背景專用調整器 (`BackgroundTweaker.tsx`) 8f93cd4
    - [x] 撰寫測試驗證 Tweaker 的顏色切換與「重新生成 (Re-roll)」功能。
    - [x] 建立具備顏色選擇器與隨機種子觸發按鈕的 Tweaker 介面。
- [x] Task: 整合 `VisualTweakerContext` 8f93cd4
    - [x] 修改預覽點擊監聽邏輯，支援點擊投影片空白處（背景）觸發 Background Tweaker。
    - [x] 實作背景變更的即時回寫 (Real-time Sync) 到 Markdown YAML。
- [x] Task: Conductor - User Manual Verification '第二階段：視覺化編輯整合' (Protocol in workflow.md) 71626e1

## 第三階段：完整工作流與匯出支援 [checkpoint: ab041f4]
本階段目標是加入斜線指令模板，並確保 PPT 匯出時包含生成的背景。

- [x] Task: 實作斜線指令與模板整合 0db22ab
    - [x] 在 `SlashMenu` 加入 `/bg-mesh` 指令。
    - [x] 在 `constants/templates.ts` 加入對應的網格漸層 YAML 模板。
- [x] Task: PPTX 匯出支援 0db22ab
    - [x] 實作 SVG 轉高解析度圖片 (Base64) 的工具函式。
    - [x] 修改 `pptGenerator.ts`，在產生投影片時，若偵測到 `bg: mesh` 則生成圖片並設定為背景。
- [x] Task: 更新版本號與產品文件 (v0.10.0) 0db22ab
    - [x] 更新 `package.json`, `README.md` 版本徽章與 `CHANGELOG.md`。
    - [x] 更新 `constants/defaultContent.ts` 加入動態背景展示分頁。
- [x] Task: Conductor - User Manual Verification '第三階段：完整工作流與匯出' (Protocol in workflow.md) ab041f4
