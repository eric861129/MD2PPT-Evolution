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
bg: "#1A1A1A"
---

# MD2PPT-Evolution
## 讓 Markdown 成為你的專業簡報利器

--- { "layout": "impact", "bg": "#D24726" }

# 歡迎使用
## 全新 Evolution 引擎

--- { "layout": "two-column" }

# 1. 雙欄排版功能

### 內容優勢
- 自動平分區塊內容
- 適合左右對比
- 保持商務美感

### 技術細節
- 偵測 ${BT}two-column${BT} 標籤
- 自動計算內容高度
- 支援圖片與清單混排

--- { "layout": "full-bg" }

![背景圖片](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

# 2. 全螢幕背景
## 讓視覺更具衝擊力

---

# 3. 程式碼高亮與角色對話

${BT}${BT}${BT}typescript
// 簡潔的 PPT 生成代碼
const ppt = new PptxGenJS();
ppt.layout = "LAYOUT_16x9";
${BT}${BT}${BT}

Gemini ":: 這是靠左的角色對話
讀者 ::" 這是靠右的角色對話
系統 :": 這是置中的系統訊息

--- { "bg": "#000000" }

# 4. 結語

感謝您的使用！
點擊右上角的 **【匯出 PPT】** 即可取得這份簡報。
`;

export const INITIAL_CONTENT_EN = `---
title: "MD2PPT Professional Demo"
author: "EricHuang"
bg: "#1A1A1A"
---

# MD2PPT-Evolution
## Turn Markdown into Professional Slides

--- { "layout": "impact", "bg": "#D24726" }

# Welcome to
## Evolution Engine

--- { "layout": "two-column" }

# 1. Two-Column Layout

### Content Advantages
- Auto-splitting content
- Perfect for comparisons
- Business-ready aesthetics

### Tech Specs
- Detects ${BT}two-column${BT} tag
- Auto-calculates heights
- Supports mixed blocks

--- { "layout": "full-bg" }

![BG](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

# 2. Full Background
## Higher Visual Impact

---

# 3. Code & Dialogues

${BT}${BT}${BT}typescript
// Clean PPT Generation
const ppt = new PptxGenJS();
ppt.layout = "LAYOUT_16x9";
${BT}${BT}${BT}

Gemini ":: Left-aligned dialogue
Reader ::" Right-aligned dialogue
System :": Centered system message

--- { "bg": "#000000" }

# 4. Conclusion

Thank you!
Click **[Export PPT]** to download this deck.
`;