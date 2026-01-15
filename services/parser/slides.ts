/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { ParsedBlock, BlockType } from "../types";

export interface SlideData {
  blocks: ParsedBlock[];
  metadata?: {
    bg?: string;
    bgImage?: string;
    layout?: string;
    [key: string]: any;
  };
}

/**
 * Splits the flat list of parsed blocks into groups.
 * Uses HORIZONTAL_RULE as the primary splitter and extracts metadata.
 */
export const splitBlocksToSlides = (blocks: ParsedBlock[]): SlideData[] => {
  const slides: SlideData[] = [];
  let currentSlideBlocks: ParsedBlock[] = [];
  let currentSlideMetadata: any = {};
  let hasStartedFirstSlide = false;

  for (const block of blocks) {
    if (block.type === BlockType.HORIZONTAL_RULE) {
      // If we already have content OR we've already initialized a slide sequence,
      // we need to finish the previous one.
      if (hasStartedFirstSlide && (currentSlideBlocks.length > 0 || slides.length > 0)) {
        slides.push({ 
          blocks: [...currentSlideBlocks],
          metadata: { ...currentSlideMetadata }
        });
        currentSlideBlocks = [];
      }
      
      // Set metadata for the NEXT upcoming slide
      currentSlideMetadata = block.metadata || {};
      hasStartedFirstSlide = true;
    } else {
      currentSlideBlocks.push(block);
    }
  }

  // Final slide flush: 
  // Push if there are blocks, OR if we've initialized a slide (supporting empty last slides)
  if (currentSlideBlocks.length > 0 || (hasStartedFirstSlide && slides.length === 0) || (currentSlideBlocks.length === 0 && Object.keys(currentSlideMetadata).length > 0)) {
    slides.push({ 
      blocks: [...currentSlideBlocks],
      metadata: { ...currentSlideMetadata }
    });
  }

  // Safety cleanup: Ensure we don't return an empty slide if there's absolutely no content
  return slides.length > 0 ? slides : [{ blocks: [], metadata: {} }];
};