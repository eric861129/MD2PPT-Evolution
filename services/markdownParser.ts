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
  let cursor = 0;
  let currentLine = 0;

  // 1. Extract Global Frontmatter
  const globalMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (globalMatch) {
    try {
      globalMeta = yaml.load(globalMatch[1]) as object || {};
      const matchLength = globalMatch[0].length;
      const matchLines = (globalMatch[0].match(/\n/g) || []).length;
      
      cursor += matchLength;
      currentLine += matchLines;
    } catch (e) {
      console.warn("Global YAML parse fail", e);
    }
  }

  const allBlocks: ParsedBlock[] = [];
  
  // 2. Process Slides loop
  // We look for separators: ^(---+|===+)$
  // But we need to handle the content *between* separators.
  
  // If we are at start (after global YAML), and there is no separator immediately,
  // then the first slide content starts here.
  // If there IS a separator immediately, we consume it.

  // Regex to find next separator. Global flag 'g' is stateful, but we recreate or use exec loop.
  // We need to find the *first* match after cursor.
  // Since JS regex lastIndex is tricky with multiline `^`, we slice the text.
  // Performance note: Slicing large text repeatedly is O(N^2). 
  // Given typical presentation size, this is acceptable. 
  
  while (cursor < text.length) {
    const remainingText = text.slice(cursor);
    
    // Find next separator
    // Note: Separator must be on its own line.
    // If we are not at start of line, we search for \n followed by separator.
    // Or if we are at start of line (cursor points to start), search for separator directly.
    
    // Simple heuristic: search for the regex in remainingText
    // Fix: We need to ignore `---` if it's actually the start of a Frontmatter block at the beginning of the slide.
    
    let match = null;
    let searchOffset = 0;
    
    while (true) {
        const tempText = remainingText.slice(searchOffset);
        const tempMatch = tempText.match(/^(?:---+|===+)$/m);
        
        if (!tempMatch || tempMatch.index === undefined) {
            match = null;
            break;
        }
        
        const absoluteIndex = searchOffset + tempMatch.index;
        
        // Check if this separator is `---` and acts as Frontmatter start
        // Condition: It is `---` AND it is at the "start" of the slide content (only whitespace before it)
        const contentBefore = remainingText.slice(0, absoluteIndex);
        
        if (tempMatch[0].startsWith('-') && contentBefore.trim() === '') {
            // Potential Frontmatter. Check if it has a closing `---`
            // We look at the text starting from this `---`
            const potentialFm = remainingText.slice(absoluteIndex);
            const fmCheck = potentialFm.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
            
            if (fmCheck) {
                // Yes, it's Frontmatter. It is part of the CONTENT, not a separator.
                // Skip past it and continue searching for the REAL separator.
                searchOffset = absoluteIndex + fmCheck[0].length;
                continue;
            }
        }
        
        // Valid separator found
        match = {
            ...tempMatch,
            index: absoluteIndex,
            0: tempMatch[0] // Preserve the matched string
        };
        break;
    }

    let slideContent = "";
    let separatorLength = 0;
    let separatorLines = 0;

    if (match && match.index !== undefined) {
      // Content before separator
      slideContent = remainingText.slice(0, match.index);
      
      // Separator itself
      const fullMatch = match[0]; // This is just the --- or === part
      // We need to account for the newline before it if we matched with multiline
      // match.index is the start of ---.
      
      // Advance past content
      cursor += slideContent.length;
      
      // Now cursor is at the separator start.
      // We consume the separator line + newline after it.
      // Check if there is a newline after
      const separatorAndNewlineMatch = remainingText.slice(match.index).match(/^(?:---+|===+)(\r?\n)?/);
      if (separatorAndNewlineMatch) {
        separatorLength = separatorAndNewlineMatch[0].length;
        separatorLines = (separatorAndNewlineMatch[0].match(/\n/g) || []).length;
      }
    } else {
      // No more separators, rest is content
      slideContent = remainingText;
      cursor += slideContent.length;
    }

    // Process this slide's content
    let slideMeta: any = {};
    let markdownToParse = slideContent;
    let localLineOffset = 0; // Offset *within* this slide content for parsing

    // Check for Slide Frontmatter at start of slideContent
    // It must start with --- (and not be empty)
    // Note: Our separator regex handles ---, so if a slide starts with ---, 
    // it implies the previous separator was === or implicit start.
    // BUT, if the user wrote:
    // ===
    // ---
    // layout: grid
    // ---
    // The === is consumed as separator. Then slideContent starts with ---
    // Note: slideContent might start with newlines if the user put empty lines after separator.
    // We should trimStart only for finding the --- match, but keep track of lines?
    // Or just allow whitespace in regex.
    
    const fmMatch = markdownToParse.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (fmMatch) {
        try {
            slideMeta = yaml.load(fmMatch[1]) as object || {};
            const fmLength = fmMatch[0].length;
            const fmLines = (fmMatch[0].match(/\n/g) || []).length;
            
            // If we matched with leading whitespace, we need to be careful with slice.
            // fmMatch[0] includes the leading whitespace.
            
            markdownToParse = markdownToParse.slice(fmMatch.index! + fmLength);
            
            // Adjust line offset based on what we consumed (whitespace + FM)
            // But wait, if we consume lines from markdownToParse, we need to add them to localLineOffset.
            // fmLines calculation above counts newlines in the matched string (including leading \n).
            // So it should be correct.
            localLineOffset += fmLines;
            
            // However, we also need to account for lines *before* the match if fmMatch.index > 0?
            // Actually fmMatch[0] is the whole match. If regex starts with ^\s*, the match includes the whitespace.
            // So fmLines accounts for it.
        } catch (e) {
            // Not a YAML block
        }
    }

    // Determine absolute start line for this block's content
    const contentStartLine = currentLine + localLineOffset;

    // Inject HR (Slide Break) marker
    // We add it to allBlocks list. Its source line is effectively the separator line?
    // Or the start of this section.
    // Let's mark HR with the currentLine (start of slide container).
    allBlocks.push({
      type: 'HORIZONTAL_RULE' as any,
      content: '---',
      metadata: { ...(allBlocks.length === 0 ? globalMeta : {}), ...slideMeta },
      sourceLine: currentLine 
    });

    if (markdownToParse.trim()) {
      const blocks = parseMarkdownWithAST(markdownToParse, contentStartLine, 0); // Pass line offset!
      
      // Extract Notes
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

    // Update global line counter for next iteration
    // 1. Lines in slideContent (including FM)
    const contentLines = (slideContent.match(/\n/g) || []).length;
    currentLine += contentLines;

    // 2. Lines in separator (which we consumed but didn't count in slideContent)
    cursor += separatorLength;
    currentLine += separatorLines;
  }

  return { blocks: allBlocks, meta: globalMeta };
};