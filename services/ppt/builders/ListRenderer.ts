import { BlockType } from "../../types";
import { PPT_THEME } from "../../../constants/theme";
import { BlockRenderer, RenderContext } from "./types";
import { parseInlineElements, InlineStyleType } from "../../../utils/styleParser";

function renderList(block: any, ctx: RenderContext, isBullet: boolean): number {
    const { slide, x, y, w, options } = ctx;
    const { big, align, isDark, color } = options;
    const textColor = isDark ? "FFFFFF" : (color || PPT_THEME.COLORS.TEXT_MAIN);

    const items = block.content.split(/\r?\n/).filter((i: string) => i.trim() !== '');
    const listHeight = Math.min(items.length * 0.35, 4.5 - y);
    
    if (listHeight <= 0) return y;

    const textObjects: any[] = [];

    items.forEach((itemString: string, index: number) => {
        const segments = parseInlineElements(itemString);
        const isLastItem = index === items.length - 1;

        segments.forEach((seg, segIndex) => {
            const isFirstSeg = segIndex === 0;
            const isLastSeg = segIndex === segments.length - 1;
            
            const textOpt: any = {
                color: textColor,
                fontSize: options.fontSize || (big ? 24 : 20),
                fontFace: options.fontFace || PPT_THEME.FONTS.MAIN,
            };

            // Apply styles
            if (seg.type === InlineStyleType.BOLD) textOpt.bold = true;
            if (seg.type === InlineStyleType.ITALIC) textOpt.italic = true;
            if (seg.type === InlineStyleType.CODE) {
                textOpt.fontFace = "Consolas";
                textOpt.highlight = isDark ? "333333" : "F3F4F6";
            }

            // Apply bullet only to the first segment of the item
            if (isFirstSeg) {
                const bulletColor = options.theme ? options.theme.colors.primary : PPT_THEME.COLORS.PRIMARY;
                textOpt.bullet = isBullet ? { code: '25AA', color: bulletColor } : { type: 'number' };
                // Specific fix for numbered lists to ensure continuity if needed, 
                // but usually auto-numbering works if in same addText call.
                if (!isBullet) {
                     // pptxgenjs handles numbering automatically within one addText call
                }
            }

            // Apply line break only at the very end of the item (except for the last item of the list)
            // Actually, we want every item to be a paragraph.
            if (isLastSeg) {
                textOpt.breakLine = true;
            }

            textObjects.push({ text: seg.content, options: textOpt });
        });
    });

    slide.addText(textObjects, {
        x: x + 0.2, y, w: w - 0.2, h: listHeight,
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
