import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../services/markdownParser';
import { splitBlocksToSlides } from '../services/parser/slides';

describe('Note Integration (Parser to SOM)', () => {
  it('should extract <!-- note: ... --> and put it into slide config', () => {
    const md = `
# Slide 1
<!-- note: This is my private note -->
===
# Slide 2
<!-- note: Line A
Line B -->
    `;
    
    const { blocks } = parseMarkdown(md);
    const slides = splitBlocksToSlides(blocks);
    
    expect(slides).toHaveLength(2);
    expect(slides[0].config?.note).toBe('This is my private note');
    expect(slides[1].config?.note).toContain('Line A');
    expect(slides[1].config?.note).toContain('Line B');
    
    // Ensure notes are NOT in the blocks (content)
    expect(slides[0].blocks.find(b => b.type === 'NOTE' as any)).toBeUndefined();
  });
});
