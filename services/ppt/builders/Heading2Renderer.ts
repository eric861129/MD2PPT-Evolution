import { BlockType } from "../../types";
import { PPT_THEME } from "../../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";

export const heading2Renderer: BlockRenderer = {
  type: BlockType.HEADING_2,
  render: (block, ctx) => {
    const { slide, x, y, w, options } = ctx;
    const { big, align, isDark } = options;
    
    const accentColor = options.theme ? options.theme.colors.accent : (isDark ? "CCCCCC" : "666666");
    const fontFace = options.fontFace || PPT_THEME.FONTS.HEADING;

        slide.addText(block.content, {
          x, y, w, h: 0.6,
          fontSize: options.fontSize || 32,
          bold: true,
          color: textColor,
          fontFace: fontFace,
          align: align || 'left'
        });    
    return y + (big ? 0.9 : 0.7);
  }
};