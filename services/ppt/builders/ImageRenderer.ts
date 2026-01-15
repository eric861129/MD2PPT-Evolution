import { BlockType } from "../../types";
import { BlockRenderer, RenderContext } from "./types";

export const imageRenderer: BlockRenderer = {
  type: BlockType.IMAGE,
  render: (block, ctx) => {
    const { slide, x, y, w, options } = ctx;
    const { align } = options;

    try {
        if (!block.content) return y; // Skip if no content

        const imgOptions: any = { 
          x: align === 'center' ? x + (w - 4) / 2 : x, 
          y, w: Math.min(w, 4), h: 2.5, 
          sizing: { type: 'contain', w: Math.min(w, 4), h: 2.5 } 
        };
        imgOptions.data = block.content; 
        slide.addImage(imgOptions); 
        return y + 2.7;
      } catch (e) { 
        console.error("Failed to add image to slide", e);
        return y + 0.6; 
      }
  }
};
