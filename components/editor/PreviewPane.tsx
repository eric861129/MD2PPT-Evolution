/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Sparkles, StickyNote } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { ParsedBlock, PptTheme } from '../../services/types';
import { transformToSOM, SlideObject } from '../../services/parser/som';
import { useEditor } from '../../contexts/EditorContext';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';
import { fileToBase64 } from '../../utils/imageUtils';
import { SlideRenderer } from '../common/SlideRenderer';
import { DragHandle } from './DragHandle';
import { getContrastColor } from '../../utils/styleParser';

interface PreviewPaneProps {
  parsedBlocks: ParsedBlock[];
  previewRef: React.RefObject<HTMLDivElement>;
  onUpdateSlideConfig?: (index: number, key: string, value: string) => void;
  onReorderSlides?: (fromIndex: number, toIndex: number) => void;
}

const DESIGN_WIDTH = 1200;

const SortableSlideCard: React.FC<{
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
  const [isDropTarget, setIsDropTarget] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `slide-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  useLayoutEffect(() => {
    const updateScale = () => { 
      if (containerRef.current) {
        const newScale = containerRef.current.offsetWidth / DESIGN_WIDTH;
        // Round to 4 decimal places to prevent sub-pixel blurring
        setScale(Math.round(newScale * 10000) / 10000); 
      }
    };
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    updateScale();
    return () => resizeObserver.disconnect();
  }, []);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);
    
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

  // Calculate contrast color for the handle
  const effectiveBg = slide.config?.background || theme.colors.background;
  const contrastColor = getContrastColor(effectiveBg.startsWith('#') ? effectiveBg : `#${theme.colors.background}`);

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-4 relative group ${isDragging ? 'pointer-events-none' : ''}`}
      data-source-line={slide.sourceLine}
      data-block-type="BACKGROUND"
    >
      <div 
        ref={containerRef}
        onDragOver={(e) => { e.preventDefault(); setIsDropTarget(true); }}
        onDragLeave={() => setIsDropTarget(false)}
        onDrop={handleDrop}
        data-slide-capture
        className={`w-full shadow-[0_30px_60px_rgba(0,0,0,0.12)] relative overflow-hidden bg-[#E7E5E4] dark:bg-[#44403C] rounded-lg transition-all duration-500 ${
          transitionType === 'fade' ? 'animate-in fade-in' :
          transitionType === 'slide' ? 'animate-in slide-in-from-right' :
          transitionType === 'zoom' ? 'animate-in zoom-in' : ''
        } ${isDropTarget ? 'ring-4 ring-[var(--product-primary)] scale-[1.01]' : ''}`} 
        style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
      >
        {/* Floating Controls Inside Slide */}
        <div className="absolute top-4 left-4 z-40 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div 
            style={{ backgroundColor: contrastColor === '#FFFFFF' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)', color: contrastColor }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border border-white/10 shadow-sm backdrop-blur-sm"
          >
            {index + 1}
          </div>
          <DragHandle id={`slide-${index}`} contrastColor={contrastColor} className="backdrop-blur-sm" />
        </div>

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
        <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-[var(--brand-primary)] p-6 rounded-r-xl shadow-sm animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 mb-2 text-[var(--brand-primary)] font-black text-[10px] uppercase tracking-wider">
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

export const PreviewPane: React.FC<PreviewPaneProps> = ({ parsedBlocks, previewRef, onUpdateSlideConfig, onReorderSlides }) => {
  const { pageSizes, selectedSizeIndex, documentMeta, showNotes, activeTheme } = useEditor();
  const { openTweaker } = useVisualTweaker();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const selectedLayout = pageSizes[selectedSizeIndex];
  const slides = transformToSOM(parsedBlocks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = parseInt((active.id as string).split('-')[1], 10);
      const newIndex = parseInt((over.id as string).split('-')[1], 10);
      
      if (onReorderSlides) {
        onReorderSlides(oldIndex, newIndex);
      }
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    let target = e.target as HTMLElement;
    let depth = 0;
    const maxDepth = 5;

    while (target && target !== e.currentTarget && depth < maxDepth) {
      if (target.hasAttribute('data-source-line')) {
        const sourceLine = parseInt(target.getAttribute('data-source-line') || '0', 10);
        const blockType = target.getAttribute('data-block-type');
        const start = target.getAttribute('data-start-index');
        const end = target.getAttribute('data-end-index');
        
        if (sourceLine > 0 && blockType) {
          e.stopPropagation();
          const range = (start && end) ? { start: parseInt(start, 10), end: parseInt(end, 10) } : undefined;
          openTweaker(target, blockType as any, sourceLine, range);
          return;
        }
      }
      target = target.parentElement as HTMLElement;
      depth++;
    }
  };

  const activeSlideIndex = activeId ? parseInt(activeId.split('-')[1], 10) : -1;
  const activeSlide = activeSlideIndex >= 0 ? slides[activeSlideIndex] : null;

  return (
    <div className="w-[55%] flex flex-col bg-[#F5F5F4] dark:bg-[#0C0A09] transition-colors duration-500 border-l border-[#E7E5E4] dark:border-[#44403C]">
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
          {slides.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveId(null)}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={slides.map((_, i) => `slide-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                {slides.map((slide, index) => (
                  <SortableSlideCard 
                    key={index} 
                    slide={slide} 
                    index={index} 
                    layout={selectedLayout} 
                    theme={activeTheme}
                    globalBg={documentMeta.bg}
                    onUpdateConfig={onUpdateSlideConfig} 
                    showNotes={showNotes}
                  />
                ))}
              </SortableContext>

              <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: {
                    active: {
                      opacity: '0.5',
                    },
                  },
                }),
              }}>
                {activeSlide ? (
                  <div className="w-[300px] opacity-90 shadow-2xl rounded-xl overflow-hidden border-2 border-[var(--product-primary)] ring-4 ring-[var(--product-primary)]/20 rotate-3 transition-transform duration-200 cursor-grabbing">
                    {/* Explicitly height-constrained container to clip transform whitespace */}
                    <div 
                      className="pointer-events-none overflow-hidden" 
                      style={{ 
                        width: '300px',
                        height: `${300 * (selectedLayout.height / selectedLayout.width)}px`,
                        position: 'relative'
                      }}
                    >
                      <SlideRenderer 
                        slide={activeSlide} 
                        theme={activeTheme} 
                        globalBg={documentMeta.bg}
                        width={DESIGN_WIDTH}
                        height={DESIGN_WIDTH * (selectedLayout.height / selectedLayout.width)}
                        scale={300 / DESIGN_WIDTH} 
                      />
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-300 dark:text-stone-700 mt-20 opacity-30"><Sparkles className="w-16 h-16 mb-6" /><p className="font-bold tracking-[0.5em] uppercase">Composition Canvas</p></div>
          )}
        </div>
      </div>
    </div>
  );
};