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

# 歡迎體驗 v0.12.5
## 演講模式．手機遙控．品牌系統

<!-- note:
歡迎使用 MD2PPT-Evolution！
這一頁展示了我們的品牌色與轉場效果。
您可以點擊頂部的「備忘錄圖示」來查看這段文字。
-->

===
---
layout: grid
columns: 2
---

# 1. 專業演講模式

### 如何開始？
1. 點擊工具列 **「Present」**。
2. 將新視窗拖到投影幕。
3. 原視窗自動切換為主控台。

### 核心優勢
- **雙螢幕同步**：即時掌控投影。
- **演講備忘錄**：閱讀重點提示。
- **計時器**：精準掌控時間。

===
---
layout: two-column
---

# 2. 手機就是簡報筆 📱

### 掃描即連
掃描主控台 QR Code 即可連線。

### 遙控功能
- **翻頁**：控制上一頁 / 下一頁。
- **黑屏**：切換觀眾視窗。
- **同步**：手機閱讀備忘錄。


:: right ::


### 技術與隱私
- **P2P 連線**：裝置間直接通訊。
- **無伺服器**：內容絕不落地。
- **100% 瀏覽器驅動**。

===
---
layout: grid
columns: 2
transition: zoom
---

# 3. 商業圖表展示 (Bar & Line)

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

# 4. 數據分析展示 (Pie & Area)

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

# 5. 程式碼高亮支援

${BT}${BT}${BT}typescript
// 支援多種語言語法高亮
const hello = (name: string) => {
  console.log("Hello, " + name + "!");
};

// 匯出後仍保持可編輯文字格式
export default hello;
${BT}${BT}${BT}

===

# 6. 角色對話模式

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

# 7. 重點提示
## 使用 Alert 佈局來強調您的核心結論或注意事項。

===
---
layout: grid
columns: 2
---

# 8. 專業表格與互動

### 數據呈現
| 功能 | 支援度 | 說明 |
| :--- | :---: | :--- |
| 原生圖表 | ⭐⭐⭐ | PPT 內可編輯 |
| 拖放圖片 | ⭐⭐⭐ | 自動轉 Base64 |
| YAML 配置 | ⭐⭐⭐ | 每頁獨立設定 |


:: right ::


### 試試看這些操作！

1. **拖放圖片**：直接把圖片拖進來。
2. **快捷側欄**：點擊左側按鈕插入。
3. **更換背景**：圖片拖到預覽卡片！
4. **斜線指令**：輸入 / 呼叫選單！

===

# 9. 圖片互動演示

## 點擊下方圖片即可開啟 Tweaker 進行即時調整

![Unsplash Demo](https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop)

===

---
bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
---

# 10. 背景圖片演示
## 透過 YAML 設定背景，內容可自由疊加

===
---
layout: center
background: "#1C1917"
---

# 感謝您的使用
## MD2PPT-Evolution

===
---
bg: mesh
mesh:
  colors: ["#4158D0", "#C850C0", "#FFCC70"]
  seed: 12345
---

# 11. 動態背景展示
## 這頁使用了 Mesh Gradient 生成背景。
## 點擊背景空白處即可開啟 Tweaker 調整顏色！
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

# Welcome to v0.12.5
## Presenter Mode . Mobile Remote . Branding

<!-- note:
Welcome to MD2PPT-Evolution!
This page showcases our brand color and slide transitions.
Try clicking the StickyNote icon in the header to see these notes!
-->

===
---
layout: grid
columns: 2
---

# 1. Pro Presenter Mode

### How to Start?
1. Click **"Present"** in top bar.
2. Drag new window to projector.
3. Your window becomes console.

### Core Benefits
- **Dual-Screen Sync**: Instant control.
- **Speaker Notes**: Read tips privately.
- **Timer**: Keep track of your speed.

===
---
layout: two-column
---

# 2. Phone as a Remote 📱

### Scan to Connect
Scan QR code on your console to connect phone instantly.

### Full Control
- **Nav**: Previous / Next slides.
- **Blackout**: Control attention.
- **Notes**: Read cues on phone.


:: right ::


### Privacy & Tech
- **P2P Tech**: Direct connection.
- **Serverless**: Content stays local.
- **100% Browser Driven**.

===
---
layout: grid
columns: 2
transition: zoom
---

# 3. Business Charts (Bar & Line)

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

# 4. Data Analysis (Pie & Area)

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

# 5. Code Highlighting Support

${BT}${BT}${BT}typescript
// Multi-language syntax highlighting
const hello = (name: string) => {
  console.log("Hello, " + name + "!");
};

// Remains as editable text in PPTX
export default hello;
${BT}${BT}${BT}

===

# 6. Character Dialogue Mode

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

# 7. Important Note
## Use the Alert layout to highlight key takeaways or warnings.

===
---
layout: grid
columns: 2
---

# 8. Tables & Interactions

### Data View
| Feature | Level | Note |
| :--- | :---: | :--- |
| Native Charts | ⭐⭐⭐ | PPT Editable |
| Drag & Drop | ⭐⭐⭐ | Auto Base64 |
| YAML Config | ⭐⭐⭐ | Per-slide |


:: right ::


### Try These!

1. **Drag & Drop**: Drag image into editor.
2. **Sidebar**: Use the left sidebar.
3. **Set Background**: Drag onto a card!
4. **Slash Command**: Type / for menu!

===

# 9. Image Interaction

## Click the image below to open the Tweaker for real-time adjustments.

![Unsplash Demo](https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop)

===

---
bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
---

# 10. Background Image
## Set via YAML, text layers on top

===
---
layout: center
background: "#1C1917"
---

# Thank You
## MD2PPT-Evolution

===
---
bg: mesh
mesh:
  colors: ["#4158D0", "#C850C0", "#FFCC70"]
  seed: 12345
---

# 11. Generative Backgrounds
## This slide uses a Mesh Gradient background.
## Click on any empty space to tweak the colors!
`;