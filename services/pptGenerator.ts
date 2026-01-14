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

    switch (block.type) {
      case BlockType.HEADING_1:
        slide.addText(block.content, { 
          x, y: currentY, w, h: 0.8, 
          fontSize: globalOptions.big ? 44 : PPT_THEME.FONT_SIZES.TITLE, 
          bold: true, color: PPT_THEME.COLORS.PRIMARY, fontFace: PPT_THEME.FONTS.HEADING, align 
        });
        currentY += globalOptions.big ? 1.1 : 0.9; break;
      case BlockType.HEADING_2:
        slide.addText(block.content, { 
          x, y: currentY, w, h: 0.6, 
          fontSize: globalOptions.big ? 32 : PPT_THEME.FONT_SIZES.SUBTITLE, 
          bold: true, color: isDark ? "CCCCCC" : "666666", fontFace: PPT_THEME.FONTS.HEADING, align 
        });
        currentY += globalOptions.big ? 0.9 : 0.7; break;
      case BlockType.CODE_BLOCK:
        const codeHeight = Math.min(block.content.split('\n').length * 0.22 + 0.3, 4.5 - currentY);
        if (codeHeight <= 0.3) break;
        slide.addShape(pptx.ShapeType.rect, { x, y: currentY, w, h: codeHeight, fill: { color: isDark ? "222222" : "F5F5F5" }, line: { color: "DDDDDD", width: 1 } });
        slide.addText(block.content, { x: x + 0.1, y: currentY + 0.1, w: w - 0.2, h: codeHeight - 0.2, fontSize: PPT_THEME.FONT_SIZES.CODE, color: isDark ? "00FF99" : "D24726", fontFace: PPT_THEME.FONTS.CODE,valign: 'top', wrap: true });
        currentY += codeHeight + 0.3; break;
      case BlockType.IMAGE:
        try {
          const imgOptions: any = { 
            x: align === 'center' ? x + (w - 4) / 2 : x, 
            y: currentY, w: Math.min(w, 4), h: 2.5, 
            sizing: { type: 'contain', w: Math.min(w, 4), h: 2.5 } 
          };
          imgOptions.data = block.content;
          slide.addImage(imgOptions); currentY += 2.7;
        } catch (e) { currentY += 0.6; } break;
      case BlockType.CHAT_CUSTOM:
        const chatAlign = block.alignment || 'left';
        const chatRole = block.role || 'User';
        const bubbleW = w * 0.75;
        const bubbleX = chatAlign === 'right' ? (x + w - bubbleW) : (chatAlign === 'center' ? (x + (w - bubbleW) / 2) : x);
        const bubbleColor = chatAlign === 'right' ? "FFF5E6" : (chatAlign === 'center' ? "F0F0F5" : "E6FFF5");
        const borderColor = chatAlign === 'right' ? "FF8C00" : (chatAlign === 'center' ? "4B0082" : "008080");
        slide.addText(chatRole.toUpperCase(), { x: bubbleX, y: currentY, w: bubbleW, h: 0.2, fontSize: 9, bold: true, color: borderColor, fontFace: PPT_THEME.FONTS.MAIN, align: chatAlign as any, italic: true });
        currentY += 0.25;
        const bubbleH = Math.max(0.5, block.content.length / 40 * 0.3);
        slide.addShape(pptx.ShapeType.roundRect, { x: bubbleX, y: currentY, w: bubbleW, h: bubbleH, fill: { color: bubbleColor }, line: { color: borderColor, width: 1.5 }, rectRadius: 0.1 });
        slide.addText(block.content, { x: bubbleX + 0.1, y: currentY + 0.05, w: bubbleW - 0.2, h: bubbleH - 0.1, fontSize: 16, color: "333333", fontFace: PPT_THEME.FONTS.MAIN,valign: 'middle', align: chatAlign as any, wrap: true });
        currentY += bubbleH + 0.4; break;
      case BlockType.BULLET_LIST:
      case BlockType.NUMBERED_LIST:
        const items = block.content.split('\n').filter(i => i.trim() !== '');
        const listHeight = Math.min(items.length * 0.35, 4.5 - currentY);
        if (listHeight <= 0) break;
        slide.addText(items.map(item => ({ text: item, options: { bullet: block.type === BlockType.BULLET_LIST ? { code: '25AA', color: PPT_THEME.COLORS.PRIMARY } : { type: 'number' } } })), { x: x + 0.2, y: currentY, w: w - 0.2, h: listHeight, fontSize: globalOptions.big ? 24 : 20, color: textColor, fontFace: PPT_THEME.FONTS.MAIN,valign: 'top', align });
        currentY += listHeight + 0.2; break;
      case BlockType.PARAGRAPH:
        slide.addText(block.content, { x, y: currentY, w, h: 0.5, fontSize: globalOptions.big ? 24 : 20, color: textColor, fontFace: PPT_THEME.FONTS.MAIN, align });
        currentY += 0.5; break;
    }
  }
};

export const generatePpt = async (blocks: ParsedBlock[], config: PptConfig = {}): Promise<void> => {
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

    if (bgImage) {
      slide.background = { data: bgImage };
    } else {
      slide.background = { fill: bgColor };
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
