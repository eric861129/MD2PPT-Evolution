import { BlockType } from "../../types";
import { PPT_THEME } from "../../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";

function renderList(block: any, ctx: RenderContext, isBullet: boolean): number {
    const { slide, x, y, w, options } = ctx;
    const { big, align, isDark, color } = options;
    const textColor = isDark ? "FFFFFF" : (color || PPT_THEME.COLORS.TEXT_MAIN);

    const items = block.content.split('\n').filter((i: string) => i.trim() !== '');
    const listHeight = Math.min(items.length * 0.35, 4.5 - y);
    
    if (listHeight <= 0) return y;

    slide.addText(items.map((item: string) => ({
        text: item,
        options: {
            bullet: isBullet ? { code: '25AA', color: PPT_THEME.COLORS.PRIMARY } : { type: 'number' }
        }
    })), {
        x: x + 0.2, y, w: w - 0.2, h: listHeight,
        fontSize: big ? 24 : 20,
        color: textColor,
        fontFace: PPT_THEME.FONTS.MAIN,
        valign: 'top',
        align: align || 'left'
    });

    return y + listHeight + 0.2;
}

export const bulletListRenderer: BlockRenderer = {
  type: BlockType.BULLET_LIST,
  render: (block, ctx) => renderList(block, ctx, true)
};

export const numberedListRenderer: BlockRenderer = {
  type: BlockType.NUMBERED_LIST,
  render: (block, ctx) => renderList(block, ctx, false)
};
