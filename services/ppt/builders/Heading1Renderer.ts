import { BlockType } from "../../types";
import { PPT_THEME } from "../../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";

export const heading1Renderer: BlockRenderer = {
  type: BlockType.HEADING_1,
  render: (block, ctx) => {
    const { slide, x, y, w, options } = ctx;
    const { big, align } = options;
    
    const primaryColor = options.theme ? options.theme.colors.primary : PPT_THEME.COLORS.PRIMARY;
    const fontFace = options.fontFace || PPT_THEME.FONTS.HEADING;

    slide.addText(block.content, { 
      x, y, w, h: 0.8, 
      fontSize: big ? 44 : PPT_THEME.FONT_SIZES.TITLE, 
      bold: true, 
      color: primaryColor, 
      fontFace: fontFace, 
      align: align || 'left'
    });
    
    return y + (big ? 1.1 : 0.9);
  }
};
