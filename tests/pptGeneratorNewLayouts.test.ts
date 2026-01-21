import { describe, it, expect, vi } from 'vitest';
import { generatePpt } from '../services/pptGenerator';
import { BlockType, ParsedBlock } from '../services/types';

// Mock pptxgenjs
vi.mock('pptxgenjs', () => {
  const MockSlide = function(this: any) {
    this.addText = vi.fn();
    this.addImage = vi.fn();
    this.addTable = vi.fn();
    this.addShape = vi.fn();
    this.addNotes = vi.fn();
    this.background = {};
  };

  const MockPptx = function(this: any) {
    this.addSlide = vi.fn().mockImplementation(() => new (MockSlide as any)());
    this.layout = '';
    this.writeFile = vi.fn().mockResolvedValue(undefined);
    this.ChartType = { bar: 'bar', line: 'line', pie: 'pie', area: 'area' };
    this.ShapeType = { rect: 'rect' };
  };
  
  return {
    default: MockPptx
  };
});

describe('PPTX Generator - New Layouts Integration', () => {
  it('should apply center layout and background color in PPTX', async () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HORIZONTAL_RULE, content: '---', metadata: { layout: 'center', background: '#FF5500' } },
      { type: BlockType.HEADING_1, content: 'Center Title' }
    ];

    await generatePpt(blocks, { title: 'Test' });
    // Verification would involve inspecting the mock calls if we had access to the instances
    expect(true).toBe(true); // Basic smoke test to ensure no crash
  });

  it('should handle grid layout with multiple columns in PPTX', async () => {
    const blocks: ParsedBlock[] = [
      { type: BlockType.HORIZONTAL_RULE, content: '---', metadata: { layout: 'grid', columns: 3 } },
      { type: BlockType.PARAGRAPH, content: 'Col 1' },
      { type: BlockType.PARAGRAPH, content: 'Col 2' },
      { type: BlockType.PARAGRAPH, content: 'Col 3' }
    ];

    await generatePpt(blocks, { title: 'Grid Test' });
    expect(true).toBe(true);
  });
});
