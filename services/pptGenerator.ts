/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

import PptxGenJS from "pptxgenjs";
import { ParsedBlock, BlockType } from "./types";
import { PPT_THEME } from "../constants/theme";
import { splitBlocksToSlides, SlideData } from "./parser/slides";

export interface PptConfig {
  layoutName?: string;
  title?: string;
  author?: string;
}

export const generatePpt = async (blocks: ParsedBlock[], config: PptConfig = {}): Promise<void> => {
  const pptx = new PptxGenJS();
  
  const layoutMap: Record<string, string> = {
    "16x9": "LAYOUT_16x9",
    "16x10": "LAYOUT_16x10",
    "4x3": "LAYOUT_4x3",
    "a4": "LAYOUT_WIDE"
  };
  
  pptx.layout = (config.layoutName && layoutMap[config.layoutName]) || "LAYOUT_16x9";

  if (config.title) pptx.title = config.title;
  if (config.author) pptx.author = config.author;

  const slidesData = splitBlocksToSlides(blocks);

  for (const slideData of slidesData) {
    const slide = pptx.addSlide();
    slide.background = { fill: PPT_THEME.COLORS.BG_SLIDE };

    let yPos = 0.5;
    const margin = 0.5;
    const pageWidth = 10;
    const contentWidth = pageWidth - (margin * 2);

    for (const block of slideData.blocks) {
      if (yPos > 5.2) break;

      switch (block.type) {
        case BlockType.HEADING_1:
          slide.addText(block.content, { 
            x: margin, y: yPos, w: contentWidth, h: 0.8, 
            fontSize: PPT_THEME.FONT_SIZES.TITLE, 
            bold: true, 
            color: PPT_THEME.COLORS.PRIMARY,
            fontFace: PPT_THEME.FONTS.HEADING
          });
          yPos += 1.0;
          break;

        case BlockType.HEADING_2:
          slide.addText(block.content, { 
            x: margin, y: yPos, w: contentWidth, h: 0.6, 
            fontSize: PPT_THEME.FONT_SIZES.SUBTITLE, 
            bold: true, 
            color: PPT_THEME.COLORS.SECONDARY,
            fontFace: PPT_THEME.FONTS.HEADING
          });
          yPos += 0.8;
          break;

        case BlockType.CODE_BLOCK:
          const codeLines = block.content.split('\n');
          const codeHeight = Math.min(codeLines.length * 0.25 + 0.2, 4.5 - yPos);
          if (codeHeight <= 0.2) break;

          slide.addShape(pptx.ShapeType.rect, {
            x: margin, y: yPos, w: contentWidth, h: codeHeight,
            fill: { color: PPT_THEME.COLORS.BG_CODE },
            line: { color: PPT_THEME.COLORS.BORDER_CODE, width: 1 }
          });
          
          slide.addText(block.content, {
            x: margin + 0.1, y: yPos + 0.1, w: contentWidth - 0.2, h: codeHeight - 0.2,
            fontSize: PPT_THEME.FONT_SIZES.CODE,
            color: PPT_THEME.COLORS.ACCENT,
            fontFace: PPT_THEME.FONTS.CODE,
            valign: 'top',
            wrap: true
          });
          
          yPos += codeHeight + 0.3;
          break;

        case BlockType.IMAGE:
          const imgUrl = block.content;
          const isBase64 = imgUrl.startsWith('data:image');
          
          try {
            const imgOptions: any = {
              x: margin, y: yPos, w: contentWidth, h: 3.0,
              sizing: { type: 'contain', w: contentWidth, h: 3.0 }
            };
            if (isBase64) imgOptions.data = imgUrl;
            else imgOptions.path = imgUrl;
            
            slide.addImage(imgOptions);
            yPos += 3.2;
          } catch (e) {
            yPos += 0.6;
          }
          break;

        case BlockType.CHAT_CUSTOM:
          const align = block.alignment || 'left';
          const roleText = block.role || 'System';
          const chatColor = align === 'right' ? PPT_THEME.COLORS.SECONDARY :
                            align === 'center' ? PPT_THEME.COLORS.ACCENT :
                            PPT_THEME.COLORS.PRIMARY;

          slide.addText([
            { text: `${roleText}: `, options: { bold: true, color: chatColor } },
            { text: block.content, options: { color: PPT_THEME.COLORS.TEXT_MAIN } }
          ], {
            x: margin, y: yPos, w: contentWidth, h: 0.5,
            fontSize: PPT_THEME.FONT_SIZES.BODY,
            fontFace: PPT_THEME.FONTS.MAIN,
            align: align as any
          });
          yPos += 0.6;
          break;

        case BlockType.BULLET_LIST:
        case BlockType.NUMBERED_LIST:
          const items = block.content.split('\n').filter(i => i.trim() !== '');
          const bulletType = block.type === BlockType.BULLET_LIST ? true : { type: 'number' };
          
          const listHeight = Math.min(items.length * 0.4, 4.5 - yPos);
          if (listHeight <= 0) break;

          slide.addText(
            items.map(item => ({ text: item, options: { bullet: bulletType } })),
            {
              x: margin + 0.3, y: yPos, w: contentWidth - 0.3, h: listHeight,
              fontSize: PPT_THEME.FONT_SIZES.BODY,
              color: PPT_THEME.COLORS.TEXT_MAIN,
              fontFace: PPT_THEME.FONTS.MAIN,
              valign: 'top'
            }
          );
          yPos += listHeight + 0.2;
          break;

        case BlockType.PARAGRAPH:
          slide.addText(block.content, {
            x: margin, y: yPos, w: contentWidth, h: 0.5,
            fontSize: PPT_THEME.FONT_SIZES.BODY,
            color: PPT_THEME.COLORS.TEXT_MAIN,
            fontFace: PPT_THEME.FONTS.MAIN
          });
          yPos += 0.6;
          break;
          
default:
          break;
      }
    }
  }
  
  await pptx.writeFile({ fileName: config.title ? `${config.title}.pptx` : "Presentation.pptx" });
};