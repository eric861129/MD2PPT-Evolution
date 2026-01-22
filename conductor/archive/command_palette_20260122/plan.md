# 執行計畫 (plan.md) - 全域快捷鍵與命令面板 (Command Palette)

## 第一階段：基礎架構與 kbar 整合 (Infrastructure)
安裝依賴並建立命令面板的基礎組件與 Provider。

- [x] **Task: 安裝並設定 `kbar`** 72eb377
    - [x] 安裝 `kbar` 套件。 72eb377
    - [x] 建立 `components/editor/CommandPalette.tsx` 封裝面板 UI。 72eb377
    - [x] 在 `App.tsx` 或 `MarkdownEditor.tsx` 層級包裹 `KBarProvider`。 72eb377
- [x] **Task: 建立基礎樣式與動畫** 72eb377
    - [x] 實作符合專案風格（琥珀/石墨）的面板樣式。 72eb377
    - [x] 加入毛玻璃背景效果。 72eb377
- [ ] **Task: Conductor - User Manual Verification '第一階段：基礎架構' (Protocol in workflow.md)** 72eb377

## 第二階段：指令註冊與邏輯串接 (Actions Registry)
定義所有可執行的指令，並將其與現有的編輯器處理函式連結。

- [x] **Task: 實作系統控制指令** 002493f
    - [x] 註冊「切換主題」、「切換語系」、「切換深色模式」指令。 002493f
- [x] **Task: 整合插入功能（與斜線選單同步）** 002493f
    - [x] 註冊所有佈局（Grid, Two-col...）與元件（Chart, Table...）的插入指令。 002493f
- [x] **Task: 實作檔案與導航指令** 002493f
    - [x] 註冊 PPTX/MD/Image 匯出指令。 002493f
    - [x] 實作動態導航指令（列出所有投影片並支援搜尋跳轉）。 002493f
- [ ] **Task: Conductor - User Manual Verification '第二階段：指令註冊' (Protocol in workflow.md)** 002493f

## 第三階段：快捷鍵與進階體驗 (Interaction) [checkpoint: 72eb377]
優化鍵盤操作與最近使用功能。

- [x] **Task: 實作全域實體快捷鍵** 72eb377
    - [x] 透過 `kbar` 的 `shortcuts` 屬性定義全域快捷鍵（如 Alt+D, Alt+P）。 72eb377
- [x] **Task: 優化 UI 反饋** 72eb377
    - [x] 實作分組顯示標題（Group Headers）。 72eb377
    - [x] 加入最近使用操作 (Recent Actions) 的優先排序。 72eb377
- [x] **Task: 編輯器焦點衝突處理** 72eb377
    - [x] 確保面板開啟時暫停 Monaco/Textarea 的預設行為。 72eb377
- [x] **Task: Conductor - User Manual Verification '第三階段：交互優化' (Protocol in workflow.md)** 72eb377

## 第四階段：版本升級與最終優化 (Release)
完成版本更新並進行最終建置驗證。

- [x] **Task: 版本升級至 V0.14.4** 72eb377
    - [x] 更新 `package.json` 版本。 72eb377
    - [x] 更新 `README.md` 版本標記與功能說明。 72eb377
    - [x] 在 `CHANGELOG.md` 紀錄變更。 72eb377
- [x] **Task: 最終品質檢查** 72eb377
    - [x] 執行 `npm run build`。 72eb377
    - [x] 驗證 PWA 離線模式下命令面板的運作。 72eb377
- [x] **Task: Conductor - User Manual Verification '第四階段：最終優化' (Protocol in workflow.md)** 72eb377
