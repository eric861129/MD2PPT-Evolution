import { BlockType } from "../../types";
import { PPT_THEME } from "../../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";

export const heading3Renderer: BlockRenderer = {
  type: BlockType.HEADING_3,
  render: (block, ctx) => {
    const { slide, x, y, w, options } = ctx;
    const { align, isDark, color } = options;
    
    // Priority: options.color (which is already theme-aware) > fallback
    const textColor = isDark ? "FFFFFF" : (color || PPT_THEME.COLORS.TEXT_MAIN);
    const fontFace = options.fontFace || PPT_THEME.FONTS.HEADING;

        slide.addText(block.content, {
          x, y, w, h: 0.5,
          fontSize: options.fontSize || 24,
          bold: true,
          color: textColor,
          fontFace: fontFace,
          align: align || 'left'
        });    
    return y + 0.7;
  }
};