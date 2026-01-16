# 執行計畫：原生可編輯圖表支援 (native_charts_v060)

## 階段 1：基礎建設與解析器擴展 [checkpoint: 9950ea7]
**目標：** 更新 Markdown 解析器以識別圖表容器指令，並實作數據轉換邏輯。

- [x] 任務：更新 AST 解析器支援 Chart 指令
    - [x] 撰寫測試驗證 `::: chart-type` 指令是否能正確解析出 `ParsedBlock`
    - [x] 修改 `services/parser/ast.ts`，增加對圖表指令的偵測與參數解析
- [x] 任務：實作 Table-to-Chart 數據轉換器
    - [x] 撰寫單元測試驗證 Markdown 表格數據是否能正確轉換為 Chart Data Object
    - [x] 實作資料提取邏輯（第一列為類別，其餘為序列）
- [x] 任務：Conductor - User Manual Verification '階段 1' (Protocol in workflow.md)

## 階段 2：Web 預覽實作 (Recharts 整合) [checkpoint: 4f45124]
**目標：** 在網頁預覽端渲染高品質的即時圖表。

- [x] 任務：引入 Recharts 與建立基礎渲染組件
    - [x] 安裝 `recharts` 依賴
    - [x] 實作 `ChartPreview` 組件，支援不同類型的圖表渲染
- [x] 任務：整合至 PreviewRenderers
    - [x] 更新 `components/editor/PreviewRenderers.tsx`，加入對 Chart Block 的渲染分支
    - [x] 確保圖表配色能響應當前 UI 主題 (Dark/Light)
- [x] 任務：Conductor - User Manual Verification '階段 2' (Protocol in workflow.md)

## 階段 3：PPTX 引擎導出同步 [checkpoint: 5df7ef7]
**目標：** 調用 `pptxgenjs` API 生成原生圖表物件。

- [x] 任務：開發 PPTX Chart 渲染器
    - [x] 撰寫測試驗證 `pptxgenjs` 的 `addChart` 調用參數
    - [x] 建立 `services/ppt/builders/ChartRenderer.ts`
    - [x] 將 `ChartRenderer` 註冊至 `RendererRegistry`
- [x] 任務：圖表樣式與配置同步
    - [x] 修改 `services/pptGenerator.ts` 以正確傳遞圖表配置參數 (Title, Legend, etc.) (已透過 ChartRenderer 實作)
    - [x] 驗證匯出檔案的可編輯性（數據連結是否保留）
- [x] 任務：Conductor - User Manual Verification '階段 3' (Protocol in workflow.md)

## 階段 4：優化與預設內容更新
**目標：** 提供教學範例並確保功能的易用性。

- [ ] 任務：更新快捷動作側欄
    - [ ] 在 `QuickActionSidebar` 中新增插入圖表模板的按鈕
    - [ ] 在 `constants/templates.ts` 中定義圖表示範模板
- [ ] 任務：更新預設教學內容
    - [ ] 修改 `constants/defaultContent.ts`，加入一個展示圖表功能的投影片
- [ ] 任務：Conductor - User Manual Verification '階段 4' (Protocol in workflow.md)
