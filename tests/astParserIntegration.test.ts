import { describe, it, expect } from 'vitest';
import { parseMarkdownWithAST } from '../services/parser/ast';
import { BlockType } from '../services/types';

describe('AST Parser Integration', () => {
  describe('Basic Parsing', () => {
    it('should parse headings correctly', async () => {
      const blocks = await parseMarkdownWithAST('# Slide 1');
      const heading = blocks.find(b => b.type === BlockType.HEADING_1);
      expect(heading?.content).toBe('Slide 1');
    });

    it('should handle multiple slides with physical separators', async () => {
      const md = '# S1\n\n===\n\n# S2';
      const blocks = await parseMarkdownWithAST(md);
      const separators = blocks.filter(b => b.type === BlockType.HORIZONTAL_RULE);
      expect(separators).toHaveLength(2); 
    });
  });

  describe('YAML Frontmatter', () => {
    it('should extract global metadata', async () => {
      const md = '---\ntitle: Global\n---\n# Content';
      const blocks = await parseMarkdownWithAST(md);
      expect(blocks[0].metadata?.title).toBe('Global');
    });

    it('should extract per-slide configuration accurately', async () => {
      const md = '# S1\n\n===\n---\nlayout: impact\n---\n# S2';
      const blocks = await parseMarkdownWithAST(md);
      const separators = blocks.filter(b => b.type === BlockType.HORIZONTAL_RULE);
      expect(separators[1].metadata?.layout).toBe('impact');
    });
  });

  describe('Special Features', () => {
    it('should parse chat dialogues', async () => {
      // Add double newlines to ensure Remark treats them as separate paragraphs
      const md = 'Bot :": Center Hello\n\nUser ::" Right Reply\n\nNpc ":: Left Hello';
      const blocks = await parseMarkdownWithAST(md);
      const chats = blocks.filter(b => b.type === BlockType.CHAT_CUSTOM);
      
      expect(chats).toHaveLength(3);
      expect(chats[0].alignment).toBe('center');
      expect(chats[1].alignment).toBe('right');
      expect(chats[2].alignment).toBe('left');
    });

    it('should handle column breaks (:: right ::)', async () => {
      const md = 'Left\n\n:: right ::\n\nRight';
      const blocks = await parseMarkdownWithAST(md);
      expect(blocks.some(b => b.type === BlockType.COLUMN_BREAK)).toBe(true);
    });
  });

  describe('Boundary Cases', () => {
    it('should handle multiple consecutive separators', async () => {
      const md = 'S1\n\n===\n\n===\n\nS2';
      const blocks = await parseMarkdownWithAST(md);
      const separators = blocks.filter(b => b.type === BlockType.HORIZONTAL_RULE);
      expect(separators).toHaveLength(3);
    });

    it('should handle unclosed chart containers', async () => {
      const md = '::: chart-bar\n|A|B|\n|1|2|';
      const blocks = await parseMarkdownWithAST(md);
      expect(blocks.some(b => b.type === BlockType.CHART)).toBe(false);
    });
  });
});
