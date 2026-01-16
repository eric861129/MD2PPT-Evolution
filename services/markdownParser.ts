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

  // 2. Split slides by separators "---" or "===" that are NOT part of a YAML block.
  // We look for separators on their own line.
  const rawSections = contentToSplit.split(/^(?:---+|===+)$/m);
  const allBlocks: ParsedBlock[] = [];

  const processedSlides: { markdown: string; metadata: any }[] = [];
  
  let i = 0;
  // Handle leading separators
  if (rawSections.length > 0 && rawSections[0].trim() === "") {
    i = 1;
  }

  while (i < rawSections.length) {
    let sectionContent = rawSections[i];
    let slideMetadata: any = {};

    // Check if this section starts with a YAML block.
    // We need to be careful: the split might have happened AT the first --- of a YAML block
    // if the user didn't provide a slide separator but just a YAML block.
    // However, our logic assumes a separator precedes each slide config.
    
    // A robust way is to check if the next section(s) combined form a YAML block
    // if the current section is empty.
    if (sectionContent.trim() === "" && i + 2 < rawSections.length) {
      // Potentially: empty_section (from separator) -> yaml_content -> rest_of_slide
      // This happens if the user wrote:
      // ===
      // ---
      // layout: grid
      // ---
      try {
        const yamlContent = rawSections[i + 1];
        slideMetadata = yaml.load(yamlContent) as object || {};
        i += 2;
        sectionContent = rawSections[i] || "";
      } catch (e) {
        // Not a YAML block, just an empty slide maybe
      }
    } else {
      // Check if YAML is inside the current section content
      const slideFmMatch = sectionContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
      if (slideFmMatch) {
        try {
          slideMetadata = yaml.load(slideFmMatch[1]) as object || {};
          sectionContent = sectionContent.slice(slideFmMatch[0].length);
        } catch (e) {
          // Parse fail
        }
      }
    }

    processedSlides.push({ markdown: sectionContent.trim(), metadata: slideMetadata });
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
      
      // Extract Notes: find all NOTE blocks, merge their content, and remove them
      const noteBlocks = blocks.filter(b => b.type === 'NOTE' as any);
      const otherBlocks = blocks.filter(b => b.type !== 'NOTE' as any);
      
      if (noteBlocks.length > 0) {
        const mergedNote = noteBlocks.map(b => b.content).join('\n\n');
        // Find the last added HR (which represents this slide's start)
        const lastHr = allBlocks[allBlocks.length - 1];
        if (lastHr && lastHr.type === 'HORIZONTAL_RULE' as any) {
          lastHr.metadata = { ...lastHr.metadata, note: mergedNote };
        }
      }
      
      allBlocks.push(...otherBlocks);
    }
  });

  return { blocks: allBlocks, meta: globalMeta };
};