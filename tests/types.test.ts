import { describe, it, expect } from 'vitest';
import { BlockType, BrandConfig } from '../services/types';
import { BlockRenderer, RenderContext } from '../services/ppt/builders/types';

describe('Slide Types', () => {
  it('should have basic slide types defined', () => {
    expect(BlockType.PARAGRAPH).toBe('PARAGRAPH');
  });
});

describe('BrandConfig Type', () => {
  it('should allow creating a valid BrandConfig object', () => {
    const config: BrandConfig = {
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00',
      accentColor: '#0000ff',
      font: 'Arial',
      logoPosition: 'top-right'
    };
    expect(config.primaryColor).toBe('#ff0000');
    expect(config.logoPosition).toBe('top-right');
  });
});

describe('BlockRenderer Interface', () => {
  it('should allow implementing a mock renderer synchronously', () => {
    const mockRenderer: BlockRenderer = {
      type: BlockType.PARAGRAPH,
      render: (block: any, ctx: RenderContext) => {
        return ctx.y + 0.5; // Must return number, not Promise
      }
    };
    expect(mockRenderer.type).toBe(BlockType.PARAGRAPH);
  });
});

