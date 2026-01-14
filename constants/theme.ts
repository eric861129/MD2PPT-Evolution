/**
 * MD2PPT Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

export const PPT_THEME = {
  FONTS: {
    MAIN: "Microsoft JhengHei", // 預設正黑體
    CODE: "Consolas",
    HEADING: "Microsoft JhengHei",
  },
  
  COLORS: {
    // 品牌色：PowerPoint 橘紅
    PRIMARY: "D24726", 
    SECONDARY: "444444", 
    ACCENT: "D24726",
    
    // 背景預設改為白色
    BG_SLIDE: "FFFFFF",   
    BG_CODE: "F8F8F8",
    
    // 文字預設深色
    TEXT_MAIN: "333333",
    TEXT_MUTED: "666666",
    
    BORDER_CODE: "E0E0E0",
  },

  LAYOUT: {
    WIDTH: 10,
    HEIGHT: 5.625,
    MARGIN: 0.6,
  },
  
  FONT_SIZES: {
    TITLE: 36,
    SUBTITLE: 28,
    BODY: 20,
    CODE: 14,
    FOOTER: 12
  }
};

export const UI_THEME = {
  FONTS: {
    PREVIEW: `"Microsoft JhengHei", "Segoe UI", sans-serif`
  }
};