import { describe, it, expect } from 'vitest';
import { BlockType, ParsedBlock } from '../services/types';
import { splitBlocksToSlides } from '../services/parser/slides';

describe('pptGenerator - Slide Splitting Logic', () => {
  it('should split blocks by boundary marker (===)', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Slide 1' },
      { type: BlockType.PARAGRAPH, content: 'Content 1' },
      { type: BlockType.HORIZONTAL_RULE, content: '===' },
      { type: BlockType.HEADING_1, content: 'Slide 2' },
      { type: BlockType.PARAGRAPH, content: 'Content 2' },
    ];

    const slides = splitBlocksToSlides(blocks);
    expect(slides).toHaveLength(2);
    expect(slides[0].blocks).toHaveLength(2); // Heading + Paragraph
    expect(slides[1].blocks).toHaveLength(2); // Heading + Paragraph
  });

  it('should NOT split blocks by H1 and H2 headers automatically', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Title 1' },
      { type: BlockType.PARAGRAPH, content: 'Some text' },
      { type: BlockType.HEADING_2, content: 'Title 2' },
      { type: BlockType.PARAGRAPH, content: 'More text' },
    ];

    const slides = splitBlocksToSlides(blocks);
    // Should be 1 slide because no === was used
    expect(slides).toHaveLength(1);
  });

  it('should handle boundary markers correctly', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Start' },
      { type: BlockType.HORIZONTAL_RULE, content: '===' },
      { type: BlockType.HORIZONTAL_RULE, content: '===' }, // Empty slide
      { type: BlockType.HEADING_1, content: 'End' },
    ];

    const slides = splitBlocksToSlides(blocks);
    expect(slides).toHaveLength(3); 
  });

  it('should include code blocks in the slides', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Code Demo' },
      { type: BlockType.CODE_BLOCK, content: 'console.log("hello");', metadata: { language: 'js' } },
    ];

    const slides = splitBlocksToSlides(blocks);
    expect(slides).toHaveLength(1);
    expect(slides[0].blocks).toContainEqual(expect.objectContaining({ type: BlockType.CODE_BLOCK }));
  });

  it('should handle chat blocks in splitting logic', () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Chat' },
      { type: BlockType.CHAT_CUSTOM, content: 'Hello', role: 'User', alignment: 'right' },
    ];

    const slides = splitBlocksToSlides(blocks);
    expect(slides).toHaveLength(1);
    expect(slides[0].blocks).toHaveLength(2);
  });
});