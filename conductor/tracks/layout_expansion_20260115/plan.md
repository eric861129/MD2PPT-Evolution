# 執行計畫：核心佈局擴展與 YAML 配置化 (core_layout_directives_expansion)

## 階段 1：基礎設施 - YAML 解析與狀態管理重構 [checkpoint: e3970fe]
**目標：** 實作投影片層級的 YAML 解析器，並更新 Zustand Store 以支援新的配置結構。

- [x] 任務：定義新的 Slide Object Model (SOM) 結構 (647bb76)
    - [x] 撰寫測試驗證 SOM 是否能包含 `config` 欄位（layout, background, transition）
    - [x] 更新 `services/parser/slides.ts` 中的類型定義
- [x] 任務：實作 Markdown-to-YAML 解析器 (3b6046e)
    - [x] 撰寫解析測試：驗證 `---` 分隔符號後的 YAML 區塊能正確轉換為物件
    - [x] 修改 `services/markdownParser.ts`，整合 YAML 解析邏輯 (推薦使用 `js-yaml`)
- [x] 任務：更新 Zustand Editor Store (cae3543)
    - [x] 撰寫測試確保編輯內容變更時，SOM 的 config 能即時更新
    - [x] 調整 `hooks/useEditorState.ts` 以存取新的 SOM 結構 (實際上更新了 PreviewPane 及其整合測試)
- [x] 任務：Conductor - User Manual Verification '階段 1' (Protocol in workflow.md) (e3970fe)

## 階段 2：佈局渲染器實作 (Web 預覽) [checkpoint: 486fffa]
**目標：** 在網頁預覽端實作四種新佈局與背景渲染。

- [x] 任務：實作 Center 與 Quote 佈局樣式 (486fffa)
    - [x] 撰寫測試驗證佈局組件是否接收到正確的配置
    - [x] 在 `components/editor/PreviewRenderers.tsx` 中新增 Center 與 Quote 的 Tailwind 樣式 (已實作於 PreviewPane 以獲得更好的整合性)
- [x] 任務：實作 Grid (網格) 佈局系統 (486fffa)
    - [x] 撰寫測試驗證多欄位內容的分配邏輯
    - [x] 實作基於 CSS Grid 的預覽組件，支援選填的 columns 設定
- [x] 任務：實作 Alert 佈局樣式 (486fffa)
    - [x] 撰寫預覽測試：驗證不同類型的 Alert (Info, Warning) 視覺呈現
    - [x] 新增 Alert 渲染組件
- [x] 任務：背景與過場動畫預覽整合 (486fffa)
    - [x] 撰寫測試驗證背景顏色/圖片是否正確應用於預覽容器
    - [x] 在 `PreviewPane.tsx` 中實作動態背景與 CSS Transition 效果
- [x] 任務：Conductor - User Manual Verification '階段 2' (Protocol in workflow.md) (486fffa)

## 階段 3：PPTX 引擎同步 (Export Logic)
**目標：** 將新的佈局與配置對應至 `pptxgenjs`，確保匯出的檔案與預覽一致。

- [ ] 任務：更新 PPTX Registry 與 Master 定義
    - [ ] 撰寫測試驗證 `services/pptx/masters.ts` 是否正確接收配置
    - [ ] 在 `masters.ts` 中定義 Grid, Center, Quote, Alert 的 Slide Master
- [ ] 任務：實作 PPTX 背景與過場動畫導出
    - [ ] 撰寫測試驗證 `pptxgenjs` 的 slide 選項是否包含 transition 與 background
    - [ ] 修改 `services/pptGenerator.ts`，將 SOM config 映射至 PPTX 投影片屬性
- [ ] 任務：實作 Table-Modern 指令渲染器
    - [ ] 撰寫測試驗證 `::: table-modern` 容器內的表格解析
    - [ ] 實作新的 PPTX 表格渲染器，支援自定義標題顏色與間隔列
- [ ] 任務：Conductor - User Manual Verification '階段 3' (Protocol in workflow.md)

## 階段 4：清理與相容性處理
**目標：** 移除舊有的 `::: layout` 語法，並進行最終品質校正。

- [ ] 任務：廢除指令式佈局語法
    - [ ] 撰寫測試驗證舊有的 `::: layout` 不再影響排版
    - [ ] 從解析器中移除舊的佈局指令邏輯
- [ ] 任務：全域整合測試與文件更新
    - [ ] 執行端到端測試：從 Markdown 輸入到 PPTX 匯出的完整流程
    - [ ] 更新 `README.md` 或 `CUSTOMIZATION.md` 中的語法說明
- [ ] 任務：Conductor - User Manual Verification '階段 4' (Protocol in workflow.md)
