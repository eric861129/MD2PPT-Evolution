/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Sparkles, StickyNote } from 'lucide-react';
import { ParsedBlock, PptTheme } from '../../services/types';
import { splitBlocksToSlides, SlideData } from '../../services/parser/slides';
import { transformToSOM, SlideObject } from '../../services/parser/som';
import { useEditor } from '../../contexts/EditorContext';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';
import { fileToBase64 } from '../../utils/imageUtils';
import { SlideRenderer } from '../common/SlideRenderer';

interface PreviewPaneProps {
  parsedBlocks: ParsedBlock[];
  previewRef: React.RefObject<HTMLDivElement>;
  onUpdateSlideConfig?: (index: number, key: string, value: string) => void;
}

const DESIGN_WIDTH = 1200;

const SlideCard: React.FC<{ 
  slide: SlideObject; 
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

  const designHeight = DESIGN_WIDTH * (layout.height / layout.width);
  const transitionType = slide.config?.transition || 'none';
  const note = slide.notes;

  return (
    <div 
      className="flex flex-col gap-4"
      data-source-line={slide.sourceLine}
      data-block-type="BACKGROUND"
    >
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
        <SlideRenderer 
          slide={slide} 
          theme={theme} 
          globalBg={globalBg}
          width={DESIGN_WIDTH}
          height={designHeight}
          scale={scale}
        />
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

export const PreviewPane: React.FC<PreviewPaneProps> = ({ parsedBlocks, previewRef, onUpdateSlideConfig }) => {
  const { pageSizes, selectedSizeIndex, documentMeta, showNotes, activeTheme } = useEditor();
  const { openTweaker } = useVisualTweaker();
  
  const selectedLayout = pageSizes[selectedSizeIndex];
  const slides = transformToSOM(parsedBlocks);

  const handlePreviewClick = (e: React.MouseEvent) => {
    let target = e.target as HTMLElement;
    let depth = 0;
    const maxDepth = 5;

    while (target && target !== e.currentTarget && depth < maxDepth) {
      if (target.hasAttribute('data-source-line')) {
        const sourceLine = parseInt(target.getAttribute('data-source-line') || '0', 10);
        const blockType = target.getAttribute('data-block-type');
        
        if (sourceLine > 0 && blockType) {
          e.stopPropagation();
          openTweaker(target, blockType as any, sourceLine);
          return;
        }
      }
      target = target.parentElement as HTMLElement;
      depth++;
    }
  };

  return (
    <div className="w-1/2 flex flex-col bg-[#F5F5F4] dark:bg-[#0C0A09] transition-colors duration-500 border-l border-[#E7E5E4] dark:border-[#44403C]">
      <div className="bg-white dark:bg-[#1C1917] px-6 py-2.5 border-b border-[#E7E5E4] dark:border-[#44403C] flex justify-between items-center shrink-0">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Canvas Preview</span>
        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter" style={{ color: `#${activeTheme.colors.primary}` }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: `#${activeTheme.colors.primary}` }}></span> {activeTheme.label}
        </div>
      </div>
      <div 
        ref={previewRef} 
        onClick={handlePreviewClick}
        className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth bg-transparent"
      >
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
