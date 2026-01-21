/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License. 
 */

import yaml from 'js-yaml';
import { ParsedBlock, ParseResult, DocumentMeta } from './types';
import { parseMarkdownWithAST } from './parser/ast';

export const parseMarkdown = (text: string): ParseResult => {

  let globalMeta: DocumentMeta = {};

  let globalOffset = 0;

  let globalLine = 0;



  // 1. Extract Global Frontmatter (must be at the very start)

  const globalMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (globalMatch) {

    try {

      globalMeta = yaml.load(globalMatch[1]) as object || {};

      globalOffset = globalMatch[0].length;

      globalLine = (globalMatch[0].match(/\n/g) || []).length;

    } catch (e) {

      console.warn("Global YAML parse fail", e);

    }

  }



  const allBlocks: ParsedBlock[] = [];

  

  // 2. Identify all separators (--- or ===)

  // We use a global regex to find all matches without slicing.

  // Note: We must distinguish between "Slide Separator" and "Slide Frontmatter".

  const separatorRegex = /^(?:---+|===+)$/gm;

  let match;

  let lastIndex = globalOffset;

  let lastLine = globalLine;



  const processSection = (content: string, startLine: number) => {

    let slideMeta: any = {};

    let markdownToParse = content;

    let localLineOffset = 0;



    // Check for Slide Frontmatter at the start of this section

    const fmMatch = markdownToParse.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

    if (fmMatch) {

      try {

        slideMeta = yaml.load(fmMatch[1]) as object || {};

        const fmLines = (fmMatch[0].match(/\n/g) || []).length;

        markdownToParse = markdownToParse.slice(fmMatch.index! + fmMatch[0].length);

        localLineOffset += fmLines;

      } catch (e) {}

    }



    // Inject HR (Slide Break) marker

    allBlocks.push({

      type: 'HORIZONTAL_RULE' as any,

      content: '---',

      metadata: { ...(allBlocks.length === 0 ? globalMeta : {}), ...slideMeta },

      sourceLine: startLine

    });



    if (markdownToParse.trim()) {

      const blocks = parseMarkdownWithAST(markdownToParse, startLine + localLineOffset, 0);

      

      const noteBlocks = blocks.filter(b => b.type === 'NOTE' as any);

      const otherBlocks = blocks.filter(b => b.type !== 'NOTE' as any);

      

      if (noteBlocks.length > 0) {

        const mergedNote = noteBlocks.map(b => b.content).join('\n\n');

        const lastHr = allBlocks[allBlocks.length - 1];

        if (lastHr && lastHr.type === 'HORIZONTAL_RULE' as any) {

          lastHr.metadata = { ...lastHr.metadata, note: mergedNote };

        }

      }

      

      allBlocks.push(...otherBlocks);

    }

  };



  // Iterate through all separators

  while ((match = separatorRegex.exec(text)) !== null) {

    if (match.index < globalOffset) continue;



    // Check if this is actually a Frontmatter start (if it's --- and at the start of a slide)

    // We check the content between lastIndex and this match.

    const sectionContent = text.substring(lastIndex, match.index);

    

    // If this match is '---' and there's nothing but whitespace before it in the CURRENT section,

    // it might be the start of a YAML block.

    if (match[0].startsWith('-') && sectionContent.trim() === '') {

      // Look ahead for the closing '---'

      const remaining = text.slice(match.index);

      const fmCheck = remaining.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

      if (fmCheck) {

        // This is a YAML block, skip it as a separator.

        separatorRegex.lastIndex = match.index + fmCheck[0].length;

        continue;

      }

    }



    // Found a real separator. Process the content since lastIndex.

    processSection(sectionContent, lastLine);



    // Update counters for next section

    const separatorLines = (match[0].match(/\n/g) || []).length + 1; // +1 for the implicit newline if it's the end of line

    // Wait, regex ^...$ with /m matches start/end of lines.

    // To be precise about line counting:

    const textUpToMatch = text.substring(0, match.index);

    const totalLinesUpToMatch = (textUpToMatch.match(/\n/g) || []).length;

    

    lastIndex = match.index + match[0].length;

    // Skip optional trailing newline after separator

    if (text[lastIndex] === '\r') lastIndex++;

    if (text[lastIndex] === '\n') lastIndex++;

    

    const textUpToNext = text.substring(0, lastIndex);

    lastLine = (textUpToNext.match(/\n/g) || []).length;

  }



  // Process the final section

  processSection(text.substring(lastIndex), lastLine);



  return { blocks: allBlocks, meta: globalMeta };

};
