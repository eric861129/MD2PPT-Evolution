# 使用者手冊與客製化指南

本文件將引導您掌握 **MD2PPT-Evolution** 的所有進階功能。透過靈活的 YAML 配置與特殊指令，您可以製作出媲美專業設計師的簡報。

## 📚 目錄

1.  [投影片結構與 YAML 配置](#1-投影片結構與-yaml-配置)
2.  [專業佈局圖鑑 (Layouts)](#2-專業佈局圖鑑-layouts)
3.  [原生圖表指南 (Native Charts)](#3-原生圖表指南-native-charts)
4.  [進階元件與樣式](#4-進階元件與樣式)

---

## 1. 投影片結構與 YAML 配置

### 分頁符號 `===
`
MD2PPT 使用三個等號 `===` 作為投影片的邊界。這比標準的 `---` 更醒目，能有效區分「分頁」與「YAML 設定」。

### YAML 配置區塊 `---`
在每張投影片的頂部（緊接在 `===` 之後），您可以插入一個 YAML 區塊來定義該頁的屬性。

**完整參數列表：**

| 參數 | 類型 | 預設值 | 說明 |
| :--- | :--- | :--- | :--- |
| **`layout`** | `string` | `default` | 版面模式。可選值：`grid`, `center`, `quote`, `alert`, `two-column`, `impact`, `full-bg`。 |
| **`background`** | `string` | `#FFFFFF` | 背景顏色 (Hex)。例如 `"#1e293b"` (深藍色)。 |
| **`bgImage`** | `string` | - | 背景圖片 URL 或 Base64。建議使用拖放功能自動設定。 |
| **`transition`** | `string` | `none` | 過場動畫。可選值：`fade`, `slide`, `zoom`, `morph` (部分支援)。 |
| **`columns`** | `number` | `2` | 僅適用於 `layout: grid`，指定網格的欄位數量 (2~4)。 |
| **`note`** | `string` | - | 演講者備忘錄內容。 |

**範例：**
```markdown
===
---
layout: center
background: "#000000"
transition: fade
---
# 這是深色背景的標題頁
```

---

## 2. 專業佈局圖鑑 (Layouts)

### `grid` (網格佈局)
自動將內容分配到多個欄位。適合展示特點、團隊成員或圖片集。
- **參數**: `columns: 2` (預設), `3`, `4`
- **行為**: 採用「順序填充 (Sequential Filling)」邏輯，將內容依序填入欄位。

### `two-column` (雙欄佈局)
經典的左文右圖或左右對照。
- **行為**: 標題 (`H1/H2`) 橫跨頂部，其餘內容自動平分為左右兩欄。

### `quote` (引用佈局)
專為名言佳句設計。
- **樣式**: 自動添加裝飾性大引號，字體放大並套用襯線體 (Serif)。
- **建議格式**: 引用內容寫在第一行，作者寫在第二行 (可使用 `- 作者名`)。

### `alert` (告警佈局)
用於強調核心結論、警告或提示。
- **樣式**: 帶有醒目的邊框與背景色塊，通常為置中顯示。

---

## 3. 原生圖表指南 (Native Charts)

MD2PPT 支援將 Markdown 表格轉換為 **PowerPoint 原生圖表**。這意味著您可以在 PPT 中點擊圖表來編輯數據！

### 通用語法
使用容器指令 `::: chart-[type]` 包裹標準表格。

```markdown
::: chart-bar { "title": "圖表標題", "showLegend": true }
| 類別 (X軸) | 數值 1 | 數值 2 |
| :--- | :--- | :--- |
| A | 10 | 20 |
| B | 15 | 25 |
:::
```

### 支援圖表類型

| 類型 | 指令 | 適用場景 | 數據格式要求 |
| :--- | :--- | :--- | :--- |
| **長條圖** | `chart-bar` | 數據比較 | 第一列為類別，後續列為數值。 |
| **折線圖** | `chart-line` | 趨勢分析 | 第一列為時間/順序，後續列為數值。 |
| **圓餅圖** | `chart-pie` | 佔比分析 | 僅使用**第一列數值**作為數據，第一列文字作為標籤。 |
| **區域圖** | `chart-area` | 累積趨勢 | 同折線圖，但下方有填色。 |

### 配置參數 (JSON)
在指令後方可選填 JSON 參數：
- `title`: (string) 圖表標題。
- `showLegend`: (boolean) 是否顯示圖例。
- `showValues`: (boolean) 是否在圖上顯示具體數值。
- `colors`: (string) 配色方案 (目前預設為 `theme`)。

---

## 4. 進階元件與樣式

### 現代化表格
所有標準 Markdown 表格在匯出時，預設皆會套用 **Modern Style**：
- **標題列**: 使用主題色背景 (如琥珀橘) 與白色文字。
- **資料列**: 使用斑馬紋 (Zebra striping) 交錯底色，提升易讀性。
- **對齊**: 依據 Markdown 的 `:---:` 語法自動對齊。

### 程式碼高亮
支援多種語言的語法高亮 (Syntax Highlighting)。在 PPT 中會渲染為帶有背景色的文字方塊，且文字**保持可編輯**。

```markdown
```typescript
const hello = "world";
```
```

---

**MD2PPT-Evolution** 致力於讓您的簡報製作流程更流暢。Happy Presenting!
