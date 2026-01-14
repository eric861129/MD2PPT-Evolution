import { describe, it, expect } from 'vitest';
import { BlockType, ParsedBlock } from '../services/types';
import { splitBlocksToSlides } from '../services/parser/slides';

describe('Slide Splitting Logic', () => {
  it('should split blocks by horizontal rule (---)', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Slide 1' },
      { type: BlockType.PARAGRAPH, content: 'Content 1' },
      { type: BlockType.HORIZONTAL_RULE, content: '---' },
      { type: BlockType.HEADING_1, content: 'Slide 2' },
      { type: BlockType.PARAGRAPH, content: 'Content 2' },
    ];

    const slides = splitBlocksToSlides(blocks);
    expect(slides).toHaveLength(2);
    expect(slides[0].blocks).toHaveLength(2);
    expect(slides[1].blocks).toHaveLength(2);
  });

  it('should split blocks by H1 and H2 headers', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Title 1' },
      { type: BlockType.PARAGRAPH, content: 'Some text' },
      { type: BlockType.HEADING_2, content: 'Title 2' },
      { type: BlockType.PARAGRAPH, content: 'More text' },
    ];

    const slides = splitBlocksToSlides(blocks);
    expect(slides).toHaveLength(2);
  });

  it('should handle multiple H1s and horizontal rules correctly', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Start' },
      { type: BlockType.HORIZONTAL_RULE, content: '---' },
      { type: BlockType.HORIZONTAL_RULE, content: '---' },
      { type: BlockType.HEADING_1, content: 'End' },
    ];

    const slides = splitBlocksToSlides(blocks);
    expect(slides).toHaveLength(3); 
  });
});
