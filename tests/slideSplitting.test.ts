import { describe, it, expect } from 'vitest';
import { BlockType, ParsedBlock } from '../services/types';
import { splitBlocksToSlides } from '../services/parser/slides';

describe('Slide Splitting Logic', () => {
  it('should split blocks by boundary marker (===)', () => {
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

  it('should extract background color from boundary parameters', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Slide 1' },
      { type: BlockType.HORIZONTAL_RULE, content: '---', metadata: { bg: '#FF5500' } },
      { type: BlockType.PARAGRAPH, content: 'Slide 2' },
    ];

    const slides = splitBlocksToSlides(blocks);
    expect(slides).toHaveLength(2);
    expect(slides[1].metadata?.bg).toBe('#FF5500');
  });

  it('should handle a complex sequence of slides with mixed metadata', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Title Page' },
      { type: BlockType.HORIZONTAL_RULE, content: '---', metadata: { bg: '#000', layout: 'impact' } },
      { type: BlockType.HEADING_2, content: 'Impact Message' },
      { type: BlockType.HORIZONTAL_RULE, content: '---', metadata: { layout: 'two-column' } },
      { type: BlockType.PARAGRAPH, content: 'Col 1' },
      { type: BlockType.PARAGRAPH, content: 'Col 2' },
    ];

    const slides = splitBlocksToSlides(blocks);
    expect(slides).toHaveLength(3);
    expect(slides[0].metadata).toEqual({});
    expect(slides[1].metadata?.bg).toBe('#000');
    expect(slides[1].metadata?.layout).toBe('impact');
    expect(slides[2].metadata?.layout).toBe('two-column');
  });
});