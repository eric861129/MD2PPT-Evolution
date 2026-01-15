import { describe, it, expect, vi } from 'vitest';
import { generatePpt } from '../services/pptGenerator';
import { BlockType, ParsedBlock } from '../services/types';
import PptxGenJS from 'pptxgenjs';

import { rendererRegistry } from '../services/ppt/builders/registry';

// Mock pptxgenjs
vi.mock('pptxgenjs', () => {
  const mockSlide = {
    addText: vi.fn(),
    addShape: vi.fn(),
    addImage: vi.fn(),
    addNotes: vi.fn(),
    background: {}
  };
  const mockPptx = {
    addSlide: vi.fn().mockReturnValue(mockSlide),
    writeFile: vi.fn().mockResolvedValue(undefined),
    layout: '',
    ShapeType: { rect: 'rect', roundRect: 'roundRect' }
  };
  return {
    default: vi.fn().mockImplementation(function() {
      return mockPptx;
    })
  };
});

describe('pptGenerator Architecture', () => {
  it('should prefer Registry over fallback switch', async () => {
    const getSpy = vi.spyOn(rendererRegistry, 'getRenderer');
    const blocks: ParsedBlock[] = [{ type: BlockType.HEADING_1, content: 'Test' }];
    await generatePpt(blocks);
    expect(getSpy).toHaveBeenCalledWith(BlockType.HEADING_1);
  });

  it('should call addSlide and addText for a simple heading', async () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HEADING_1, content: 'Hello World' }
    ];
    
    await generatePpt(blocks, { title: 'Test' });
    
    // Verify pptxgenjs was used
    const PptxMock = vi.mocked(PptxGenJS);
    const pptxInstance = PptxMock.mock.results[0].value;
    
    expect(pptxInstance.addSlide).toHaveBeenCalled();
    
    const slideInstance = pptxInstance.addSlide.mock.results[0].value;
    expect(slideInstance.addText).toHaveBeenCalledWith(
      'Hello World',
      expect.objectContaining({ fontSize: 36 })
    );
  });

  it('should run pre-processing for images and code blocks without crashing', async () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.CODE_BLOCK, content: 'const x = 1;', metadata: { language: 'javascript' } },
      { type: BlockType.IMAGE, content: 'https://example.com/test.png' }
    ];
    
    // This should execute the pre-processing logic in generatePpt
    await expect(generatePpt(blocks)).resolves.not.toThrow();
  });
});
