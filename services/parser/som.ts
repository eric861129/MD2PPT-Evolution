/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { ParsedBlock, BlockType, SlideMetadata } from "../types";
import { layoutEngine } from "../ppt/LayoutEngine";

export type SOMRegionType = 'header' | 'main' | 'column' | 'background' | 'footer';

export interface SOMRegion {
  type: SOMRegionType;
  blocks: ParsedBlock[];
  id?: string;
  config?: any;
}

export interface SlideObject {
  id: string;
  layout: string;
  config: SlideMetadata;
  regions: SOMRegion[];
  background: {
    color?: string;
    image?: string;
    type: 'color' | 'image' | 'mesh' | 'none';
    meshConfig?: any;
  };
  notes?: string;
  sourceLine: number;
  startIndex?: number;
  endIndex?: number;
}

/**
 * Transforms raw parsed blocks into a high-level Slide Object Model (SOM).
 * This decouples the parsing logic from the rendering logic (PPTX vs HTML).
 */
export const transformToSOM = (blocks: ParsedBlock[]): SlideObject[] => {
  // 1. Group blocks into raw slides
  const rawSlides: { blocks: ParsedBlock[], config: SlideMetadata, line: number, start: number, end: number }[] = [];
  let currentBlocks: ParsedBlock[] = [];
  let currentConfig: SlideMetadata = {};
  let currentLine = 0;
  let currentStart = 0;

  for (const block of blocks) {
    if (block.type === BlockType.HORIZONTAL_RULE) {
      if (currentBlocks.length > 0 || rawSlides.length > 0) {
        const lastBlock = currentBlocks[currentBlocks.length - 1];
        rawSlides.push({ 
          blocks: currentBlocks, 
          config: currentConfig, 
          line: currentLine,
          start: currentStart,
          end: lastBlock?.endIndex || block.startIndex || 0
        });
        currentBlocks = [];
      }
      currentConfig = block.metadata || {};
      currentLine = block.sourceLine || 0;
      currentStart = block.startIndex || 0;
    } else if (block.type === BlockType.NOTE) {
      const existingNote = currentConfig.note ? currentConfig.note + '\n' : '';
      currentConfig.note = existingNote + block.content;
    } else {
      currentBlocks.push(block);
    }
  }
  
  if (currentBlocks.length > 0 || rawSlides.length > 0 || Object.keys(currentConfig).length > 0) {
    const lastBlock = currentBlocks[currentBlocks.length - 1];
    rawSlides.push({ 
      blocks: currentBlocks, 
      config: currentConfig, 
      line: currentLine,
      start: currentStart,
      end: lastBlock?.endIndex || 0
    });
  }

  // 2. Transform each raw slide into a structured SlideObject
  return rawSlides.map((raw, index) => {
    const layout = raw.config.layout || 'default';
    const regions: SOMRegion[] = [];
    
    const titleBlocks = raw.blocks.filter(b => b.type === BlockType.HEADING_1 || b.type === BlockType.HEADING_2);
    const bodyBlocks = raw.blocks.filter(b => b.type !== BlockType.HEADING_1 && b.type !== BlockType.HEADING_2);

    if (titleBlocks.length > 0) {
      regions.push({ type: 'header', blocks: titleBlocks });
    }

    if (layout === 'two-column' || layout === 'grid') {
      const numCols = layout === 'two-column' ? 2 : (raw.config.columns || 2);
      const splitColumns = layoutEngine.splitIntoColumns(bodyBlocks, numCols);
      
      splitColumns.forEach((colBlocks, i) => {
        regions.push({ 
          type: 'column', 
          blocks: colBlocks, 
          id: `col-${i}`,
          config: { index: i, total: numCols }
        });
      });
    } else {
      regions.push({ type: 'main', blocks: bodyBlocks });
    }

    let bgType: 'color' | 'image' | 'mesh' | 'none' = 'none';
    const rawBg = raw.config.background || raw.config.bg;
    if (raw.config.bgImage) bgType = 'image';
    else if (rawBg === 'mesh' || (typeof rawBg === 'string' && rawBg.startsWith('mesh'))) bgType = 'mesh';
    else if (rawBg) bgType = 'color';

    return {
      id: `slide-${index}`,
      layout,
      config: raw.config,
      regions,
      background: {
        type: bgType,
        color: rawBg,
        image: raw.config.bgImage,
        meshConfig: raw.config.mesh
      },
      notes: raw.config.note,
      sourceLine: raw.line,
      startIndex: raw.start,
      endIndex: raw.end
    };
  });
};