/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

import PptxGenJS from "pptxgenjs";
import { ParsedBlock, BlockType, PptTheme, BrandConfig } from "./types";
import { PPT_THEME } from "../constants/theme";
import { transformToSOM, SlideObject, SOMRegion } from "./parser/som";
import { imageUrlToBase64, svgToPngBase64 } from "../utils/imageUtils";
import { rendererRegistry } from "./ppt/builders/registry";
import { RenderContext } from "./ppt/builders/types";
import { highlighterService } from "./ppt/HighlighterService";
import { generateMeshGradient } from "./ppt/GenerativeBgService";
import { layoutEngine } from "./ppt/LayoutEngine";

export interface PptConfig {
  layoutName?: string; 
  title?: string; 
  author?: string; 
  bg?: string;
  theme?: PptTheme;
  brandConfig?: BrandConfig;
}

const renderBlocksToArea = (slide: any, blocks: ParsedBlock[], x: number, y: number, w: number, pptx: PptxGenJS, globalOptions: any = {}) => {
  let currentY = y;
  const isDark = globalOptions.isDark || false;
  const theme = globalOptions.theme as PptTheme;
  
  // Resolve colors from theme or fallback to defaults
  const themeTextColor = theme ? theme.colors.text : PPT_THEME.COLORS.TEXT_MAIN;
  const textColor = isDark ? "FFFFFF" : (globalOptions.color || themeTextColor);
  const themeFont = theme ? theme.fonts.main : PPT_THEME.FONTS.MAIN;
  
  let accumulatedList: { type: BlockType, content: string[] } | null = null;

  const flushList = () => {
    if (accumulatedList) {
      const renderer = rendererRegistry.getRenderer(accumulatedList.type);
      if (renderer) {
        // Construct a temporary block for the merged list
        const mergedBlock: ParsedBlock = {
          type: accumulatedList.type,
          content: accumulatedList.content.join('\n')
        };
        const context: RenderContext = {
          pptx, slide, x, y: currentY, w,
          options: { ...globalOptions, align: globalOptions.align || 'left', theme, fontFace: themeFont, color: textColor }
        };
        currentY = renderer.render(mergedBlock, context);
      }
      accumulatedList = null;
    }
  };

  for (const block of blocks) {
    if (currentY > 5.2) break;
    const align = globalOptions.align || 'left';

    // List Merging Logic
    if (block.type === BlockType.BULLET_LIST || block.type === BlockType.NUMBERED_LIST) {
      if (accumulatedList && accumulatedList.type === block.type) {
        // Merge into existing list
        accumulatedList.content.push(block.content);
        continue; // Skip rendering this block individually
      } else {
        // New list type or first list
        flushList(); // Render previous list if any
        accumulatedList = { type: block.type, content: [block.content] };
        continue;
      }
    } else {
      // Non-list block
      flushList(); // Render pending list first
    }

    const renderer = rendererRegistry.getRenderer(block.type);
    if (renderer) {
      const context: RenderContext = {
        pptx,
        slide,
        x,
        y: currentY,
        w,
        options: { ...globalOptions, align, theme, fontFace: themeFont, color: textColor }
      };
      currentY = renderer.render(block, context);
    } else {
      console.warn(`No renderer found for block type: ${block.type}`);
    }
  }
  
  // Flush any remaining list at the end
  flushList();
};

export const generatePpt = async (blocks: ParsedBlock[], config: PptConfig = {}): Promise<void> => {
  const theme = config.theme;
  // Pre-init Highlighter
  await highlighterService.init();

  // 1. Transform to SOM (Slide Object Model)
  const slides = transformToSOM(blocks);

  // 2. Pre-process images in SOM
  await Promise.all(slides.map(async (slide) => {
    // Process background image
    if (slide.background.image && !slide.background.image.startsWith('data:image')) {
      const base64 = await imageUrlToBase64(slide.background.image);
      if (base64) slide.background.image = base64;
    }

    // Process images in regions
    for (const region of slide.regions) {
      await Promise.all(region.blocks.map(async (block) => {
        if (block.type === BlockType.IMAGE && block.content && !block.content.startsWith('data:image')) {
          const base64 = await imageUrlToBase64(block.content);
          if (base64) block.content = base64;
        }
      }));
    }
  }));

  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  if (config.title) pptx.title = config.title; if (config.author) pptx.author = config.author;

  for (const slideData of slides) {
    const slide = pptx.addSlide();
    const layout = slideData.layout;
    
    // 1. Background Logic
    const themeBg = theme ? theme.colors.background : PPT_THEME.COLORS.BG_SLIDE;
    const rawBg = slideData.background.color || config.bg || themeBg;
    const bgImage = slideData.background.image;
    
    let isMesh = false;
    let meshDataUri = "";

    if (slideData.background.type === 'mesh') {
      isMesh = true;
      const meshConfig = slideData.background.meshConfig || {};
      const svg = generateMeshGradient({
        colors: meshConfig.colors,
        seed: meshConfig.seed,
        width: 1920,
        height: 1080
      });
      try {
        meshDataUri = await svgToPngBase64(svg, 1920, 1080);
      } catch (e) {
        console.error("Mesh SVG to PNG failed", e);
      }
    }

    const bgColor = typeof rawBg === 'string' ? rawBg.replace('#', '') : 'FFFFFF';
    const isDark = bgImage || isMesh ? true : parseInt(bgColor, 16) < 0x888888;

    if (bgImage && typeof bgImage === 'string') {
      slide.background = { data: bgImage };
    } else if (isMesh && meshDataUri) {
      slide.background = { data: meshDataUri };
    } else {
      slide.background = { fill: bgColor };
    }

    if (slideData.notes) {
        slide.addNotes(slideData.notes);
    }

    // 2. Add Brand Logo
    if (config.brandConfig?.logo) {
      const pos = config.brandConfig.logoPosition;
      let logoX = 0.4;
      let logoY = 0.4;
      const logoW = 1.2;
      const logoH = 0.6;

      if (pos === 'top-right') { logoX = 10 - 0.4 - logoW; }
      else if (pos === 'bottom-left') { logoY = 5.625 - 0.4 - logoH; }
      else if (pos === 'bottom-right') { logoX = 10 - 0.4 - logoW; logoY = 5.625 - 0.4 - logoH; }

      slide.addImage({
        data: config.brandConfig.logo,
        x: logoX,
        y: logoY,
        w: logoW,
        h: logoH,
        sizing: { type: 'contain' }
      });
    }

    // 3. Pre-highlight code blocks
    for (const region of slideData.regions) {
      await Promise.all(region.blocks.map(async (b) => {
        if (b.type === BlockType.CODE_BLOCK) {
          const lang = b.metadata?.language || 'text';
          const result = await highlighterService.codeToTokens(b.content, lang, isDark);
          if (result) {
            b.metadata = { ...b.metadata, tokens: result.tokens };
          }
        }
      }));
    }

    const dim = layoutEngine.getDimensions();
    const renderOpts = { isDark, theme, color: bgImage ? "FFFFFF" : undefined };

    // 4. Render Regions based on Layout
    if (layout === 'impact' || layout === 'full-bg' || layout === 'center') {
      const isImpact = layout !== 'center';
      const allBlocks = slideData.regions.flatMap(r => r.blocks);
      renderBlocksToArea(slide, allBlocks, dim.margin, isImpact ? 1.8 : 1.2, dim.contentWidth, pptx, { ...renderOpts, align: 'center', big: isImpact });
    } else if (layout === 'quote') {
      const allBlocks = slideData.regions.flatMap(r => r.blocks);
      renderBlocksToArea(slide, allBlocks, dim.margin + 1, 1.5, dim.contentWidth - 2, pptx, { ...renderOpts, align: 'center', italic: true });
    } else if (layout === 'alert') {
      const allBlocks = slideData.regions.flatMap(r => r.blocks);
      const alertColor = theme ? theme.colors.primary : "FF5500";
      slide.addShape(pptx.ShapeType.rect, { x: 1, y: 1.5, w: 8, h: 3, fill: { color: alertColor, transparency: 90 }, line: { color: alertColor, width: 2 } });
      renderBlocksToArea(slide, allBlocks, 1.5, 2, 7, pptx, { ...renderOpts, align: 'center', color: alertColor });
    } else {
      // Default, grid, two-column
      const headerRegion = slideData.regions.find(r => r.type === 'header');
      const columnRegions = slideData.regions.filter(r => r.type === 'column');
      const mainRegion = slideData.regions.find(r => r.type === 'main');

      if (headerRegion) {
        renderBlocksToArea(slide, headerRegion.blocks, dim.margin, dim.titleY, dim.contentWidth, pptx, renderOpts);
      }

      if (columnRegions.length > 0) {
        const colLayout = layoutEngine.getColumnLayout(columnRegions.length);
        columnRegions.forEach((col, idx) => {
          renderBlocksToArea(slide, col.blocks, dim.margin + (idx * (colLayout.colWidth + colLayout.gap)), dim.bodyY, colLayout.colWidth, pptx, renderOpts);
        });
      } else if (mainRegion) {
        renderBlocksToArea(slide, mainRegion.blocks, dim.margin, dim.bodyY, dim.contentWidth, pptx, renderOpts);
      }
    }
  }
  await pptx.writeFile({ fileName: config.title ? `${config.title}.pptx` : "Presentation.pptx" });
};
