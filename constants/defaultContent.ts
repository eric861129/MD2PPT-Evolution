/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// Use a variable for backticks to avoid escaping hell in template literals
const BT = "`";

export const INITIAL_CONTENT_ZH = `---
title: "MD2PPT 專業排版演示"
author: "EricHuang"
bg: "#FFFFFF"
---

# MD2PPT-Evolution
## 分離設定與內容，讓排版更自由

===
---
layout: impact
bg: "#D24726"
---

# 歡迎使用
## 全新 Evolution 引擎

===
---
layout: center
background: "#1e293b"
---

# 1. 居中佈局
## 內容會垂直且水平居中，適合轉場頁。

===
---
layout: grid
columns: 3
---

# 2. 網格佈局 (3 欄)

### 左側欄位
這是第一欄的內容。

### 中間欄位
這是第二欄的內容。

### 右側欄位
這是第三欄的內容。

===
---
layout: quote
---

> "創造未來的最好方式就是去發明它。"
- Alan Kay

===
---
layout: alert
---

# 3. 告警佈局
## 這是一個醒目的提示，適合強調核心結論。

===
---
layout: two-column
---

# 4. 專業表格樣式

::: table-modern
| 功能 | 支援度 | 備註 |
| :--- | :---: | :--- |
| YAML 配置 | 高 | 支援背景、佈局 |
| 多樣佈局 | 高 | Grid, Quote, Center |
| 自動分頁 | 高 | 使用 === 語法 |
:::

===
---
layout: center
background: "#FFF7ED"
---

# 5. 原生圖表支援 (v0.6)

::: chart-bar { "title": "季營收成長", "showLegend": true }

| 季度 | 2024年 | 2025年 |
| :--- | :--- | :--- |
| Q1 | 100 | 150 |
| Q2 | 120 | 180 |
| Q3 | 130 | 200 |

:::

===
---
bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
---

# 6. 背景圖片演示
## 透過 YAML 設定背景，內容可自由疊加

===

# 7. 程式碼高亮支援

${BT}${BT}${BT}typescript
// 現在您可以使用 === 作為分頁符號
const slide = {
  metadata: { layout: 'impact' },
  content: '# Hello'
};
${BT}${BT}${BT}

===

# 7. 角色對話模式

Gemini ":: 這是靠左的角色對話

讀者 ::" 這是靠右的角色對話

系統 :": 這是置中的系統訊息

===
---
bg: "#333333"
---

# 8. 結語

感謝您的使用！
`;

export const INITIAL_CONTENT_EN = `---
title: "MD2PPT Professional Demo"
author: "EricHuang"
bg: "#FFFFFF"
---

# MD2PPT-Evolution
## Separate Config from Content

===
---
layout: impact
bg: "#D24726"
---

# Welcome
## YAML Driven Configuration

===
---
layout: center
background: "#1e293b"
---

# 1. Center Layout
## Content is vertically and horizontally centered.

===
---
layout: grid
columns: 3
---

# 2. Grid Layout (3 Cols)

### Left
Column 1 content.

### Middle
Column 2 content.

### Right
Column 3 content.

===
---
layout: quote
---

> "The best way to predict the future is to invent it."
- Alan Kay

===
---
layout: alert
---

# 3. Alert Layout
## An eye-catching slide for important announcements.

===
---
layout: two-column
---

# 4. Modern Table Styling

::: table-modern
| Feature | Support | Note |
| :--- | :---: | :--- |
| YAML Config | High | BG, Layout |
| New Layouts | High | Grid, Quote, etc. |
| Separator | High | Use === syntax |
:::

===
---
layout: center
background: "#FFF7ED"
---

# 5. Native Charts (v0.6)

::: chart-bar { "title": "Quarterly Growth", "showLegend": true }

| Quarter | 2024 | 2025 |
| :--- | :--- | :--- |
| Q1 | 100 | 150 |
| Q2 | 120 | 180 |
| Q3 | 130 | 200 |

:::

===
---
bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
---

# 6. Background Image
## Set via YAML, text layers on top

===

# 7. Syntax Highlighting

${BT}${BT}${BT}typescript
// You can now use === as slide separator
const config = {
  separator: "===",
  metadata: "YAML"
};
${BT}${BT}${BT}

===

# 7. Character Dialogues

Gemini ":: Left-aligned dialogue

Reader ::" Right-aligned dialogue

System :": Centered system message

===
---
bg: "#333333"
---

# 8. Conclusion

Thank you!
`;