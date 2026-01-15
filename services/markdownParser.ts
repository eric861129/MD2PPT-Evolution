/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License. 
 */

import yaml from 'js-yaml';
import { ParsedBlock, ParseResult, DocumentMeta } from './types';
import { parseMarkdownWithAST } from './parser/ast';

export const parseMarkdown = (text: string): ParseResult => {
  // 1. Extract Global Frontmatter (Top-level only)
  let globalMeta: DocumentMeta = {};
  let contentToSplit = text;
  
  const globalMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (globalMatch) {
    try {
      globalMeta = yaml.load(globalMatch[1]) as object || {};
      contentToSplit = text.slice(globalMatch[0].length);
    } catch (e) {
      console.warn("Global YAML parse fail", e);
    }
  }

  // 2. Split slides by "---" (at the start of a line)
  // We use a more careful approach to distinguish between slide separators and YAML delimiters.
  const rawSections = contentToSplit.split(/^---+$/m);
  const allBlocks: ParsedBlock[] = [];

  const processedSlides: { markdown: string; metadata: any }[] = [];
  
  let i = 0;
  // If the first section is empty (e.g. text started with ---), skip it or handle as empty slide 1
  if (rawSections[0].trim() === "" && rawSections.length > 1) {
    i = 1;
  }

  while (i < rawSections.length) {
    let slideMarkdown = rawSections[i].trim();
    let slideMetadata: any = {};

    // Check if this section is empty AND followed by another section
    // This happens when we have --- followed by another --- (a YAML block start)
    if (slideMarkdown === "" && i + 1 < rawSections.length) {
      // The next section is the YAML content
      try {
        slideMetadata = yaml.load(rawSections[i + 1]) as object || {};
        // The section after that is the actual slide content
        i += 2;
        slideMarkdown = (rawSections[i] || "").trim();
      } catch (e) {
        // Not valid YAML or unexpected structure, fallback
        i++;
        slideMarkdown = (rawSections[i] || "").trim();
      }
    } else {
      // Standard slide without leading YAML block
      // But wait, the YAML block might be INSIDE the slideMarkdown if we didn't split correctly
      // or if the user used the old style: 
      // ---
      // layout: grid
      // ---
      const slideFmMatch = slideMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
      if (slideFmMatch) {
        try {
          slideMetadata = yaml.load(slideFmMatch[1]) as object || {};
          slideMarkdown = slideMarkdown.slice(slideFmMatch[0].length).trim();
        } catch (e) {
          console.warn("Slide YAML parse fail", e);
        }
      }
    }

    processedSlides.push({ markdown: slideMarkdown, metadata: slideMetadata });
    i++;
  }

  processedSlides.forEach((slide, idx) => {
    // Inject Page Break Marker (HORIZONTAL_RULE)
    if (idx === 0) {
      allBlocks.push({
        type: 'HORIZONTAL_RULE' as any,
        content: '---',
        metadata: { ...globalMeta, ...slide.metadata }
      });
    } else {
      allBlocks.push({
        type: 'HORIZONTAL_RULE' as any,
        content: '---',
        metadata: slide.metadata
      });
    }

    // Parse Slide Content
    if (slide.markdown) {
      const blocks = parseMarkdownWithAST(slide.markdown);
      allBlocks.push(...blocks);
    }
  });

  return { blocks: allBlocks, meta: globalMeta };
};