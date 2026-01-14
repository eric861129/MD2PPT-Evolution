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

  // 2. Split slides by "==="
  const slideSections = contentToSplit.split(/^===+$/m);
  const allBlocks: ParsedBlock[] = [];

  slideSections.forEach((section, idx) => {
    let slideMarkdown = section.trim();
    let slideMetadata: any = {};

    // 3. Check for slide-level YAML
    const slideFmMatch = slideMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (slideFmMatch) {
      try {
        slideMetadata = yaml.load(slideFmMatch[1]) as object || {};
        slideMarkdown = slideMarkdown.slice(slideFmMatch[0].length).trim();
      } catch (e) {
        console.warn("Slide YAML parse fail", e);
      }
    }

    // 4. Inject Page Break Marker
    // The very first section is slide 1. It carries the global metadata + its own.
    if (idx === 0) {
      // First slide boundary: we must provide the metadata but NOT a split rule
      // Actually, we'll use a special invisible marker OR just set metadata on the first actual block.
      // But splitBlocksToSlides depends on HR. 
      // Solution: Always start with an HR if we want consistent metadata assignment.
      allBlocks.push({
        type: 'HORIZONTAL_RULE' as any,
        content: '===',
        metadata: { ...globalMeta, ...slideMetadata }
      });
    } else {
      allBlocks.push({
        type: 'HORIZONTAL_RULE' as any,
        content: '===',
        metadata: slideMetadata
      });
    }

    // 5. Parse Slide Content
    if (slideMarkdown) {
      const blocks = parseMarkdownWithAST(slideMarkdown);
      allBlocks.push(...blocks);
    }
  });

  return { blocks: allBlocks, meta: globalMeta };
};