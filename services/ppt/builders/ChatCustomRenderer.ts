import { BlockType } from "../../types";
import { PPT_THEME } from "../../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";

export const chatCustomRenderer: BlockRenderer = {
  type: BlockType.CHAT_CUSTOM,
  render: (block, ctx) => {
    const { slide, pptx, x, y, w } = ctx;
    
    const chatAlign = block.alignment || 'left';
    const chatRole = block.role || 'User';
    const bubbleW = w * 0.75;
    const bubbleX = chatAlign === 'right' ? (x + w - bubbleW) : (chatAlign === 'center' ? (x + (w - bubbleW) / 2) : x);
    const bubbleColor = chatAlign === 'right' ? "FFF5E6" : (chatAlign === 'center' ? "F0F0F5" : "E6FFF5");
    const borderColor = chatAlign === 'right' ? "FF8C00" : (chatAlign === 'center' ? "4B0082" : "008080");

    slide.addText(chatRole.toUpperCase(), { 
        x: bubbleX, y, w: bubbleW, h: 0.2, 
        fontSize: 9, bold: true, color: borderColor, fontFace: PPT_THEME.FONTS.MAIN, 
        align: chatAlign as any, italic: true 
    });
    
    let currentY = y + 0.25;
    const bubbleH = Math.max(0.5, block.content.length / 40 * 0.3);
    
    slide.addShape(pptx.ShapeType.roundRect, { 
        x: bubbleX, y: currentY, w: bubbleW, h: bubbleH, 
        fill: { color: bubbleColor }, line: { color: borderColor, width: 1.5 }, rectRadius: 0.1 
    });
    
    slide.addText(block.content, { 
        x: bubbleX + 0.1, y: currentY + 0.05, w: bubbleW - 0.2, h: bubbleH - 0.1, 
        fontSize: 16, color: "333333", fontFace: PPT_THEME.FONTS.MAIN,
        valign: 'middle', align: chatAlign as any, wrap: true 
    });

    return currentY + bubbleH + 0.4;
  }
};
