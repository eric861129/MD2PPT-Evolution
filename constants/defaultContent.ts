/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// Use a variable for backticks to avoid escaping hell in template literals
const BT = "`";

export const INITIAL_CONTENT_ZH = `---
title: "MD2PPT 全功能展示"
author: "EricHuang"
bg: "#FFFFFF"
transition: fade
---

# MD2PPT-Evolution
## 把 Markdown 變成專業簡報，就是這麼簡單

===
---
layout: impact
bg: "#EA580C"
transition: slide
---

# 歡迎體驗 v0.6.0
## 原生圖表．拖放管理．極致排版

<!-- note:
歡迎使用 MD2PPT-Evolution！
這一頁展示了我們的品牌色與轉場效果。
您可以點擊頂部的「備忘錄圖示」來查看這段文字。
-->

===
---
layout: grid
columns: 2
transition: zoom
---

# 1. 商業圖表展示 (Bar & Line)

::: chart-bar { "title": "季度營收比較", "showValues": true }

| 季度 | 2024年 | 2025年 |
| :--- | :--- | :--- |
| Q1 | 120 | 150 |
| Q2 | 135 | 180 |
| Q3 | 140 | 210 |
| Q4 | 160 | 240 |

:::

::: chart-line { "title": "用戶成長趨勢" }

| 月份 | 活躍用戶 | 新增用戶 |
| :--- | :--- | :--- |
| 1月 | 5000 | 1200 |
| 2月 | 6200 | 1500 |
| 3月 | 8000 | 2100 |
| 4月 | 9500 | 1800 |

:::

===
---
layout: grid
columns: 2
---

# 2. 數據分析展示 (Pie & Area)

::: chart-pie { "title": "市場佔有率", "showLegend": true }

| 品牌 | 佔比 |
| :--- | :--- |
| Brand A | 45 |
| Brand B | 30 |
| Brand C | 15 |
| Others | 10 |

:::

::: chart-area { "title": "累積流量統計" }

| 時間 | 流量 |
| :--- | :--- |
| 08:00 | 100 |
| 12:00 | 450 |
| 16:00 | 890 |
| 20:00 | 1200 |

:::

===

# 3. 程式碼高亮支援

${BT}${BT}${BT}typescript
// 支援多種語言語法高亮
const hello = (name: string) => {
  console.log("Hello, " + name + "!");
};

// 匯出後仍保持可編輯文字格式
export default hello;
${BT}${BT}${BT}

===

# 4. 角色對話模式

User ":: 請問這個怎麼用？

AI ::" 非常簡單，直接在 Markdown 中寫下角色名稱並加上引號與冒號即可！

系統 :": 系統提示：角色對話適合用於技術演示或模擬對談場景。

===
---
layout: quote
---

> "好的設計是盡可能少的設計。"
- Dieter Rams

===
---
layout: alert
---

# 5. 重點提示
## 使用 Alert 佈局來強調您的核心結論或注意事項。

===
---
layout: grid
columns: 2
---

# 6. 專業表格與互動

### 專業數據表格
| 功能 | 支援度 | 說明 |
| :--- | :---: | :--- |
| 原生圖表 | ⭐⭐⭐ | Bar, Line, Pie |
| 拖放圖片 | ⭐⭐⭐ | 自動轉 Base64 |
| YAML 配置 | ⭐⭐⭐ | 每一頁獨立設定 |

### 試試看這些操作！
1. **拖放圖片**：直接把電腦裡的圖片拖進來。
2. **快捷側欄**：點擊左側按鈕，一鍵插入內容。
3. **更換背景**：把圖片拖到右邊的預覽卡片上！
4. **斜線指令**：輸入 / 呼叫選單，快速插入圖表或佈局！

===
---
bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
---

# 7. 背景圖片演示
## 透過 YAML 設定背景，內容可自由疊加

===
---
layout: center
background: "#1C1917"
---

# 感謝您的使用
## MD2PPT-Evolution
`;

export const INITIAL_CONTENT_EN = `---
title: "MD2PPT Feature Showcase"
author: "EricHuang"
bg: "#FFFFFF"
transition: fade
---

# MD2PPT-Evolution
## Turning Markdown into Professional Slides

===
---
layout: impact
bg: "#EA580C"
transition: slide
---

# Welcome to v0.6.0
## Native Charts . Drag & Drop . Pro Layouts

<!-- note:
Welcome to MD2PPT-Evolution!
This page showcases our brand color and slide transitions.
Try clicking the StickyNote icon in the header to see these notes!
-->

===
---
layout: grid
columns: 2
transition: zoom
---

# 1. Business Charts (Bar & Line)

::: chart-bar { "title": "Quarterly Revenue", "showValues": true }

| Qtr | 2024 | 2025 |
| :--- | :--- | :--- |
| Q1 | 120 | 150 |
| Q2 | 135 | 180 |
| Q3 | 140 | 210 |
| Q4 | 160 | 240 |

:::

::: chart-line { "title": "User Growth Trend" }

| Month | Active | New |
| :--- | :--- | :--- |
| Jan | 5000 | 1200 |
| Feb | 6200 | 1500 |
| Mar | 8000 | 2100 |
| Apr | 9500 | 1800 |

:::

===
---
layout: grid
columns: 2
---

# 2. Data Analysis (Pie & Area)

::: chart-pie { "title": "Market Share", "showLegend": true }

| Brand | Share |
| :--- | :--- |
| Brand A | 45 |
| Brand B | 30 |
| Brand C | 15 |
| Others | 10 |

:::

::: chart-area { "title": "Cumulative Traffic" }

| Time | Traffic |
| :--- | :--- |
| 08:00 | 100 |
| 12:00 | 450 |
| 16:00 | 890 |
| 20:00 | 1200 |

:::

===

# 3. Code Highlighting Support

${BT}${BT}${BT}typescript
// Multi-language syntax highlighting
const hello = (name: string) => {
  console.log("Hello, " + name + "!");
};

// Remains as editable text in PPTX
export default hello;
${BT}${BT}${BT}

===

# 4. Character Dialogue Mode

User ":: How does this work?

AI ::" It's simple! Just write the character name followed by double colons and quotes.

System :": System: Dialogues are perfect for technical walkthroughs.

===
---
layout: quote
---

> "Good design is as little design as possible."
- Dieter Rams

===
---
layout: alert
---

# 5. Important Note
## Use the Alert layout to highlight key takeaways or warnings.

===
---
layout: grid
columns: 2
---

# 6. Tables & Interactions

### Professional Tables
| Feature | Level | Note |
| :--- | :---: | :--- |
| Native Charts | ⭐⭐⭐ | Bar, Line, Pie |
| Drag & Drop | ⭐⭐⭐ | Auto Base64 |
| YAML Config | ⭐⭐⭐ | Per-slide settings |

### Try These!
1. **Drag & Drop**: Drag an image directly into the editor.
2. **Sidebar**: Use the left sidebar to insert templates.
3. **Set Background**: Drag an image onto a slide preview card!
4. **Slash Command**: Type / to open the menu and insert charts instantly!

===
---
bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
---

# 7. Background Image
## Set via YAML, text layers on top

===
---
layout: center
background: "#1C1917"
---

# Thank You
## MD2PPT-Evolution
`;
