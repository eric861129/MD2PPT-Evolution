# 使用者手冊與客製化指南

本文件將引導您掌握 **MD2PPT-Evolution** 的所有進階功能。透過靈活的 YAML 配置、主題管理器與特殊指令，您可以製作出媲美專業設計師的簡報。

## 📚 目錄

1.  [全域主題管理器 (Theme Manager)](#1-全域主題管理器-theme-manager)
2.  [投影片結構與 YAML 配置](#2-投影片結構與-yaml-配置)
3.  [專業佈局圖鑑 (Layouts)](#3-專業佈局圖鑑-layouts)
4.  [原生圖表指南 (Native Charts)](#4-原生圖表指南-native-charts)
5.  [開發者指南：修改核心設計](#5-開發者指南修改核心設計)

---

## 1. 全域主題管理器 (Theme Manager)

v0.8.0 引入了強大的主題管理系統，讓您無需修改 Markdown 即可一鍵變更整份簡報的風格。

### 如何使用
1.  **側欄面板**: 點擊左側快捷列最上方的 **調色盤圖示 (Palette)** 開啟面板。
2.  **主題切換**: 提供 4 種專業預設風格：
    - `Amber Graphite`: 溫潤商務 (預設)
    - `Midnight Cyber`: 科技深夜霓虹
    - `Academic Clean`: 簡約學術
    - `Material Teal`: 現代翠綠
3.  **配色盤**: 面板提供常用色號，點擊即可將 HEX 色碼插入游標處。
4.  **客製化**: 您可以手動調整預設字體與背景底色。

---

## 2. 投影片結構與 YAML 配置

### 分頁符號 `===`
MD2PPT 使用三個等號 `===` 作為投影片的邊界。

### YAML 配置區塊 `---`
在每張投影片的頂部（緊接在 `===` 之後），您可以插入一個 YAML 區塊。

**完整參數列表：**

| 參數 | 類型 | 預設值 | 說明 |
| :--- | :--- | :--- | :--- |
| **`layout`** | `string` | `default` | 版面模式。可選值：`grid`, `center`, `quote`, `alert`, `two-column`, `impact`, `full-bg`。 |
| **`theme`** | `string` | - | 指定此份簡報的主題。例如 `theme: midnight-cyber`。 |
| **`background`** | `string` | `#FFFFFF` | 背景顏色 (Hex)。例如 `"#1e293b"`。 |
| **`bgImage`** | `string` | - | 背景圖片 URL 或 Base64。支援拖放設定。 |
| **`transition`** | `string` | `none` | 過場動畫。可選值：`fade`, `slide`, `zoom`。 |
| **`columns`** | `number` | `2` | 僅適用於 `layout: grid`，指定欄位數量 (2~4)。 |
| **`note`** | `string` | - | 演講者備忘錄內容。 |

---

## 3. 專業佈局圖鑑 (Layouts)

### `grid` (網格佈局)
- **參數**: `columns: 2` (預設), `3`, `4`
- **行為**: 採用「順序填充」邏輯，確保標題與其內容保持在一起。

### `two-column` (雙欄佈局)
- **行為**: 標題橫跨頂部，其餘內容自動平分為左右兩欄。

### `quote` (引用佈局)
- **樣式**: 自動添加裝飾性大引號，字體放大並套用襯線體。

### `alert` (告警佈局)
- **樣式**: 帶有醒目的邊框與背景色塊，適合強調重點。

---

## 4. 原生圖表指南 (Native Charts)

MD2PPT 支援將 Markdown 表格轉換為 **PowerPoint 原生圖表**（可編輯數據）。

### 支援圖表類型
- `chart-bar`: 數據比較。
- `chart-line`: 趨勢分析。
- `chart-pie`: 佔比分析。
- `chart-area`: 累積趨勢。

---

## 5. 開發者指南：修改核心設計

### 新增自定義主題
請編輯 `constants/themes.ts` 並在 `PRESET_THEMES` 中新增定義。

### 基礎配置
- `constants/theme.ts`: 定義佈局比例與字體大小基礎值。
- `services/pptGenerator.ts`: 控制 SOM 到 PPTX 的映射邏輯。

---

Happy Presenting!