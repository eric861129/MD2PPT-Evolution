import { describe, it, expect, vi } from 'vitest';
import { BlockType } from '../services/types';
import { heading1Renderer } from '../services/ppt/builders/Heading1Renderer';
import { paragraphRenderer } from '../services/ppt/builders/ParagraphRenderer';
import { bulletListRenderer } from '../services/ppt/builders/ListRenderer';
import { imageRenderer } from '../services/ppt/builders/ImageRenderer';
import { codeBlockRenderer } from '../services/ppt/builders/CodeBlockRenderer';

describe('Core Renderers', () => {
  const mockSlide = { addText: vi.fn(), addImage: vi.fn(), addShape: vi.fn() };
  const mockCtx = {
    slide: mockSlide,
    pptx: { ShapeType: { rect: 'rect' } },
    x: 1, y: 1, w: 8,
    options: { big: false, isDark: false }
  };

  it('Heading1Renderer should render and return new Y', () => {
    const block = { type: BlockType.HEADING_1, content: 'Title' };
    const newY = heading1Renderer.render(block, mockCtx as any);
    expect(mockSlide.addText).toHaveBeenCalled();
    expect(newY).toBe(1.9); // 1 + 0.9
  });

  it('ParagraphRenderer should render and return new Y', () => {
    const block = { type: BlockType.PARAGRAPH, content: 'Text' };
    const newY = paragraphRenderer.render(block, mockCtx as any);
    expect(mockSlide.addText).toHaveBeenCalled();
    expect(newY).toBe(1.5); // 1 + 0.5
  });

  it('ListRenderer should render and return new Y', () => {
    const block = { type: BlockType.BULLET_LIST, content: 'Item 1\nItem 2' };
    const newY = bulletListRenderer.render(block, mockCtx as any);
    expect(mockSlide.addText).toHaveBeenCalled();
    expect(newY).toBeGreaterThan(1);
  });

  it('ImageRenderer should render and return new Y', () => {
    const block = { type: BlockType.IMAGE, content: 'data:image/png;base64,abc' };
    const newY = imageRenderer.render(block, mockCtx as any);
    expect(mockSlide.addImage).toHaveBeenCalled();
    expect(newY).toBe(3.7); // 1 + 2.7
  });

  it('CodeBlockRenderer should render pre-highlighted tokens', () => {
    const block = { 
      type: BlockType.CODE_BLOCK, 
      content: 'code', 
      metadata: { 
        tokens: [[{ content: 'code', color: '#ff0000' }]] 
      } 
    };
    const newY = codeBlockRenderer.render(block, mockCtx as any);
    expect(mockSlide.addText).toHaveBeenCalled();
    expect(newY).toBeGreaterThan(1);
  });
});

