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
---
layout: quote
---

> "好的設計是盡可能少的設計。"
- Dieter Rams

===
---
layout: alert
---

# 3. 重點提示
## 使用 Alert 佈局來強調您的核心結論或注意事項。

===
---
layout: two-column
---

# 4. 專業表格與互動

### 現代化表格
::: table-modern
| 功能 | 支援度 | 說明 |
| :--- | :---: | :--- |
| 原生圖表 | ⭐⭐⭐ | Bar, Line, Pie |
| 拖放圖片 | ⭐⭐⭐ | 自動轉 Base64 |
| YAML 配置 | ⭐⭐⭐ | 每一頁獨立設定 |
:::

### 試試看這些操作！
1. **拖放圖片**：直接把電腦裡的圖片拖進來。
2. **快捷側欄**：點擊左側按鈕，一鍵插入內容。
3. **更換背景**：把圖片拖到右邊的預覽卡片上！

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
---
layout: quote
---

> "Good design is as little design as possible."
- Dieter Rams

===
---
layout: alert
---

# 3. Important Note
## Use the Alert layout to highlight key takeaways or warnings.

===
---
layout: two-column
---

# 4. Tables & Interactions

### Modern Table
::: table-modern
| Feature | Level | Note |
| :--- | :---: | :--- |
| Native Charts | ⭐⭐⭐ | Bar, Line, Pie |
| Drag & Drop | ⭐⭐⭐ | Auto Base64 |
| YAML Config | ⭐⭐⭐ | Per-slide settings |
:::

### Try These!
1. **Drag & Drop**: Drag an image directly into the editor.
2. **Sidebar**: Use the left sidebar to insert templates.
3. **Set Background**: Drag an image onto a slide preview card!

===
---
layout: center
background: "#1C1917"
---

# Thank You
## MD2PPT-Evolution

`;
