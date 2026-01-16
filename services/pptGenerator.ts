/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

import PptxGenJS from "pptxgenjs";
import { ParsedBlock, BlockType } from "./types";
import { PPT_THEME } from "../constants/theme";
import { splitBlocksToSlides } from "./parser/slides";
import { imageUrlToBase64 } from "../utils/imageUtils";
import { rendererRegistry } from "./ppt/builders/registry";
import { RenderContext } from "./ppt/builders/types";
import { highlighterService } from "./ppt/HighlighterService";

export interface PptConfig {
  layoutName?: string; title?: string; author?: string; bg?: string;
}

const renderBlocksToArea = (slide: any, blocks: ParsedBlock[], x: number, y: number, w: number, pptx: PptxGenJS, globalOptions: any = {}) => {
  let currentY = y;
  const isDark = globalOptions.isDark || false;
  const textColor = isDark ? "FFFFFF" : (globalOptions.color || PPT_THEME.COLORS.TEXT_MAIN);
  
  let accumulatedList: { type: BlockType, content: string[] } | null = null;

  const flushList = () => {
    if (accumulatedList) {
      const renderer = rendererRegistry.getRenderer(accumulatedList.type);
      if (renderer) {
        // Construct a temporary block for the merged list
        const mergedBlock: ParsedBlock = {
          type: accumulatedList.type,
          content: accumulatedList.content.join('\n')
        };
        const context: RenderContext = {
          pptx, slide, x, y: currentY, w,
          options: { ...globalOptions, align: globalOptions.align || 'left' }
        };
        currentY = renderer.render(mergedBlock, context);
      }
      accumulatedList = null;
    }
  };

  for (const block of blocks) {
    if (currentY > 5.2) break;
    const align = globalOptions.align || 'left';

    // List Merging Logic
    if (block.type === BlockType.BULLET_LIST || block.type === BlockType.NUMBERED_LIST) {
      if (accumulatedList && accumulatedList.type === block.type) {
        // Merge into existing list
        accumulatedList.content.push(block.content);
        continue; // Skip rendering this block individually
      } else {
        // New list type or first list
        flushList(); // Render previous list if any
        accumulatedList = { type: block.type, content: [block.content] };
        continue;
      }
    } else {
      // Non-list block
      flushList(); // Render pending list first
    }

    const renderer = rendererRegistry.getRenderer(block.type);
    if (renderer) {
      const context: RenderContext = {
        pptx,
        slide,
        x,
        y: currentY,
        w,
        options: { ...globalOptions, align }
      };
      currentY = renderer.render(block, context);
    } else {
      console.warn(`No renderer found for block type: ${block.type}`);
    }
  }
  
  // Flush any remaining list at the end
  flushList();
};

export const generatePpt = async (blocks: ParsedBlock[], config: PptConfig = {}): Promise<void> => {
  // Init Highlighter
  try { await highlighterService.init(); } catch (e) { console.warn("Highlighter init failed", e); }
  const highlighter = highlighterService.getHighlighter();

  // Pre-process images: Convert all URLs to Base64 (including bgImage in metadata/config)
  const processedBlocks = await Promise.all(blocks.map(async (block) => {
    let updatedBlock = { ...block };
    if (block.type === BlockType.IMAGE && block.content && !block.content.startsWith('data:image')) {
      const base64 = await imageUrlToBase64(block.content);
      if (base64) updatedBlock.content = base64;
    }
    
    // Process bgImage in both metadata and new config
    const bgImg = updatedBlock.config?.bgImage || updatedBlock.metadata?.bgImage;
    if (block.type === BlockType.HORIZONTAL_RULE && bgImg && !bgImg.startsWith('data:image')) {
      const base64 = await imageUrlToBase64(bgImg);
      if (base64) {
        if (updatedBlock.config) updatedBlock.config.bgImage = base64;
        if (updatedBlock.metadata) updatedBlock.metadata.bgImage = base64;
      }
    }
    return updatedBlock;
  }));

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  if (config.title) pptx.title = config.title; if (config.author) pptx.author = config.author;

  const slidesData = splitBlocksToSlides(processedBlocks);
  for (const slideData of slidesData) {
    const slide = pptx.addSlide();
    const slideCfg = slideData.config || {};
    const layout = slideCfg.layout || slideData.metadata?.layout;
    const transition = slideCfg.transition;
    
    // 1. Background Logic
    const rawBg = slideCfg.background || slideCfg.bg || slideData.metadata?.bg || config.bg || PPT_THEME.COLORS.BG_SLIDE;
    const bgImage = slideCfg.bgImage || slideData.metadata?.bgImage;
    const bgColor = rawBg.replace('#', '');
    const isDark = bgImage ? true : parseInt(bgColor, 16) < 0x888888;

    if (bgImage && typeof bgImage === 'string' && (bgImage.startsWith('http') || bgImage.startsWith('data:image'))) {
      slide.background = { data: bgImage };
    } else {
      slide.background = { fill: bgColor };
    }

    // 2. Transition Logic (if supported by library version)
    // pptxgenjs doesn't have a direct 'transition' property on Slide object in all versions, 
    // but some versions support it via options. We will apply common ones if available.

    if (slideCfg.note || slideData.metadata?.note) {
        slide.addNotes(slideCfg.note || slideData.metadata?.note);
    }

    // 3. Pre-highlight code blocks
    if (highlighter) {
        slideData.blocks.forEach(b => {
            if (b.type === BlockType.CODE_BLOCK) {
                const lang = b.metadata?.language || 'text';
                const theme = isDark ? 'github-dark' : 'github-light';
                try {
                    b.metadata = { ...b.metadata, tokens: highlighter.codeToTokens(b.content, { lang: lang as any, theme }).tokens };
                } catch (e) {}
            }
        });
    }

    const margin = 0.6; const contentWidth = 10 - (margin * 2);
    const titleBlocks = slideData.blocks.filter(b => b.type === BlockType.HEADING_1 || b.type === BlockType.HEADING_2);
    const otherBlocks = slideData.blocks.filter(b => b.type !== BlockType.HEADING_1 && b.type !== BlockType.HEADING_2);

    // 4. Enhanced Layout Engine
    if (layout === 'impact' || layout === 'full-bg' || layout === 'center') {
      const isImpact = layout !== 'center';
      renderBlocksToArea(slide, slideData.blocks, margin, isImpact ? 1.8 : 1.2, contentWidth, pptx, { align: 'center', big: isImpact, isDark, color: bgImage ? "FFFFFF" : undefined });
    } else if (layout === 'quote') {
      renderBlocksToArea(slide, slideData.blocks, margin + 1, 1.5, contentWidth - 2, pptx, { align: 'center', italic: true, isDark, color: bgImage ? "FFFFFF" : undefined });
    } else if (layout === 'alert') {
      // Alert Box Simulation
      slide.addShape(pptx.ShapeType.rect, { x: 1, y: 1.5, w: 8, h: 3, fill: { color: "FF5500", transparency: 90 }, line: { color: "FF5500", width: 2 } });
      renderBlocksToArea(slide, slideData.blocks, 1.5, 2, 7, pptx, { align: 'center', isDark, color: "FF5500" });
    } else if (layout === 'two-column' || layout === 'grid') {
      if (titleBlocks.length > 0) renderBlocksToArea(slide, titleBlocks, margin, 0.6, contentWidth, pptx, { isDark, color: bgImage ? "FFFFFF" : undefined });
      
      const cols = layout === 'two-column' ? 2 : (slideCfg.columns || 2);
      const gap = 0.4;
      const colWidth = (contentWidth - (gap * (cols - 1))) / cols;
      
      const itemsPerCol = Math.ceil(otherBlocks.length / cols);
      
      for (let c = 0; c < cols; c++) {
        // Sequential distribution to match PreviewPane
        const colBlocks = otherBlocks.slice(c * itemsPerCol, (c + 1) * itemsPerCol);
        renderBlocksToArea(slide, colBlocks, margin + (c * (colWidth + gap)), 1.6, colWidth, pptx, { isDark, color: bgImage ? "FFFFFF" : undefined });
      }
    } else {
      if (titleBlocks.length > 0) renderBlocksToArea(slide, titleBlocks, margin, 0.6, contentWidth, pptx, { isDark, color: bgImage ? "FFFFFF" : undefined });
      renderBlocksToArea(slide, otherBlocks, margin, 1.6, contentWidth, pptx, { isDark, color: bgImage ? "FFFFFF" : undefined });
    }
  }
  await pptx.writeFile({ fileName: config.title ? `${config.title}.pptx` : "Presentation.pptx" });
};
