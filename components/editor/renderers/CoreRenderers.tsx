/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { PreviewBlockRenderer, previewRendererRegistry } from './PreviewRendererRegistry';
import { BlockType } from '../../../services/types';
import { RenderRichText } from '../PreviewRenderers';

export const HeadingRenderers: PreviewBlockRenderer[] = [
  {
    type: BlockType.HEADING_1,
    render: (block, { theme }) => (
      <h1 
        data-source-line={block.sourceLine}
        data-block-type={block.type}
        className="text-5xl font-black mb-6 border-l-[10px] pl-6 leading-tight uppercase tracking-tighter" 
        style={{ borderColor: `#${theme.colors.primary}`, color: 'inherit' }}
      >
        <RenderRichText text={block.content} theme={theme} />
      </h1>
    )
  },
  {
    type: BlockType.HEADING_2,
    render: (block, { theme, isDark }) => {
      const primaryColor = `#${theme.colors.primary}`;
      const accentColor = `#${theme.colors.accent}`;
      const safeAccentColor = !isDark && (theme.name === 'midnight' || theme.name === 'dark-matter') 
        ? primaryColor 
        : accentColor;
      return (
        <h2 
          data-source-line={block.sourceLine}
          data-block-type={block.type}
          className="text-3xl font-bold mb-4 tracking-tight" 
          style={{ color: isDark ? '#E2E8F0' : safeAccentColor }}
        >
          <RenderRichText text={block.content} theme={theme} />
        </h2>
      );
    }
  }
];

export const registerCoreRenderers = () => {
  HeadingRenderers.forEach(r => previewRendererRegistry.register(renderer));
};
