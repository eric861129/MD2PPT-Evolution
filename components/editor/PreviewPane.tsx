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

const SlideCard: React.FC<{ 
  slide: SlideData; 
  index: number; 
  layout: { width: number; height: number };
  globalBg?: string;
}> = ({ slide, index, layout, globalBg }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        setScale(containerRef.current.offsetWidth / DESIGN_WIDTH);
      }
    };
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    updateScale();
    return () => resizeObserver.disconnect();
  }, []);

  const bgImage = slide.metadata?.bgImage;
  const rawBg = slide.metadata?.bg || globalBg || '#FFFFFF';
  const bgColor = rawBg.startsWith('#') ? rawBg : `#${rawBg}`;
  
  // 亮度偵測決定文字底色 (若有背景圖則預設深色模式/白色文字)
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 255;
  const g = parseInt(hex.substring(2, 4), 16) || 255;
  const b = parseInt(hex.substring(4, 6), 16) || 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDark = bgImage ? true : brightness < 128;

  const designHeight = DESIGN_WIDTH * (layout.height / layout.width);

  return (
    <div 
      ref={containerRef}
      className="w-full shadow-2xl relative overflow-hidden bg-slate-300 dark:bg-slate-800 rounded-sm transition-all"
      style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
    >
      <div 
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${designHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          backgroundColor: bgImage ? 'transparent' : bgColor,
          color: isDark ? '#FFFFFF' : '#333333',
          position: 'absolute',
          top: 0, left: 0,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Background Image Layer */}
        {bgImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}

        <div className={`absolute top-6 right-10 text-xs font-black uppercase tracking-[0.2em] z-20 ${isDark ? 'text-white/20' : 'text-slate-400/20'}`}>
          Slide {index + 1}
        </div>
        
        <div className={`flex-1 relative z-10 flex flex-col p-[60px_80px]`}>
          <SlideContent blocks={slide.blocks} layout={slide.metadata?.layout} isDark={isDark} />
        </div>
      </div>
    </div>
  );
};

const SlideContent: React.FC<{ blocks: ParsedBlock[], layout?: string, isDark?: boolean }> = ({ blocks, layout, isDark }) => {
  const renderBlocks = (contentBlocks: ParsedBlock[]) => {
    const elements: JSX.Element[] = [];
    let i = 0;
    while (i < contentBlocks.length) {
      const block = contentBlocks[i];
      if (block.type === BlockType.BULLET_LIST || block.type === BlockType.NUMBERED_LIST) {
        const isOrdered = block.type === BlockType.NUMBERED_LIST;
        const listItems: ParsedBlock[] = [];
        const type = block.type;
        while (i < contentBlocks.length && contentBlocks[i].type === type) {
          listItems.push(contentBlocks[i]); i++;
        }
        const ListTag = isOrdered ? 'ol' : 'ul';
        elements.push(
          <ListTag key={`list-${i}`} className={`ml-14 mb-8 ${isOrdered ? 'list-decimal' : ''}`}>
            {listItems.map((item, idx) => (
              <li key={idx} className={`mb-4 pl-4 leading-relaxed text-3xl ${!isOrdered ? "relative list-none before:content-[''] before:absolute before:left-[-1.5em] before:top-[0.6em] before:w-3 before:h-3 before:bg-orange-600" : ""}`}>
                 <RenderRichText text={item.content} />
              </li>
            ))}
          </ListTag>
        );
      } else {
        elements.push(<PreviewBlock key={i} block={block} />);
        i++;
      }
    }
    return elements;
  };

  const titleBlocks = blocks.filter(b => b.type === BlockType.HEADING_1 || b.type === BlockType.HEADING_2);
  const otherBlocks = blocks.filter(b => b.type !== BlockType.HEADING_1 && b.type !== BlockType.HEADING_2);

  if (layout === 'impact' || layout === 'full-bg') {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center py-10 scale-125 origin-center">
        <div className={`w-full ${isDark ? 'drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]' : ''}`}>{renderBlocks(blocks)}</div>
      </div>
    );
  }

  if (layout === 'two-column') {
    const mid = Math.ceil(otherBlocks.length / 2);
    return (
      <div className="flex flex-col h-full">
        {titleBlocks.length > 0 && <div className="mb-12">{renderBlocks(titleBlocks)}</div>}
        <div className="flex-1 grid grid-cols-2 gap-20 overflow-hidden text-left">
          <div>{renderBlocks(otherBlocks.slice(0, mid))}</div>
          <div>{renderBlocks(otherBlocks.slice(mid))}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-left">
      {titleBlocks.length > 0 && <div className="mb-10">{renderBlocks(titleBlocks)}</div>}
      <div className="flex-1">{renderBlocks(otherBlocks)}</div>
    </div>
  );
};

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  parsedBlocks,
  previewRef
}) => {
  const { pageSizes, selectedSizeIndex, documentMeta } = useEditor();
  const selectedLayout = pageSizes[selectedSizeIndex];
  const slides = splitBlocksToSlides(parsedBlocks);

  return (
    <div className="w-1/2 flex flex-col bg-slate-200 dark:bg-slate-900 transition-colors border-l border-slate-300 dark:border-slate-700">
      <div className="bg-white dark:bg-slate-800 px-6 py-2 border-b border-slate-300 dark:border-slate-700 text-[10px] font-bold text-slate-500 uppercase flex justify-between items-center shrink-0">
        <span>Slide Deck Preview</span>
        <span className="text-orange-600 font-black tracking-tighter uppercase">Professional Preview v2</span>
      </div>
      <div ref={previewRef} className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth bg-slate-100 dark:bg-slate-950">
        <div className="w-full max-w-[1400px] mx-auto space-y-12 pb-40">
          {slides.length > 0 ? slides.map((slide, index) => (
            <SlideCard key={index} slide={slide} index={index} layout={selectedLayout} globalBg={documentMeta.bg} />
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 mt-20 opacity-30">
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="font-bold tracking-widest uppercase">Waiting for content...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};