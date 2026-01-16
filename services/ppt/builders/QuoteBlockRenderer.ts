/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { BlockType, ParsedBlock } from "../../types";
import { PPT_THEME } from "../../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";

export const QuoteBlockRenderer: BlockRenderer = {
  type: BlockType.QUOTE_BLOCK,
  render: (block: ParsedBlock, context: RenderContext): number => {
    const { slide, x, y, w, options } = context;
    const { isDark, color } = options;
    const textColor = isDark ? "FFFFFF" : (color || PPT_THEME.COLORS.TEXT_MAIN);

    // Remove markdown quote markers if present
    const cleanText = block.content.replace(/^>\s*/gm, '').trim();

    slide.addText(cleanText, {
        x: x, y: y, w: w,
        fontSize: 32,
        color: textColor,
        fontFace: PPT_THEME.FONTS.MAIN,
        align: 'center',
        italic: true,
        autoFit: true
    });

    // Estimate height
    return y + 1.5;
  }
};
