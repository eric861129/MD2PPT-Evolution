# Implementation Plan - Enterprise Brand System

本計畫旨在實作企業級品牌系統，包含品牌色票、安全字體與全域 Logo 管理。

## Phase 1: 基礎架構與狀態管理 (Foundation & State)
- [x] **Task: 定義品牌資料結構與類型 (Types)** 7ba2992
    - [ ] 在 `services/types.ts` 定義 `BrandConfig` 介面
    - [ ] 包含 primaryColor, secondaryColor, accentColor, font, logo (Base64), logoPosition 等欄位
- [x] **Task: 實作品牌狀態管理 (Brand Settings Hook)** 508d8fb
    - [ ] 撰寫測試驗證狀態更新邏輯
    - [ ] 建立 `hooks/useBrandSettings.ts`
    - [ ] 實作 `updateBrandConfig` 方法
- [x] **Task: 實作 JSON 匯入/匯出邏輯** fa2b052
    - [ ] 撰寫測試驗證 JSON 解析與驗證邏輯
    - [ ] 實作匯出為 `brand.json` 的功能
    - [ ] 實作解析 `brand.json` 並更新狀態的功能
- [ ] **Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)**

## Phase 2: 品牌設定使用者介面 (Brand Settings UI)
- [x] **Task: 建立品牌設定對話視窗 (Brand Settings Modal)** cfd1e46
    - [ ] 撰寫測試驗證 Modal 的開啟與關閉
    - [ ] 使用現有 UI 元件建立 Modal 框架
- [x] **Task: 實作色票選擇器與字體選單** 11b8b62
    - [ ] 撰寫測試驗證顏色變更觸發狀態更新
    - [ ] 整合顏色選擇器 (Color Picker)
    - [ ] 實作限制在「安全字體清單」中的字體選單
- [ ] **Task: 實作 Logo 上傳與 JSON 拖放**
    - [ ] 撰寫測試驗證圖片轉 Base64 邏輯
    - [ ] 實作 Logo 上傳按鈕與預覽區
    - [ ] 在 Modal 內支援拖放 `brand.json` 檔案以載入設定
- [ ] **Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)**

## Phase 3: 視覺整合與 CSS 變數 (Visual Integration)
- [ ] **Task: 專業化主題預設值 (Professionalizing Theme Presets)**
    - [ ] 修改 `constants/themes.ts` 與 `constants/palettes.ts`
    - [ ] 將所有預設主題的背景改為純色（白色為主，深色主題為輔）
    - [ ] 確保標題與內容顏色在純色背景下具備高對比度
    - [ ] 將 Mesh 背景從「主題預設」中移除，改為使用者可自行開啟的視覺選項
- [ ] **Task: 全域 CSS 變數注入**
    - [ ] 撰寫測試驗證 CSS 變數是否正確插入 DOM
    - [ ] 實作一個 Effect，根據品牌狀態更新 `:root` 的 CSS 變數 (如 `--brand-primary`)
- [ ] **Task: 調整預覽區元件以套用品牌規範**
    - [ ] 確保標題與圖表預設使用品牌色變數
    - [ ] 在預覽區固定位置顯示品牌 Logo
- [ ] **Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)**

## Phase 4: PPTX 匯出增強 (PPTX Export Enhancement)
- [ ] **Task: 在 PPTX 母片中加入 Logo**
    - [ ] 撰寫測試 (Mock) 驗證 `pptxgenjs` 呼叫包含 Logo 參數
    - [ ] 修改 `services/ppt/pptGenerator.ts`，在產生 Slide Master 時加入 Logo
- [ ] **Task: 匯出時套用品牌配色與字體**
    - [ ] 確保匯出的標題與圖表顏色使用品牌配置
    - [ ] 確保匯出物件正確設定字體名稱
- [ ] **Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)**

## Phase 5: 結案與版本更新 (Finalization)
- [ ] **Task: 更新專案文件與版本**
    - [ ] 更新 `package.json` 版本 (0.11.0)
    - [ ] 更新 `CHANGELOG.md` 紀錄新功能
    - [ ] 更新 `README.md` 版本標記
- [ ] **Task: Conductor - User Manual Verification 'Phase 5' (Protocol in workflow.md)**
