/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ParsedBlock, BlockType } from '../../services/types';
import { PreviewBlock, RenderRichText } from './PreviewRenderers';
import { UI_THEME } from '../../constants/theme';
import { splitBlocksToSlides, SlideData } from '../../services/parser/slides';
import { useEditor } from '../../contexts/EditorContext';

interface PreviewPaneProps {
  parsedBlocks: ParsedBlock[];
  previewRef: React.RefObject<HTMLDivElement>;
}

const DESIGN_WIDTH = 1200;

const SlideCard: React.FC<{ slide: SlideData; index: number; layout: { width: number; height: number }; globalBg?: string; }> = ({ slide, index, layout, globalBg }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => { if (containerRef.current) setScale(containerRef.current.offsetWidth / DESIGN_WIDTH); };
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    updateScale();
    return () => resizeObserver.disconnect();
  }, []);

  const bgImage = slide.config?.bgImage || slide.metadata?.bgImage;
  const rawBg = slide.config?.background || slide.config?.bg || slide.metadata?.bg || globalBg || '#FFFFFF';
  const bgColor = rawBg.startsWith('#') ? rawBg : `#${rawBg}`;
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 255;
  const g = parseInt(hex.substring(2, 4), 16) || 255;
  const b = parseInt(hex.substring(4, 6), 16) || 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDark = bgImage ? true : brightness < 128;
  const designHeight = DESIGN_WIDTH * (layout.height / layout.width);

  return (
    <div ref={containerRef} className="w-full shadow-[0_30px_60px_rgba(0,0,0,0.12)] relative overflow-hidden bg-[#E7E5E4] dark:bg-[#44403C] rounded-lg transition-all" style={{ aspectRatio: `${layout.width} / ${layout.height}` }}>
      <div style={{ width: `${DESIGN_WIDTH}px`, height: `${designHeight}px`, transform: `scale(${scale})`, transformOrigin: 'top left', backgroundColor: bgImage ? 'transparent' : bgColor, color: isDark ? '#FFFFFF' : '#1C1917', position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {bgImage && <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bgImage})` }}><div className="absolute inset-0 bg-black/40"></div></div>}
        <div className={`absolute top-6 right-10 text-xs font-black uppercase tracking-[0.3em] z-20 ${isDark ? 'text-white/20' : 'text-stone-400/20'}`}>Slide {index + 1}</div>
        <div className="flex-1 relative z-10 flex flex-col p-[80px_100px]"><SlideContent blocks={slide.blocks} layout={slide.config?.layout || slide.metadata?.layout} isDark={isDark} /></div>
      </div>
    </div>
  );
};

const SlideContent: React.FC<{ blocks: ParsedBlock[], layout?: string, isDark?: boolean }> = ({ blocks, layout, isDark }) => {
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
        elements.push(<ListTag key={`list-${i}`} className={`ml-14 mb-8 ${isOrdered ? 'list-decimal' : ''}`}>{listItems.map((item, idx) => (<li key={idx} className={`mb-5 pl-4 leading-relaxed text-4xl ${!isOrdered ? "relative list-none before:content-[''] before:absolute before:left-[-1.5em] before:top-[0.6em] before:w-3.5 before:h-3.5 before:bg-[#EA580C] before:rounded-full" : ""}`}><RenderRichText text={item.content} /></li>))}</ListTag>);
      } else { elements.push(<PreviewBlock key={i} block={block} />); i++; }
    }
    return elements;
  };

  const titleBlocks = blocks.filter(b => b.type === BlockType.HEADING_1 || b.type === BlockType.HEADING_2);
  const otherBlocks = blocks.filter(b => b.type !== BlockType.HEADING_1 && b.type !== BlockType.HEADING_2);

  if (layout === 'impact' || layout === 'full-bg' || layout === 'center') {
    const isImpact = layout === 'impact' || layout === 'full-bg';
    return (
      <div className={`flex flex-col h-full items-center justify-center text-center ${isImpact ? 'scale-125 origin-center' : ''}`}>
        <div className={`w-full ${isDark && isImpact ? 'drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)]' : ''}`}>
          {renderBlocks(blocks)}
        </div>
      </div>
    );
  }
  
  if (layout === 'two-column') {
    const mid = Math.ceil(otherBlocks.length / 2);
    return (<div className="flex flex-col h-full">{titleBlocks.length > 0 && <div className="mb-16">{renderBlocks(titleBlocks)}</div>}<div className="flex-1 grid grid-cols-2 gap-24 overflow-hidden text-left"><div>{renderBlocks(otherBlocks.slice(0, mid))}</div><div>{renderBlocks(otherBlocks.slice(mid))}</div></div></div>);
  }
  return (<div className="flex flex-col h-full text-left">{titleBlocks.length > 0 && <div className="mb-14">{renderBlocks(titleBlocks)}</div>}<div className="flex-1">{renderBlocks(otherBlocks)}</div></div>);
};

export const PreviewPane: React.FC<PreviewPaneProps> = ({ parsedBlocks, previewRef }) => {
  const { pageSizes, selectedSizeIndex, documentMeta } = useEditor();
  const selectedLayout = pageSizes[selectedSizeIndex];
  const slides = splitBlocksToSlides(parsedBlocks);

  return (
    <div className="w-1/2 flex flex-col bg-[#F5F5F4] dark:bg-[#0C0A09] transition-colors duration-500 border-l border-[#E7E5E4] dark:border-[#44403C]">
      <div className="bg-white dark:bg-[#1C1917] px-6 py-2.5 border-b border-[#E7E5E4] dark:border-[#44403C] flex justify-between items-center shrink-0">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Canvas Preview</span>
        <div className="flex items-center gap-2 text-[#EA580C] font-black text-[10px] uppercase tracking-tighter">
          <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span> Evolution Engine
        </div>
      </div>
      <div ref={previewRef} className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth bg-transparent">
        <div className="w-full max-w-[1600px] mx-auto space-y-12 pb-60">
          {slides.length > 0 ? slides.map((slide, index) => (
            <SlideCard key={index} slide={slide} index={index} layout={selectedLayout} globalBg={documentMeta.bg} />
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-300 dark:text-stone-700 mt-20 opacity-30"><Sparkles className="w-16 h-16 mb-6" /><p className="font-bold tracking-[0.5em] uppercase">Composition Canvas</p></div>
          )}
        </div>
      </div>
    </div>
  );
};
