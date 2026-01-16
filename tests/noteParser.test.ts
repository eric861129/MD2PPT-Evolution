import { describe, it, expect } from 'vitest';
import { parseMarkdownWithAST } from '../services/parser/ast';
import { BlockType } from '../services/types';

describe('Note Parser Logic', () => {
  it('should parse single-line note comment', () => {
    const markdown = `# Slide 1\n<!-- note: This is a note -->`;
    const blocks = parseMarkdownWithAST(markdown);
    
    const noteBlock = blocks.find(b => b.type === BlockType.NOTE);
    expect(noteBlock).toBeDefined();
    expect(noteBlock?.content).toBe('This is a note');
  });

  it('should parse multi-line note comment', () => {
    const markdown = `
# Slide 1
<!-- note:
Line 1
Line 2
-->
    `;
    const blocks = parseMarkdownWithAST(markdown);
    const noteBlock = blocks.find(b => b.type === BlockType.NOTE);
    expect(noteBlock?.content).toContain('Line 1');
    expect(noteBlock?.content).toContain('Line 2');
  });

  it('should not confuse regular comments with notes', () => {
    const markdown = `<!-- regular comment -->`;
    const blocks = parseMarkdownWithAST(markdown);
    expect(blocks.find(b => b.type === BlockType.NOTE)).toBeUndefined();
  });
});
