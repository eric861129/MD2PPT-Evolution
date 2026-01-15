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

  for (const block of blocks) {
    if (currentY > 5.2) break;
    const align = globalOptions.align || 'left';

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
};

export const generatePpt = async (blocks: ParsedBlock[], config: PptConfig = {}): Promise<void> => {
  // Init Highlighter
  try { await highlighterService.init(); } catch (e) { console.warn("Highlighter init failed", e); }
  const highlighter = highlighterService.getHighlighter();

  // Pre-process images: Convert all URLs to Base64 (including bgImage in metadata)
  const processedBlocks = await Promise.all(blocks.map(async (block) => {
    let updatedBlock = { ...block };
    if (block.type === BlockType.IMAGE && block.content && !block.content.startsWith('data:image')) {
      const base64 = await imageUrlToBase64(block.content);
      if (base64) updatedBlock.content = base64;
    }
    // Also process bgImage in HR metadata
    if (block.type === BlockType.HORIZONTAL_RULE && block.metadata?.bgImage && !block.metadata.bgImage.startsWith('data:image')) {
      const base64 = await imageUrlToBase64(block.metadata.bgImage);
      if (base64) updatedBlock.metadata = { ...updatedBlock.metadata, bgImage: base64 };
    }
    return updatedBlock;
  }));

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  if (config.title) pptx.title = config.title; if (config.author) pptx.author = config.author;

  const slidesData = splitBlocksToSlides(processedBlocks);
  for (const slideData of slidesData) {
    const slide = pptx.addSlide();
    const layout = slideData.metadata?.layout;
    const rawBg = slideData.metadata?.bg || config.bg || PPT_THEME.COLORS.BG_SLIDE;
    const bgImage = slideData.metadata?.bgImage;
    
    const bgColor = rawBg.replace('#', '');
    const isDark = bgImage ? true : parseInt(bgColor, 16) < 0x888888;

    if (bgImage && typeof bgImage === 'string' && (bgImage.startsWith('http') || bgImage.startsWith('data:image'))) {
      slide.background = { data: bgImage };
    } else {
      slide.background = { fill: bgColor };
    }

    if (slideData.metadata?.note) {
        slide.addNotes(slideData.metadata.note);
    }

    // Pre-highlight code blocks
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

    if (layout === 'impact' || layout === 'full-bg') {
      renderBlocksToArea(slide, slideData.blocks, margin, 1.8, contentWidth, pptx, { align: 'center', big: true, isDark, color: bgImage ? "FFFFFF" : undefined });
    } else if (layout === 'two-column') {
      if (titleBlocks.length > 0) renderBlocksToArea(slide, titleBlocks, margin, 0.6, contentWidth, pptx, { isDark, color: bgImage ? "FFFFFF" : undefined });
      const mid = Math.ceil(otherBlocks.length / 2); const colWidth = (contentWidth - 0.5) / 2;
      renderBlocksToArea(slide, otherBlocks.slice(0, mid), margin, 1.6, colWidth, pptx, { isDark, color: bgImage ? "FFFFFF" : undefined });
      renderBlocksToArea(slide, otherBlocks.slice(mid), margin + colWidth + 0.5, 1.6, colWidth, pptx, { isDark, color: bgImage ? "FFFFFF" : undefined });
    } else {
      if (titleBlocks.length > 0) renderBlocksToArea(slide, titleBlocks, margin, 0.6, contentWidth, pptx, { isDark, color: bgImage ? "FFFFFF" : undefined });
      renderBlocksToArea(slide, otherBlocks, margin, 1.6, contentWidth, pptx, { isDark, color: bgImage ? "FFFFFF" : undefined });
    }
  }
  await pptx.writeFile({ fileName: config.title ? `${config.title}.pptx` : "Presentation.pptx" });
};
