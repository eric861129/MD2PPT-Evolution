# 客製化指南 (Customization Guide)

感謝您使用 **MD2PPT-EVOLUTION**！本專案採用高度模組化的架構，您可以輕鬆調整樣式、新增語法或修改 PowerPoint 輸出格式。

## 🎯 目錄

1. [修改設計系統 (字體、大小與間距)](#1-修改設計系統-字體大小與間距)
2. [調整 PPT 輸出樣式](#2-調整-ppt-輸出樣式)
3. [新增 Markdown 語法](#3-新增-markdown-語法)
4. [修改預覽介面 (Preview UI)](#4-修改預覽介面-preview-ui)

---

## 1. 修改設計系統 (字體、大小與間距)

專案中所有的核心視覺設定都集中在 `constants/theme.ts`。這是最推薦的客製化起點，因為修改這裡會同時影響 PPT 輸出的多個部分。

**檔案路徑**: `constants/theme.ts`

### 修改字體與大小
```typescript
export const PPT_THEME = {
  FONT_SIZES: {
    BODY: 18,    // 內文字體 (18pt)
    TITLE: 32,   // 標題 (32pt)
    CODE: 14,    // 程式碼 (14pt)
    // ...
  }
};
```

### 修改間距與佈局
您可以輕鬆調整版面配置：
```typescript
export const PPT_THEME = {
  LAYOUT: {
    MARGIN: 0.5, // 邊距 (英吋)
  }
};
```

---

## 2. 調整 PPT 輸出樣式

PPT 的生成邏輯位於 `services/pptGenerator.ts` 與 `services/ppt/` 目錄下。

**檔案路徑**: `services/pptGenerator.ts`

如果您想修改特定區塊的細節（例如改變投影片的背景色或預設佈局），請修改生成器邏輯：

```typescript
// 設定預設版面
pptx.layout = "LAYOUT_16x9";
```

*(註：詳細的 Builder 模式目前正在開發中)*

---

## 3. 新增 Markdown 語法

如果您需要支援新的語法（例如：螢光筆標記 `==text==`），需要修改三個核心位置：

### 步驟 1: 定義樣式類型
在 `utils/styleParser.ts` 中新增類型與 Regex。

### 步驟 2: 實作 PPT 輸出邏輯
在 `services/pptGenerator.ts` (或未來的 Builder) 中加入處理邏輯。

### 步驟 3: 實作網頁預覽邏輯
**檔案路徑**: `components/editor/PreviewRenderers.tsx`

在 `RenderRichText` 元件中加入 React 渲染邏輯：
```typescript
case InlineStyleType.HIGHLIGHT:
  return <span key={i} className="bg-yellow-200">{segment.content}</span>;
```

---

## 4. 修改預覽介面 (Preview UI)

預覽區域的元件已拆分至 `components/editor/` 目錄下：

- **`EditorHeader.tsx`**: 頂部工具列。
- **`EditorPane.tsx`**: 左側編輯器。
- **`PreviewPane.tsx`**: 右側預覽容器。
- **`PreviewRenderers.tsx`**: 具體的區塊渲染邏輯（標題、程式碼、表格等）。

預覽介面主要使用 **Tailwind CSS**。若要修改預覽效果，請編輯 `PreviewRenderers.tsx`。

---

## ❓ 常見問題

**Q: 為什麼修改了 `theme.ts` 的顏色，網頁預覽沒有變？**
A: `theme.ts` 主要控制 **PPT 匯出** 的視覺數值。網頁預覽主要依賴 `PreviewRenderers.tsx` 中的 Tailwind CSS class。若要追求完全的 WYSIWYG，建議兩者同步修改。

**Q: 如何新增自定義的頁面尺寸？**
A: 請修改 `hooks/useMarkdownEditor.ts` 或 `constants/meta.ts` 中的設定。

---

Happy Writing & Coding!
