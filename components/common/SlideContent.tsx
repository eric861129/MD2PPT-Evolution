/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { ParsedBlock, BlockType, PptTheme } from '../../services/types';
import { PreviewBlock, RenderRichText } from '../editor/PreviewRenderers';
import { SlideObject } from '../../services/parser/som';

export const SlideContent: React.FC<{ slide: SlideObject, isDark?: boolean, theme: PptTheme }> = memo(({ slide, isDark, theme }) => {
  const { regions, layout } = slide;

  const renderBlocks = (contentBlocks: ParsedBlock[]) => {
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < contentBlocks.length) {
      const block = contentBlocks[i];
      if (block.type === BlockType.BULLET_LIST || block.type === BlockType.NUMBERED_LIST) {
        const isOrdered = block.type === BlockType.NUMBERED_LIST;
        const listItems: ParsedBlock[] = [];
        const type = block.type;
        while (i < contentBlocks.length && contentBlocks[i].type === type) { listItems.push(contentBlocks[i]); i++; }
        const ListTag = isOrdered ? 'ol' : 'ul';
        elements.push(<ListTag key={`list-${i}`} className={`ml-14 mb-4 ${isOrdered ? 'list-decimal' : ''}`}>{listItems.map((item, idx) => (<li key={idx} className={`mb-2 pl-4 leading-relaxed text-2xl ${!isOrdered ? "relative list-none before:content-[''] before:absolute before:left-[-1.5em] before:top-[0.6em] before:w-2.5 before:h-2.5 before:rounded-full" : ""}`} style={{ '--tw-before-bg': `#${theme.colors.primary}` } as any}><span className="before:bg-[var(--tw-before-bg)] absolute left-[-1.5em] top-[0.6em] w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `#${theme.colors.primary}` }}></span><RenderRichText text={item.content} theme={theme} /></li>))}</ListTag>);
      } else { elements.push(<PreviewBlock key={i} block={block} isDark={isDark} theme={theme} />); i++; }
    }
    return elements;
  };

  if (layout === 'impact' || layout === 'full-bg' || layout === 'center' || layout === 'quote') {
    const isImpact = layout === 'impact' || layout === 'full-bg';
    const isQuote = layout === 'quote';
    const allBlocks = regions.flatMap(r => r.blocks);
    
    return (
      <div className={`flex flex-col h-full items-center justify-center text-center ${isImpact ? 'scale-110 origin-center' : ''}`}>
        <div className={`w-full ${isDark && isImpact ? 'drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)]' : ''} ${isQuote ? 'italic opacity-90 relative' : ''}`}>
          {isQuote && <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-[120px] leading-none opacity-20 pointer-events-none font-serif" style={{ color: `#${theme.colors.primary}` }}>“</div>}
          <div className={isQuote ? 'text-5xl md:text-6xl font-medium tracking-tight px-10' : ''}>
            {renderBlocks(allBlocks)}
          </div>
          {isQuote && <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-[120px] leading-none opacity-20 pointer-events-none font-serif mt-6" style={{ color: `#${theme.colors.primary}` }}>”</div>}
        </div>
      </div>
    );
  }
  
  if (layout === 'alert') {
    const allBlocks = regions.flatMap(r => r.blocks);
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="w-full p-12 rounded-3xl text-center border-4" style={{ backgroundColor: `#${theme.colors.primary}15`, borderColor: `#${theme.colors.primary}` }}>
          <div className="mb-6 flex justify-center scale-[2]" style={{ color: `#${theme.colors.primary}` }}>
            <Sparkles />
          </div>
          <div className="space-y-4">
            {renderBlocks(allBlocks)}
          </div>
        </div>
      </div>
    );
  }

  const headerRegion = regions.find(r => r.type === 'header');
  const columnRegions = regions.filter(r => r.type === 'column');
  const mainRegion = regions.find(r => r.type === 'main');

  return (
    <div className="flex flex-col h-full text-left">
      {headerRegion && <div className="mb-10">{renderBlocks(headerRegion.blocks)}</div>}
      
      {columnRegions.length > 0 ? (
        <div 
          className="flex-1 grid gap-12 overflow-visible text-left" 
          style={{ gridTemplateColumns: `repeat(${columnRegions.length}, minmax(0, 1fr))` }}
        >
          {columnRegions.map((region, idx) => (
            <div key={idx}>{renderBlocks(region.blocks)}</div>
          ))}
        </div>
      ) : mainRegion ? (
        <div className="flex-1">{renderBlocks(mainRegion.blocks)}</div>
      ) : null}
    </div>
  );
}, (prev, next) => {
  return prev.slide === next.slide && prev.isDark === next.isDark && prev.theme.id === next.theme.id;
});
