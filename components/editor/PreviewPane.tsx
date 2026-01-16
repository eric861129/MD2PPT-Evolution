/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Sparkles, StickyNote } from 'lucide-react';
import { ParsedBlock, BlockType, PptTheme } from '../../services/types';
import { PreviewBlock, RenderRichText } from './PreviewRenderers';
import { splitBlocksToSlides, SlideData } from '../../services/parser/slides';
import { useEditor } from '../../contexts/EditorContext';
import { fileToBase64 } from '../../utils/imageUtils';

interface PreviewPaneProps {
  parsedBlocks: ParsedBlock[];
  previewRef: React.RefObject<HTMLDivElement>;
  onUpdateSlideConfig?: (index: number, key: string, value: string) => void;
}

const DESIGN_WIDTH = 1200;

const SlideCard: React.FC<{ 
  slide: SlideData; 
  index: number; 
  layout: { width: number; height: number }; 
  theme: PptTheme;
  globalBg?: string;
  onUpdateConfig?: (index: number, key: string, value: string) => void;
  showNotes?: boolean;
}> = ({ slide, index, layout, theme, globalBg, onUpdateConfig, showNotes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  useLayoutEffect(() => {
    const updateScale = () => { if (containerRef.current) setScale(containerRef.current.offsetWidth / DESIGN_WIDTH); };
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    updateScale();
    return () => resizeObserver.disconnect();
  }, []);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onUpdateConfig) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        try {
          const base64 = await fileToBase64(file);
          onUpdateConfig(index, 'bgImage', base64);
        } catch (err) {
          console.error("Failed to process dropped image", err);
        }
      }
    }
  };

  const bgImage = slide.config?.bgImage || slide.metadata?.bgImage;
  
  // Theme Overrides
  const themeBg = theme.colors.background.startsWith('#') ? theme.colors.background : `#${theme.colors.background}`;
  const themeText = theme.colors.text.startsWith('#') ? theme.colors.text : `#${theme.colors.text}`;
  
  const rawBg = slide.config?.background || slide.config?.bg || slide.metadata?.bg || globalBg || themeBg;
  const bgColor = rawBg.startsWith('#') ? rawBg : `#${rawBg}`;
  
  // Calculate brightness for auto-text-color if not on theme default
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 255;
  const g = parseInt(hex.substring(2, 4), 16) || 255;
  const b = parseInt(hex.substring(4, 6), 16) || 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  const isDark = bgImage ? true : brightness < 128;
  const textColor = bgImage ? '#FFFFFF' : (isDark ? '#FFFFFF' : themeText);
  
  const designHeight = DESIGN_WIDTH * (layout.height / layout.width);
  const transitionType = slide.config?.transition || 'none';

  const note = slide.config?.note || slide.metadata?.note;

  return (
    <div className="flex flex-col gap-4">
      <div 
        ref={containerRef}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`w-full shadow-[0_30px_60px_rgba(0,0,0,0.12)] relative overflow-hidden bg-[#E7E5E4] dark:bg-[#44403C] rounded-lg transition-all duration-500 ${
          transitionType === 'fade' ? 'animate-in fade-in' : 
          transitionType === 'slide' ? 'animate-in slide-in-from-right' : 
          transitionType === 'zoom' ? 'animate-in zoom-in' : ''
        } ${isDragging ? 'ring-4 ring-orange-500 scale-[1.02]' : ''}`} 
        style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
      >
        <div style={{ 
          width: `${DESIGN_WIDTH}px`, 
          height: `${designHeight}px`, 
          transform: `scale(${scale})`, 
          transformOrigin: 'top left', 
          backgroundColor: bgImage ? 'transparent' : bgColor, 
          color: textColor, 
          fontFamily: theme.fonts.main,
          position: 'absolute', 
          top: 0, 
          left: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden' 
        }}>
          {bgImage && <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bgImage})` }}><div className="absolute inset-0 bg-black/40"></div></div>}
          <div className={`absolute top-6 right-10 text-xs font-black uppercase tracking-[0.3em] z-20 ${isDark ? 'text-white/20' : 'text-stone-400/20'}`}>Slide {index + 1}</div>
          <div className="flex-1 relative z-10 flex flex-col p-[80px_100px]"><SlideContent slide={slide} isDark={isDark} theme={theme} /></div>
        </div>
      </div>

      {showNotes && note && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-wider">
            <StickyNote size={14} /> Speaker Notes
          </div>
          <div className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {note}
          </div>
        </div>
      )}
    </div>
  );
};

const SlideContent: React.FC<{ slide: SlideData, isDark?: boolean, theme: PptTheme }> = ({ slide, isDark, theme }) => {
  const { blocks, config } = slide;
  const layout = config?.layout;

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
        elements.push(<ListTag key={`list-${i}`} className={`ml-14 mb-8 ${isOrdered ? 'list-decimal' : ''}`}>{listItems.map((item, idx) => (<li key={idx} className={`mb-5 pl-4 leading-relaxed text-4xl ${!isOrdered ? "relative list-none before:content-[''] before:absolute before:left-[-1.5em] before:top-[0.6em] before:w-3.5 before:h-3.5 before:rounded-full" : ""}`} style={{ '--tw-before-bg': `#${theme.colors.primary}` } as any}><span className="before:bg-[var(--tw-before-bg)] absolute left-[-1.5em] top-[0.6em] w-3.5 h-3.5 rounded-full" style={{ backgroundColor: `#${theme.colors.primary}` }}></span><RenderRichText text={item.content} /></li>))}</ListTag>);
      } else { elements.push(<PreviewBlock key={i} block={block} isDark={isDark} theme={theme} />); i++; }
    }
    return elements;
  };

  const titleBlocks = blocks.filter(b => b.type === BlockType.HEADING_1 || b.type === BlockType.HEADING_2);
  const otherBlocks = blocks.filter(b => b.type !== BlockType.HEADING_1 && b.type !== BlockType.HEADING_2);

  if (layout === 'impact' || layout === 'full-bg' || layout === 'center' || layout === 'quote') {
    const isImpact = layout === 'impact' || layout === 'full-bg';
    const isQuote = layout === 'quote';
    
    return (
      <div className={`flex flex-col h-full items-center justify-center text-center ${isImpact ? 'scale-125 origin-center' : ''}`}>
        <div className={`w-full ${isDark && isImpact ? 'drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)]' : ''} ${isQuote ? 'italic opacity-90 relative' : ''}`}>
          {isQuote && <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-[160px] leading-none opacity-20 pointer-events-none font-serif" style={{ color: `#${theme.colors.primary}` }}>“</div>}
          <div className={isQuote ? 'text-6xl md:text-7xl font-medium tracking-tight px-10' : ''}>
            {renderBlocks(blocks)}
          </div>
          {isQuote && <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-[160px] leading-none opacity-20 pointer-events-none font-serif mt-10" style={{ color: `#${theme.colors.primary}` }}>”</div>}
        </div>
      </div>
    );
  }
  
  if (layout === 'alert') {
    return (
      <div className="flex flex-col h-full items-center justify-center p-10">
        <div className="w-full p-16 rounded-3xl text-center border-4" style={{ backgroundColor: `#${theme.colors.primary}15`, borderColor: `#${theme.colors.primary}` }}>
          <div className="mb-8 flex justify-center scale-[3]" style={{ color: `#${theme.colors.primary}` }}>
            <Sparkles />
          </div>
          <div className="space-y-6">
            {renderBlocks(blocks)}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'two-column' || layout === 'grid') {
    const cols = layout === 'two-column' ? 2 : (config?.columns || 2);
    return (
      <div className="flex flex-col h-full">
        {titleBlocks.length > 0 && <div className="mb-16">{renderBlocks(titleBlocks)}</div>}
        <div 
          className="flex-1 grid gap-16 overflow-hidden text-left" 
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => {
            const itemsPerCol = Math.ceil(otherBlocks.length / cols);
            const colBlocks = otherBlocks.slice(colIdx * itemsPerCol, (colIdx + 1) * itemsPerCol);
            return <div key={colIdx}>{renderBlocks(colBlocks)}</div>;
          })}
        </div>
      </div>
    );
  }
  return (<div className="flex flex-col h-full text-left">{titleBlocks.length > 0 && <div className="mb-14">{renderBlocks(titleBlocks)}</div>}<div className="flex-1">{renderBlocks(otherBlocks)}</div></div>);
};

export const PreviewPane: React.FC<PreviewPaneProps> = ({ parsedBlocks, previewRef, onUpdateSlideConfig }) => {
  const { pageSizes, selectedSizeIndex, documentMeta, showNotes, activeTheme } = useEditor();
  const selectedLayout = pageSizes[selectedSizeIndex];
  const slides = splitBlocksToSlides(parsedBlocks);

  return (
    <div className="w-1/2 flex flex-col bg-[#F5F5F4] dark:bg-[#0C0A09] transition-colors duration-500 border-l border-[#E7E5E4] dark:border-[#44403C]">
      <div className="bg-white dark:bg-[#1C1917] px-6 py-2.5 border-b border-[#E7E5E4] dark:border-[#44403C] flex justify-between items-center shrink-0">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Canvas Preview</span>
        <div className="flex items-center gap-2 text-[#EA580C] font-black text-[10px] uppercase tracking-tighter">
          <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span> {activeTheme.label}
        </div>
      </div>
      <div ref={previewRef} className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth bg-transparent">
        <div className="w-full max-w-[1600px] mx-auto space-y-12 pb-60">
          {slides.length > 0 ? slides.map((slide, index) => (
            <SlideCard 
              key={index} 
              slide={slide} 
              index={index} 
              layout={selectedLayout} 
              theme={activeTheme}
              globalBg={documentMeta.bg}
              onUpdateConfig={onUpdateSlideConfig} 
              showNotes={showNotes}
            />
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-300 dark:text-stone-700 mt-20 opacity-30"><Sparkles className="w-16 h-16 mb-6" /><p className="font-bold tracking-[0.5em] uppercase">Composition Canvas</p></div>
          )}
        </div>
      </div>
    </div>
  );
};