# 軌跡規格：全域主題管理器 (theme_manager_v080)

## 1. 概述 (Overview)
此軌跡旨在建立一個完整的主題管理系統，讓使用者能靈活控制匯出 PPTX 的視覺風格。系統將包含一個整合於側欄的「配色與主題面板」，支援預設主題切換、一鍵插入色號，以及整份簡報的樣式客製化（字體、主色調等）。

## 2. 功能需求 (Functional Requirements)

### 2.1 主題驅動架構 (Hybrid Theme Engine)
- **優先順序**：優先讀取 Markdown 全域 YAML Frontmatter 中的 `theme` 欄位（例如：`theme: midnight`），若無定義則採用 UI 選擇器的設定。
- **支援主題**：
    - `amber-graphite` (預設：商務暖色)
    - `midnight-cyber` (科技深藍)
    - `academic-clean` (簡約學術)
    - `material-teal` (現代翠綠)

### 2.2 配色盤面板 (Color & Theme Panel)
- **觸發機制**：在 `QuickActionSidebar` 最上方新增一個獨立按鈕（Icon: `Palette`），點擊後以側彈窗或內嵌面板形式顯示。
- **內容組合**：
    - **色號點擊插入**：提供「品牌核心色」與「專業簡報常用色」矩陣，點擊色塊自動在編輯器游標處插入 HEX 字串。
    - **自定義取色**：整合原生 HTML5 Color Picker 或精美組件，允許輸入/挑選任意顏色。
    - **全域配置項**：提供 UI 介面設定整份 PPT 的「預設字體 (Font Face)」與「預設背景色」。

### 2.3 PPTX 引擎整合
- **動態樣式注入**：修改 `services/pptGenerator.ts`，使其在生成過程中從 `SlideConfig` 或全域狀態讀取主題參數，動態覆蓋 `PPT_THEME` 的常數值。
- **圖表配色同步**：圖表的顏色序列將根據所選主題自動變換（例如：Midnight 主題下圖表呈現霓虹色系）。

## 3. 非功能需求 (Non-Functional Requirements)
- **狀態持久化**：使用者的主題與自定義色彩設定應儲存於 `localStorage`。
- **介面一致性**：配色面板的 UI 需符合專案目前的「琥珀與石墨」商務美學。

## 4. 驗收標準 (Acceptance Criteria)
- [ ] 側欄最上方出現 `Palette` 按鈕，點擊能正確切換面板。
- [ ] 點擊面板內的色塊，編輯器能即時插入對應色號。
- [ ] 在全域 YAML 設定 `theme: academic-clean` 後，匯出的 PPT 呈現對應的簡約風格。
- [ ] 使用者在 UI 設定的「預設字體」能正確反映在匯出的 PPT 中。
- [ ] 支援至少 4 種預設主題。

## 5. 超出範圍 (Out of Scope)
- 使用者上傳自定義 `.pptx` 母片作為主題（目前僅支援程式碼定義的主題）。
- 針對單一元素（如某個特定圓形）的複雜漸層設定。
