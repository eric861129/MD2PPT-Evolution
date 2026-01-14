import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../services/markdownParser';
import { BlockType } from '../services/types';

describe('markdownParser', () => {
  it('should parse global frontmatter and slide sections correctly', () => {
    const input = [
      '---',
      'title: My PPT',
      '---',
      '# Slide 1',
      '===' ,
      '---',
      'layout: impact',
      '---',
      '# Slide 2'
    ].join('\n');
    const { blocks, meta } = parseMarkdown(input);
    
    expect(meta.title).toBe('My PPT');
    // Expected blocks: [HR(meta), H1, HR(layout:impact), H1] -> Length 4
    expect(blocks).toHaveLength(4);
    expect(blocks[0].type).toBe(BlockType.HORIZONTAL_RULE);
    expect(blocks[2].metadata?.layout).toBe('impact');
  });

  it('should parse standalone images correctly', () => {
    const md = '![Alt](https://example.com/img.png)';
    const { blocks } = parseMarkdown(md);
    // [HR, IMAGE]
    expect(blocks).toHaveLength(2);
    expect(blocks[1].type).toBe(BlockType.IMAGE);
  });
});