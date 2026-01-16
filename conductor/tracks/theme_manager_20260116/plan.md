# 執行計畫：全域主題管理器 (theme_manager_v080)

## 階段 1：基礎設施 - 主題狀態與型別定義 [checkpoint: a0b8d9d]
**目標：** 定義主題數據結構，並在全域 Context 中建立主題管理邏輯與持久化機制。

- [x] 任務：定義主題與配色型別 (a0b8d9d)
    - [x] 在 `services/types.ts` 中定義 `ThemeConfig` 與 `PptTheme` 介面
    - [x] 建立 `constants/themes.ts` 存放 4 種預設主題的數值 (Amber, Midnight, Academic, Material)
- [x] 任務：擴充全域狀態管理 (a0b8d9d)
    - [x] 修改 `hooks/useEditorState.ts` 新增 `activeTheme` 與 `customThemeSettings` 狀態
    - [x] 實作主題持久化邏輯（將選擇的主題儲存於 `localStorage`）
    - [x] 更新 `contexts/EditorContext.tsx` 以便全域存取主題設定
- [x] 任務：Conductor - User Manual Verification '階段 1' (Protocol in workflow.md) (a0b8d9d)

## 階段 2：UI 實作 - 配色盤面板與側欄整合 [checkpoint: 63759fe]
**目標：** 在側欄新增觸發按鈕，並實作可插入色號的主題配置面板。

- [x] 任務：整合側欄按鈕 (63759fe)
    - [x] 修改 `components/editor/QuickActionSidebar.tsx`，在最上方加入 `Palette` 按鈕
    - [x] 實作點擊按鈕切換「主題面板」顯示的邏輯
- [x] 任務：開發 ThemePanel 組件 (63759fe)
    - [x] 實作配色矩陣：包含品牌核心色與常用簡報色
    - [x] 整合色號點擊插入邏輯（利用 `EditorActionService` 於游標處插入 HEX）
    - [x] 實作主題選擇器 (Dropdown) 與全域設定（字體、預設背景）的 UI
- [x] 任務：Conductor - User Manual Verification '階段 2' (Protocol in workflow.md) (63759fe)

## 階段 3：混合驅動邏輯與 PPTX 引擎同步
**目標：** 實現 YAML 優先的主題讀取邏輯，並讓 PPT 導出引擎能動態套用樣式。

- [ ] 任務：實作混合主題解析
    - [ ] 更新 `services/markdownParser.ts`，從全域 YAML 提取 `theme` 欄位
    - [ ] 實作計算邏輯：當 Markdown 未定義 theme 時，回退使用 UI 選擇的主題
- [ ] 任務：動態化 PPTX 生成器樣式
    - [ ] 修改 `services/pptGenerator.ts`，將原本寫死的 `PPT_THEME` 改為根據 activeTheme 動態注入
    - [ ] 更新 `ChartRenderer` 與 `TableRenderer`，使其顏色序列能跟隨主題變動
- [ ] 任務：Conductor - User Manual Verification '階段 3' (Protocol in workflow.md)

## 階段 4：預設主題磨合與文檔更新
**目標：** 完成 4 種預設主題的細節調校，並更新版本資訊與教學。

- [ ] 任務：完成 4 套主題樣式定義
    - [ ] 調校 Midnight Cyber (霓虹風格) 的 PPTX Master 與圖表顏色
    - [ ] 調校 Academic Clean (簡約風格) 的字體與邊距預設值
    - [ ] 調校 Material Teal (翠綠風格) 的色彩系統
- [ ] 任務：版本發佈與說明更新
    - [ ] 更新 `CHANGELOG.md` 記錄 v0.8.0 變更
    - [ ] 更新 `README.md` 與 `CUSTOMIZATION.md` 加入主題管理器使用說明
- [ ] 任務：Conductor - User Manual Verification '階段 4' (Protocol in workflow.md)
