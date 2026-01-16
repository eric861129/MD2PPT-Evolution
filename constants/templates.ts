/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

export const ACTION_TEMPLATES = {
  // Structure
  INSERT_SLIDE: `

===
---
layout: default
---

# $cursor`,
  
  // Layouts
  LAYOUT_GRID: `

===
---
layout: grid
columns: 2
---

# Grid Slide

Column 1 content...

Column 2 content...$cursor`,
  LAYOUT_QUOTE: `

===
---
layout: quote
---

> "$cursor"
- Author`,
  LAYOUT_ALERT: `

===
---
layout: alert
---

# Alert Title

$cursor`,
  
  // Components
  INSERT_TABLE: `

::: table-modern
| Header 1 | Header 2 |
| :--- | :--- |
| $cursor | Cell 2 |
:::

`,
  INSERT_IMAGE: `![$cursor](https://source.unsplash.com/random/800x600)`,
  INSERT_NOTE: `

<!-- note:
$cursor
-->
`,
  
  // Charts
  INSERT_CHART_BAR: `\n\n::: chart-bar { "title": "Quarterly Revenue", "showLegend": true }\n\n| Quarter | 2024 | 2025 |\n| :--- | :--- | :--- |\n| Q1 | 100 | 150 |\n| Q2 | 120 | 180 |\n| Q3 | 130 | 200 |\n\n:::\n\n`,
  INSERT_CHART_PIE: `\n\n::: chart-pie { "title": "Market Share", "showValues": true }\n\n| Category | Share |\n| :--- | :--- |\n| Mobile | 45 |\n| Desktop | 35 |\n| Tablet | 20 |\n\n:::\n\n`
};

