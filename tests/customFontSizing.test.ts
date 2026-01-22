import { describe, it, expect } from 'vitest';
import { parseMarkdownWithAST } from '../services/parser/ast';
import { BlockType } from '../services/types';

describe('Custom Font Sizing Parser', () => {
  it('should extract size attribute from headings', async () => {
    const md = '# Hello World {size=48}';
    const blocks = await parseMarkdownWithAST(md);
    
    // First block is HR (Slide Separator)
    // Second block is H1
    const heading = blocks.find(b => b.type === BlockType.HEADING_1);
    expect(heading).toBeDefined();
    expect(heading?.metadata?.size).toBe(48);
    expect(heading?.content).toBe('Hello World');
  });

  it('should extract size attribute from paragraphs', async () => {
    const md = 'This is a test {size=24}';
    const blocks = await parseMarkdownWithAST(md);
    
    const p = blocks.find(b => b.type === BlockType.PARAGRAPH);
    expect(p).toBeDefined();
    expect(p?.metadata?.size).toBe(24);
    expect(p?.content).toBe('This is a test');
  });

  it('should extract size attribute from list items', async () => {
    const md = '- Item One {size=20}\n- Item Two';
    const blocks = await parseMarkdownWithAST(md);
    
    const listItems = blocks.filter(b => b.type === BlockType.BULLET_LIST);
    expect(listItems[0].metadata?.size).toBe(20);
    expect(listItems[0].content).toBe('Item One');
    expect(listItems[1].metadata?.size).toBeUndefined();
    expect(listItems[1].content).toBe('Item Two');
  });

  it('should handle invalid or missing size gracefully', async () => {
    const md = '# No Size Here';
    const blocks = await parseMarkdownWithAST(md);
    
    const heading = blocks.find(b => b.type === BlockType.HEADING_1);
    expect(heading?.metadata?.size).toBeUndefined();
    expect(heading?.content).toBe('No Size Here');
  });
  
  it('should handle non-numeric size gracefully', async () => {
    const md = '# Wrong Format {size=abc}';
    const blocks = await parseMarkdownWithAST(md);
    
    const heading = blocks.find(b => b.type === BlockType.HEADING_1);
    expect(heading?.metadata?.size).toBeUndefined();
    // If it doesn't match the expected {size=\d+}, it might still be in the content
    // This test will help decide how strict the regex should be.
  });
});
