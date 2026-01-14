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
layout: two-column
---

# 1. 雙欄排版功能

### 內容優勢
- 內容與背景圖片完全分離
- 這是內容中的圖片：
![內容圖](https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop)

===
---
layout: full-bg
bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
---

# 2. 背景圖片演示
## 透過 YAML 設定背景，內容可自由疊加

===

# 3. 程式碼高亮支援

${BT}${BT}${BT}typescript
// 現在您可以使用 === 作為分頁符號
const slide = {
  metadata: { layout: 'impact' },
  content: '# Hello'
};
${BT}${BT}${BT}

===

# 4. 角色對話模式

Gemini ":: 這是靠左的角色對話

讀者 ::" 這是靠右的角色對話

系統 :": 這是置中的系統訊息

===
---
bg: "#333333"
---

# 5. 結語

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
layout: two-column
---

# 1. Two-Column Layout

### Advantages
- Backgrounds & content images are separated
- Here is a content image:
![Content](https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop)

===
---
layout: full-bg
bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
---

# 2. Background Image
## Set via YAML, text layers on top

===

# 3. Syntax Highlighting

${BT}${BT}${BT}typescript
// You can now use === as slide separator
const config = {
  separator: "===",
  metadata: "YAML"
};
${BT}${BT}${BT}

===

# 4. Character Dialogues

Gemini ":: Left-aligned dialogue

Reader ::" Right-aligned dialogue

System :": Centered system message

===
---
bg: "#333333"
---

# 5. Conclusion

Thank you!
`;