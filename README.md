# MD2PPT-EVOLUTION 🚀

![Version](https://img.shields.io/badge/version-0.10.0-orange.svg)
...
### 🎨 專業排版系統
- **動態背景生成器 (Generative Backgrounds) (v0.10+)**: 引入輕量級生成藝術算法（如 Mesh Gradients），讓每頁背景都是獨一無二的，擺脫死板的 PPT 背景圖。
- **視覺化即時調整 (Visual Tweaker)**: 點擊預覽區元素即可喚起調整視窗，即時修改文字、圖片與圖表數據，並同步回寫至 Markdown。
- **斜線指令 (Slash Commands)**: 輸入 `/` 喚起懸浮選單，快速插入圖表、佈局與元件，支援鍵盤導航與智慧游標定位。
- **全域主題管理器 (Theme Manager)**: 左側新增配色面板，支援 4 種預設主題（琥珀石墨、科技深夜、簡約學術、現代翠綠）一鍵切換，並支援客製化字體與背景。
- **演講者備忘錄 (Speaker Notes)**: 支援 `<!-- note: ... -->` 語法，可在預覽中切換顯示，並同步匯出至 PPTX 備忘錄欄位。
- **分層配置 (YAML)**: 使用 `===` 分頁，並透過每頁頂部的 YAML 區塊 (`---`) 獨立控制佈局、背景與轉場。
- **專業佈局庫**: 內建 `Grid` (網格)、`Quote` (引用)、`Center` (居中)、`Alert` (告警) 等多種響應式版面。
- **現代化表格**: 自動將 Markdown 表格轉換為具備主題色與斑馬紋 (Zebra striping) 的專業表格。

### 4. 隱私優先 (Privacy First)
- **100% 用戶端運算**: 所有解析與生成皆在您的瀏覽器中完成。
- **資料不落地**: 您的筆記與圖片**絕不會**上傳至任何伺服器。

---

## ⚡ 快速上手 (Quick Start)

### 基礎語法範例

```markdown
---
title: "我的簡報"
author: "Presenter"
---

# 第一頁：標題頁
這是簡報的開場白。

===
---
layout: two-column
---

# 第二頁：雙欄佈局

### 左邊內容
- 重點 1
- 重點 2

### 右邊內容
這裡會自動分到右側欄位。

===
---
layout: center
background: "#1e293b"
transition: zoom
---

# 第三頁：轉場頁
垂直居中 + 深色背景 + 縮放特效

<!-- note: 這是演講者備忘錄，只會出現在預覽與 PPTX 備忘錄欄位。 -->
```

### 圖表語法範例

```markdown
::: chart-bar { "title": "季度營收", "showValues": true }

| 季度 | 2024 | 2025 |
| :--- | :--- | :--- |
| Q1   | 100  | 150  |
| Q2   | 120  | 180  |

:::
```

👉 **更多進階語法與 YAML 參數，請參閱 [客製化指南 (CUSTOMIZATION.md)](CUSTOMIZATION.md)。**

---

## 🤖 AI 輔助生成 (AI Assistant)

想要快速將手邊的筆記轉為簡報嗎？您可以複製以下 Prompt 給 ChatGPT、Claude 或 Gemini，讓 AI 幫您自動排版並套用設計風格：

```text
你現在是一位精通「MD2PPT-Evolution v0.10+」的專業簡報設計師與編譯器。
專案位置：https://github.com/eric861129/MD2PPT-Evolution
詳細規範：https://github.com/eric861129/MD2PPT-Evolution/docs/AI_GENERATION_GUIDE.md

請閱讀上述指南，並根據我提供的【內容】與【風格需求】，將其轉換為嚴格符合規範的 Markdown 代碼。

### ⚠️ 核心指令 (Core Instructions)

1. **嚴格遵守語法**：你生成的代碼將直接被程式解析。任何語法錯誤（如 JSON 格式錯誤、缺少空行）都會導致簡報崩潰。
2. **逐步思考 (Chain of Thought)**：
   - 第一步：分析內容結構，規劃分頁 (使用 `===`)。
   - 第二步：選擇配色主題與背景 (Mesh Gradients)。
   - 第三步：生成 Markdown 代碼。
   - 第四步：**自我檢核** (檢查圖表空行、YAML 引號、JSON 雙引號)。
3. **只輸出代碼**：請直接輸出 Markdown 代碼區塊，不要包含過多的解釋文字。

### ⚠️ 致命錯誤預防 (Critical Rules) - 務必再三檢查！

1. **圖表 (Charts)**
   - JSON 屬性必須使用**雙引號** `"` (例如 `{"title": "Title"}`)，嚴禁單引號。
   - `::: chart-xxx` 與表格之間**必須空一行**。
   - 表格與結尾 `:::` 之間**必須空一行**。

2. **結構 (Structure)**
   - `===` 分頁符號**前後必須有空行**。
   - `===` 之後必須緊接 `---` YAML 設定區塊。
   - 第一頁必須包含全域設定 (`theme`, `transition`)。

3. **雙欄 (Two-Column)**
   - `:: right ::` 的**上一行與下一行必須是空行**。

---

### ✅ 輸出範本 (Example Output)

---
theme: midnight
transition: fade
title: "簡報標題"
---

===

---
layout: impact
bg: mesh
mesh:
  colors: ["#0F172A", "#312E81", "#4338CA"]
  seed: 888
---

# 標題
## 副標題

===

---
layout: two-column
---

## 左側重點
- 重點 A

(此處必須空行)
:: right ::
(此處必須空行)

## 右側圖表

::: chart-pie { "title": "數據分佈", "showLegend": true }

(此處必須空行)
| 項目 | 數值 |
| :--- | :--- |
| A | 60 |
| B | 40 |
(此處必須空行)

:::

===
---

**現在，請執行任務：**

【風格需求】：[在此輸入風格，例如：科技藍色系、簡約深色]
【內容】：
[在此貼上內容]
```

---

## 🛠️ 開發與部署

### 本地開發 (Local Development)

本專案基於 **React 19**, **TypeScript** 與 **Vite** 構建。

```bash
# 1. Clone 專案
git clone https://github.com/your-username/MD2PPT-Evolution.git

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

### 部署 (Deployment)

您可以將此專案部署至任何靜態網站託管服務 (GitHub Pages, Vercel, Netlify)。

```bash
# 建置生產版本
npm run build

# 產物將位於 dist/ 目錄
```

---

## 🗺️ 開發藍圖 (Roadmap)

- [x] **v0.5.0**: 快捷側欄、拖放圖片、YAML 配置系統。
- [x] **v0.6.0**: 原生圖表 (Native Charts) 支援。
- [x] **v0.7.0**: 演講者備忘錄 (Speaker Notes)。
- [x] **v0.8.0**: 全域主題管理器 (Theme Manager)。
- [x] **v0.9.0**: 斜線指令系統 (Slash Commands)。

## 🤝 貢獻 (Contributing)

我們非常歡迎社群貢獻！如果您想新增佈局或修復 Bug，請查看 [CONTRIBUTING.md](CONTRIBUTING.md) (Coming Soon)。

## 📄 授權 (License)

MIT © 2026 EricHuang