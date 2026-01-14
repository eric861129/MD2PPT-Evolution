/**
 * MD2PPT Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

// --- PowerPoint Theme Configuration ---

export const PPT_THEME = {
  FONTS: {
    MAIN: "Arial",
    CODE: "Consolas",
    HEADING: "Arial",
  },
  
  COLORS: {
    // Brand Colors (Neon/Dark Theme)
    PRIMARY: "00A3FF",    // Neon Blue
    SECONDARY: "FF0099",  // Neon Pink
    ACCENT: "00FF99",     // Neon Green
    
    // Backgrounds
    BG_SLIDE: "1A1A1A",   // Dark Gray
    BG_CODE: "2D2D2D",
    
    // Text
    TEXT_MAIN: "FFFFFF",
    TEXT_MUTED: "A0A0A0",
    
    // Borders
    BORDER_CODE: "404040",
  },

  LAYOUT: {
    // 16:9 Aspect Ratio (in inches by default for pptxgenjs, but we can define standard sizes)
    WIDTH: 10,
    HEIGHT: 5.625,
    
    MARGIN: 0.5, // 0.5 inch margin
  },
  
  FONT_SIZES: {
    TITLE: 32,
    SUBTITLE: 24,
    BODY: 18,
    CODE: 14,
    FOOTER: 12
  }
};

// --- UI Theme Configuration (For React Components) ---

export const UI_THEME = {
  FONTS: {
    PREVIEW: `"${PPT_THEME.FONTS.MAIN}", sans-serif`
  }
};