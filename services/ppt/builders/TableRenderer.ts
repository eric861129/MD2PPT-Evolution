/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { BlockType, ParsedBlock } from "../../types";
import { BlockRenderer, RenderContext } from "./types";
import { PPT_THEME } from "../../../constants/theme";

export const TableRenderer: BlockRenderer = {
  type: BlockType.TABLE,
  render: (block: ParsedBlock, context: RenderContext): number => {
    const { slide, x, y, w, options } = context;
    // Default to modern style unless explicitly disabled
    const isModern = options?.tableStyle !== 'basic';
    
    if (!block.tableRows || block.tableRows.length === 0) return y;

    const rows = block.tableRows.map((row, index) => {
      const isHeader = index === 0;
      const primaryColor = options.theme ? options.theme.colors.primary : "EA580C";
      const textColor = isHeader && isModern ? "FFFFFF" : (options.color || "1C1917");
      
      return row.map(cell => ({
        text: cell,
        options: {
          fill: isHeader 
            ? (isModern ? primaryColor : "F3F4F6") 
            : (isModern && index % 2 === 0 ? (options.isDark ? "292524" : "FFF7ED") : (options.isDark ? "1C1917" : "FFFFFF")),
          color: textColor,
          bold: isHeader,
          align: 'center',
          valign: 'middle',
          border: { pt: 1, color: options.isDark ? "44403C" : "E7E5E4" }
        }
      }));
    });

    slide.addTable(rows, {
      x,
      y,
      w,
      autoPage: false
    });

    // Estimate height (simple heuristic)
    const rowHeight = 0.4;
    return y + (block.tableRows.length * rowHeight) + 0.3;
  }
};
