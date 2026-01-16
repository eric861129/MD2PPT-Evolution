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
      return row.map(cell => ({
        text: cell,
        options: {
          fill: isHeader 
            ? (isModern ? "EA580C" : "F3F4F6") 
            : (isModern && index % 2 === 0 ? "FFF7ED" : "FFFFFF"),
          color: isHeader && isModern ? "FFFFFF" : "1C1917",
          bold: isHeader,
          align: 'center',
          valign: 'middle',
          border: { pt: 1, color: "E7E5E4" }
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
