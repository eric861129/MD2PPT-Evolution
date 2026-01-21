/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { BlockType, ParsedBlock, PptTheme } from '../../../services/types';

export interface PreviewRenderContext {
  isDark?: boolean;
  theme: PptTheme;
}

export interface PreviewBlockRenderer {
  type: BlockType | 'DEFAULT';
  render: (block: ParsedBlock, context: PreviewRenderContext) => React.ReactNode;
}

class PreviewRendererRegistry {
  private renderers: Map<string, PreviewBlockRenderer> = new Map();

  register(renderer: PreviewBlockRenderer) {
    this.renderers.set(renderer.type, renderer);
  }

  getRenderer(type: BlockType): PreviewBlockRenderer | undefined {
    return this.renderers.get(type) || this.renderers.get('DEFAULT');
  }
}

export const previewRendererRegistry = new PreviewRendererRegistry();
