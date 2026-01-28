/**
 * MD2PPT Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

export const PPT_THEME = {
  FONTS: {
    MAIN: "Microsoft JhengHei",
    CODE: "Consolas",
    HEADING: "Microsoft JhengHei",
  },
  
  COLORS: {
    PRIMARY: "EA580C",   // 琥珀暖橘
    SECONDARY: "0369A1", // 鋼鐵藍
    ACCENT: "F59E0B",    
    BG_SLIDE: "FFFFFF",   
    BG_CODE: "F5F5F4",   // 暖灰
    TEXT_MAIN: "1C1917", // 石墨黑
    TEXT_MUTED: "57534E",
    BORDER_CODE: "E7E5E4",
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
    PREVIEW: `"Segoe UI", "Microsoft JhengHei", sans-serif`
  },
  COLORS: {
    BRAND: {
      DEFAULT: "var(--product-primary)",
      DARK: "var(--product-primary)", // Simplified for now
      LIGHT: "var(--product-hover)",
      SURFACE: "var(--product-glow)"
    },
    ACCENT: {
      DEFAULT: "#0369A1",
      DARK: "#075985",
      LIGHT: "#0EA5E9"
    },
    // 基礎背景色
    LIGHT: {
      BG: "var(--bg-base)",
      SURFACE: "#FFFFFF",
      TEXT: "var(--text-high)",
      BORDER: "#E7E5E4"
    },
    DARK: {
      BG: "var(--bg-base)",
      SURFACE: "#292524",
      TEXT: "var(--text-high)",
      BORDER: "#44403C"
    }
  }
};