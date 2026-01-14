/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

// Use a variable for backticks to avoid escaping hell in template literals
const BT = "`";

export const INITIAL_CONTENT_ZH = `---
title: "MD2PPT 簡報範例"
author: "EricHuang"
theme: "neon"
aspectRatio: "16:9"
---

# MD2PPT-Evolution

## 讓 Markdown 成為你的簡報利器

- **快速**: 專注內容，自動排版
- **靈活**: 支援程式碼、圖表與多種佈局
- **美觀**: 內建現代化深色主題

---

# 1. 投影片分割

您可以使用標準的 Markdown 標題 (H1, H2) 來做為投影片的標題。
或者使用 ${BT}---${BT} 分隔線來強制分頁。

## 這是第二張投影片 (H2)

- 這是列表項目 1
- 這是列表項目 2
    - 支援巢狀列表

---

# 2. 程式碼高亮

MD2PPT 專為技術分享者設計，支援豐富的程式碼高亮：

${BT}${BT}${BT}typescript
// 歡迎使用 MD2PPT
interface Slide {
  title: string;
  content: string[];
}

const createSlide = (title: string): Slide => {
  return { title, content: [] };
}
${BT}${BT}${BT}

---

# 3. 支援圖表 (Mermaid)

直接在簡報中繪製流程圖：

${BT}${BT}${BT}mermaid
graph LR
    Markdown --> Parser
    Parser --> AST
    AST --> PPTX
${BT}${BT}${BT}

---

# 4. 結語

感謝您的使用！
按一下右上角的 **【匯出 PPT】** 按鈕即可取得檔案。
`;

export const INITIAL_CONTENT_EN = `---
title: "MD2PPT Demo"
author: "EricHuang"
theme: "neon"
aspectRatio: "16:9"
---

# MD2PPT-Evolution

## Turn Markdown into Slides Instantly

- **Fast**: Focus on content, auto-layout
- **Flexible**: Code blocks, charts, and layouts
- **Beautiful**: Modern dark themes built-in

---

# 1. Slide Splitting

Use standard Markdown headers (H1, H2) as slide titles.
Or use ${BT}---${BT} horizontal rules to force a new slide.

## This is Slide 2 (H2)

- List item 1
- List item 2
    - Nested list support

---

# 2. Syntax Highlighting

Designed for tech presenters:

${BT}${BT}${BT}typescript
// Welcome to MD2PPT
interface Slide {
  title: string;
  content: string[];
}

const createSlide = (title: string): Slide => {
  return { title, content: [] };
}
${BT}${BT}${BT}

---

# 3. Charts (Mermaid)

Draw flowcharts directly:

${BT}${BT}${BT}mermaid
graph LR
    Markdown --> Parser
    Parser --> AST
    AST --> PPTX
${BT}${BT}${BT}

---

# 4. Conclusion

Thank you!
Click the **[Export PPT]** button in the top right corner.
`;
