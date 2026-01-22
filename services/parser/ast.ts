/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * 
 * New AST Parser pipeline using Unified/Remark
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import yaml from 'js-yaml';
import { BlockType, ParsedBlock } from '../types';

/**
 * Helper: Recursively extract text content from any MDAST node.
 */
const nodeToString = (node: any): string => {
  if (node.value !== undefined) return node.value;
  if (node.children) return node.children.map(nodeToString).join('');
  return '';
};

/**
 * Helper: Extract attributes like {size=48} from the end of a string.
 * Returns the cleaned string and the extracted attributes object.
 */
const extractAttributes = (text: string): { content: string, metadata: any } => {
  const metadata: any = {};
  let cleanedContent = text;

  // Match {key=value} at the end of the string
  // Support multiple attributes in the future if needed, e.g., {size=48 color=red}
  const attrRegex = /\s*\{([^}]+)\}\s*$/;
  const match = text.match(attrRegex);

  if (match) {
    const attrString = match[1];
    cleanedContent = text.replace(attrRegex, '');

    // Parse individual attributes within the braces
    const pairs = attrString.split(/\s+/);
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key && value) {
        // Convert numeric values
        if (key === 'size') {
          const num = parseInt(value, 10);
          if (!isNaN(num)) {
            metadata[key] = num;
          }
        } else {
          metadata[key] = value;
        }
      }
    }
  }

  return { content: cleanedContent, metadata };
};

/**
 * Mapper: Converts Remark AST nodes to MD2PPT ParsedBlocks
 */
const mapNodeToBlock = (node: any): ParsedBlock[] => {
  const blocks: ParsedBlock[] = [];
  const sourceLine = node.position?.start?.line || 0;
  const startIndex = node.position?.start?.offset || 0;
  const endIndex = node.position?.end?.offset || 0;
  const base = { sourceLine, startIndex, endIndex };

  switch (node.type) {
    case 'heading': {
      const headingType = node.depth === 1 ? BlockType.HEADING_1 : node.depth === 2 ? BlockType.HEADING_2 : BlockType.HEADING_3;
      const { content, metadata } = extractAttributes(nodeToString(node));
      blocks.push({ ...base, type: headingType, content, metadata });
      break;
    }

    case 'paragraph': {
      const rawText = nodeToString(node).trim();

      // 1. Image Detection
      if (node.children?.length === 1 && node.children[0].type === 'image') {
        const img = node.children[0];
        blocks.push({ ...base, type: BlockType.IMAGE, content: img.url, metadata: { alt: img.alt } });
        break;
      }

      // 2. Chat Dialogues (Restore legacy regex support)
      const centerMatch = rawText.match(/^(.+?)\s*:\":\s*([\s\S]*)$/);
      if (centerMatch) {
          blocks.push({ ...base, type: BlockType.CHAT_CUSTOM, role: centerMatch[1].trim(), content: centerMatch[2].trim(), alignment: 'center' });
          break;
      }
      const rightMatch = rawText.match(/^(.+?)\s*::"\s*([\s\S]*)$/);
      if (rightMatch) {
          blocks.push({ ...base, type: BlockType.CHAT_CUSTOM, role: rightMatch[1].trim(), content: rightMatch[2].trim(), alignment: 'right' });
          break;
      }
      const leftMatch = rawText.match(/^(.+?)\s*"(?:::|::)\s*([\s\S]*)$/);
      if (leftMatch) {
          blocks.push({ ...base, type: BlockType.CHAT_CUSTOM, role: leftMatch[1].trim(), content: leftMatch[2].trim(), alignment: 'left' });
          break;
      }

      // 3. Column Break
      if (rawText === ':: right ::') {
          blocks.push({ ...base, type: BlockType.COLUMN_BREAK, content: '' });
          break;
      }

      const { content, metadata } = extractAttributes(rawText);
      blocks.push({ ...base, type: BlockType.PARAGRAPH, content, metadata });
      break;
    }

    case 'code':
      if (node.lang === 'mermaid') blocks.push({ ...base, type: BlockType.MERMAID, content: node.value });
      else blocks.push({ ...base, type: BlockType.CODE_BLOCK, content: node.value, metadata: { language: node.lang } });
      break;

    case 'blockquote':
      blocks.push({ ...base, type: BlockType.QUOTE_BLOCK, content: nodeToString(node).trim() });
      break;

    case 'list':
      node.children.forEach((item: any) => {
        const { content, metadata } = extractAttributes(nodeToString(item).trim());
        blocks.push({
          ...base,
          type: node.ordered ? BlockType.NUMBERED_LIST : BlockType.BULLET_LIST,
          content,
          metadata
        });
      });
      break;

    case 'table':
      const rows = node.children.map((row: any) => row.children.map((cell: any) => nodeToString(cell)));
      blocks.push({ ...base, type: BlockType.TABLE, content: '', tableRows: rows });
      break;

    case 'thematicBreak':
      blocks.push({ ...base, type: BlockType.HORIZONTAL_RULE, content: '---' });
      break;
  }
  return blocks;
};

/**
 * Parses a single slide's content using Remark.
 */
const parseSingleSlide = async (markdown: string, lineOffset: number, charOffset: number): Promise<ParsedBlock[]> => {
  const leadingWhitespaceMatch = markdown.match(/^\s*/);
  const leadingWhitespace = leadingWhitespaceMatch ? leadingWhitespaceMatch[0] : '';
  const trimmedMarkdown = markdown.trimStart();
  const internalCharOffset = leadingWhitespace.length;
  const internalLineOffset = (leadingWhitespace.match(/\n/g) || []).length;

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkFrontmatter, ['yaml']);

  const ast: any = processor.parse(trimmedMarkdown);
  const transformedAst: any = await processor.run(ast);

  const rawBlocks: ParsedBlock[] = [];
  let slideMeta = {};

  for (const node of transformedAst.children) {
    if (node.type === 'yaml') {
      try { slideMeta = yaml.load(node.value) as any; } catch (e) { console.error(e); }
      continue;
    }
    
    const mapped = mapNodeToBlock(node);
    mapped.forEach(b => {
      if (b.sourceLine !== undefined) b.sourceLine += lineOffset + internalLineOffset;
      if (b.startIndex !== undefined) b.startIndex += charOffset + internalCharOffset;
      if (b.endIndex !== undefined) b.endIndex += charOffset + internalCharOffset;
      rawBlocks.push(b);
    });
  }

  // --- CHART MERGE LOGIC (Restore from legacy) ---
  const finalBlocks: ParsedBlock[] = [];
  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i];
    
    // Detect Chart Start: ::: chart-bar { "title": "..." }
    if (block.type === BlockType.PARAGRAPH && block.content.startsWith('::: chart-')) {
      const match = block.content.match(/^::: (chart-[\w-]+)(?:\s+(.*))?$/);
      if (match) {
        const chartType = match[1].replace('chart-', '');
        let chartConfig = {};
        try { if (match[2]) chartConfig = JSON.parse(match[2]); } catch (e) {}

        // Find next Table and End marker
        let tableBlock: ParsedBlock | undefined;
        let j = i + 1;
        let foundEnd = false;
        while (j < rawBlocks.length) {
          const next = rawBlocks[j];
          if (next.type === BlockType.TABLE) tableBlock = next;
          else if (next.type === BlockType.PARAGRAPH && next.content.trim() === ':::') {
            foundEnd = true; j++; break;
          }
          j++;
        }

        if (foundEnd && tableBlock) {
          finalBlocks.push({
            type: BlockType.CHART, content: '', tableRows: tableBlock.tableRows,
            metadata: { chartType, ...chartConfig }, sourceLine: block.sourceLine
          });
          i = j - 1; continue;
        }
      }
    }
    finalBlocks.push(block);
  }

  const separatorBlock: ParsedBlock = {
    type: BlockType.HORIZONTAL_RULE,
    content: '===' ,
    metadata: slideMeta,
    sourceLine: lineOffset,
    startIndex: charOffset,
    endIndex: charOffset + 3
  };

  return [separatorBlock, ...finalBlocks];
};

export const parseMarkdownWithAST = async (markdown: string): Promise<ParsedBlock[]> => {
  const separatorRegex = /^===+$/gm;
  const allParsedBlocks: ParsedBlock[] = [];
  let lastIndex = 0;
  let match;
  const segments: string[] = [];
  const separatorPositions: number[] = [];

  while ((match = separatorRegex.exec(markdown)) !== null) {
    segments.push(markdown.substring(lastIndex, match.index));
    separatorPositions.push(match.index);
    lastIndex = match.index + match[0].length;
  }
  segments.push(markdown.substring(lastIndex));

  let currentCharOffset = 0;
  let currentLineOffset = 0;

  for (let i = 0; i < segments.length; i++) {
    const blocks = await parseSingleSlide(segments[i], currentLineOffset, currentCharOffset);
    allParsedBlocks.push(...blocks);
    currentLineOffset += (segments[i].match(/\n/g) || []).length;
    currentCharOffset += segments[i].length;
    if (i < separatorPositions.length) {
      const sep = markdown.substring(separatorPositions[i]).match(/^===+/)?.[0] || '===';
      currentCharOffset += sep.length;
      currentLineOffset += 1;
    }
  }
  return allParsedBlocks; 
};