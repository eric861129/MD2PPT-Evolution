# 開發計畫: 預覽修復與專業排版豐富化

## 階段 1: 預覽同步與分頁 UI 修復
- [x] Task: 編寫同步分頁邏輯與 UI 邊界標示的測試案例
- [x] Task: 重構 `PreviewPane.tsx` 以顯示明確的「投影片卡片 (Slide Cards)」
- [x] Task: 確保 `pptGenerator` 與網頁預覽共用同一套分頁邏輯
- [ ] Task: Conductor - User Manual Verification '階段 1: 預覽同步與分頁 UI 修復' (Protocol in workflow.md)

## 階段 2: 自定義背景顏色實作
- [ ] Task: 編寫 YAML Frontmatter 與分頁線參數解析的測試案例
- [ ] Task: 實作 `pptGenerator.ts` 中的背景顏色套用邏輯 (全域與單頁)
- [ ] Task: 更新 `PreviewRenderers.tsx` 以在網頁預覽中反映背景顏色
- [ ] Task: Conductor - User Manual Verification '階段 2: 自定義背景顏色實作' (Protocol in workflow.md)

## 階段 3: 進階排版佈局實作 (Layouts)
- [ ] Task: 編寫佈局屬性標記 (`layout: ...`) 的偵測與解析測試
- [ ] Task: 實作「雙欄佈局 (Two Columns)」的 PPT 渲染與預覽邏輯
- [ ] Task: 實作「大數字/強調頁 (Impact)」的渲染邏輯
- [ ] Task: 實作「全螢幕背景」與「加強版對話」排版
- [ ] Task: Conductor - User Manual Verification '階段 3: 進階排版佈局實作 (Layouts)' (Protocol in workflow.md)

## 階段 4: 最終整合與商務風格優化
- [ ] Task: 編寫整體風格一致性與極簡專業感驗證測試
- [ ] Task: 優化 UI 與 PPT 字體間距，提升商務質感
- [ ] Task: 進行最終整合測試：確保所有新佈局皆能成功匯出並正確顯示
- [ ] Task: Conductor - User Manual Verification '階段 4: 最終整合與商務風格優化' (Protocol in workflow.md)
