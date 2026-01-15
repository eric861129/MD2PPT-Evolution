import PptxGenJS from "pptxgenjs";
import { ParsedBlock, BlockType } from "../../types";

export interface PptConfig {
  layoutName?: string;
  title?: string;
  author?: string;
  bg?: string;
  isDark?: boolean;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  big?: boolean;
  [key: string]: any;
}

export interface RenderContext {
  pptx: PptxGenJS;
  slide: PptxGenJS.Slide;
  x: number;
  y: number;
  w: number;
  options: PptConfig;
}

export interface BlockRenderer {
  type: BlockType;
  render(block: ParsedBlock, ctx: RenderContext): number;
}
