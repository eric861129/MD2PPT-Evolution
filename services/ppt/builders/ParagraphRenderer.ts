import { BlockType } from "../../types";
import { PPT_THEME } from "../../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";

export const paragraphRenderer: BlockRenderer = {
  type: BlockType.PARAGRAPH,
  render: (block, ctx) => {
    const { slide, x, y, w, options } = ctx;
    const { big, align, isDark, color } = options;
    const textColor = isDark ? "FFFFFF" : (color || PPT_THEME.COLORS.TEXT_MAIN);

    slide.addText(block.content, { 
      x, y, w, h: 0.5, 
      fontSize: options.fontSize || (big ? 24 : 20), 
      color: textColor, 
      fontFace: options.fontFace || PPT_THEME.FONTS.MAIN, 
      align: align || 'left' 
    });
    
    return y + 0.5;
  }
};
