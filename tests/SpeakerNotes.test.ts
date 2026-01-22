import { describe, it, expect } from 'vitest';
import { parseMarkdownWithAST } from '../services/parser/ast';
import { transformToSOM } from '../services/parser/som';
import { BlockType } from '../services/types';

describe('Speaker Notes Integration', () => {
  it('should parse HTML comments as notes', async () => {
    const markdown = `
# Slide 1

Content

<!-- note: Don't forget to smile! -->
`;
    const blocks = await parseMarkdownWithAST(markdown);
    
    // Check if any block is of type NOTE (if we decide to map it to a block first)
    // Or check if it's attached to metadata directly if the parser handles it that way.
    
    // Currently, without fix, this will likely fail or just be ignored.
    // Let's check the SOM transformation result, which is what matters.
    const slides = transformToSOM(blocks);
    
    expect(slides.length).toBe(1);
    // This expectation is likely to fail currently
    expect(slides[0].notes).toBe("Don't forget to smile!");
  });
});
