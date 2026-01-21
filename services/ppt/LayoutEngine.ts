/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { BlockType, ParsedBlock } from "../types";

export interface LayoutDimensions {
  margin: number;
  contentWidth: number;
  contentHeight: number;
  titleY: number;
  bodyY: number;
  gap: number;
}

export const DEFAULT_LAYOUT_DIMENSIONS: LayoutDimensions = {
  margin: 0.6,
  contentWidth: 8.8, // 10 - 0.6 * 2
  contentHeight: 4.4, // Estimated usable height
  titleY: 0.6,
  bodyY: 1.6,
  gap: 0.4
};

export type LayoutType = 'default' | 'impact' | 'center' | 'quote' | 'alert' | 'two-column' | 'grid' | 'full-bg';

export interface ColumnLayout {
  columns: number;
  colWidth: number;
  gap: number;
}

class LayoutEngine {
  /**
   * Get dimensions for a standard 16:9 slide (10 x 5.625 inches)
   */
  getDimensions(): LayoutDimensions {
    return DEFAULT_LAYOUT_DIMENSIONS;
  }

  /**
   * Calculate column layout based on number of columns
   */
  getColumnLayout(cols: number): ColumnLayout {
    const dim = this.getDimensions();
    const colWidth = (dim.contentWidth - (dim.gap * (cols - 1))) / cols;
    return {
      columns: cols,
      colWidth,
      gap: dim.gap
    };
  }

  /**
   * Split blocks into columns based on COLUMN_BREAK or automatic distribution
   */
  splitIntoColumns(blocks: ParsedBlock[], numCols: number): ParsedBlock[][] {
    const columns: ParsedBlock[][] = [];
    let currentColumn: ParsedBlock[] = [];
    let hasExplicitBreak = false;

    for (const block of blocks) {
      if (block.type === BlockType.COLUMN_BREAK) {
        columns.push(currentColumn);
        currentColumn = [];
        hasExplicitBreak = true;
      } else {
        currentColumn.push(block);
      }
    }
    columns.push(currentColumn);

    if (hasExplicitBreak) {
      // Ensure we have exactly numCols columns
      while (columns.length < numCols) columns.push([]);
      return columns.slice(0, numCols);
    } else {
      // Automatic even distribution
      const result: ParsedBlock[][] = [];
      const itemsPerCol = Math.ceil(blocks.length / numCols);
      for (let i = 0; i < numCols; i++) {
        result.push(blocks.slice(i * itemsPerCol, (i + 1) * itemsPerCol));
      }
      return result;
    }
  }

  /**
   * Determine if a layout uses centralized positioning
   */
  isCenterLayout(layout?: string): boolean {
    return layout === 'center' || layout === 'impact' || layout === 'full-bg' || layout === 'quote';
  }
}

export const layoutEngine = new LayoutEngine();
