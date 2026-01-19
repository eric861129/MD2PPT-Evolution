import React, { useEffect, useRef } from 'react';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';
import { X } from 'lucide-react';
import { TextTweaker } from './TextTweaker';
import { ImageTweaker } from './ImageTweaker';
import { ChartTweaker } from './ChartTweaker';
import { BlockType } from '../../services/types';

export const TweakerOverlay: React.FC = () => {
  const { isVisible, position, blockType, sourceLine, closeTweaker, updatePosition } = useVisualTweaker();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = React.useState(position);

  // Update currentPos when position prop changes (initial open)
  useEffect(() => {
    setCurrentPos(position);
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (overlayRef.current) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - overlayRef.current.offsetLeft,
        y: e.clientY - overlayRef.current.offsetTop
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setCurrentPos({
          left: e.clientX - dragOffset.x,
          top: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Close on click outside (only if not dragging)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDragging) return;
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        closeTweaker();
      }
    };
    
    if (isVisible) {
      window.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible, isDragging, closeTweaker, updatePosition]);

  if (!isVisible) return null;

  const isTextType = blockType && [
    BlockType.HEADING_1, 
    BlockType.HEADING_2, 
    BlockType.HEADING_3, 
    BlockType.PARAGRAPH,
    BlockType.QUOTE_BLOCK,
    BlockType.CALLOUT_NOTE,
    BlockType.CALLOUT_TIP,
    BlockType.CALLOUT_WARNING
  ].includes(blockType);

  const isImageType = blockType === BlockType.IMAGE;
  const isChartType = blockType === BlockType.CHART;

  return (
    <div
      ref={overlayRef}
      className="fixed z-50 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xl rounded-lg p-4 w-72 animate-in fade-in zoom-in duration-200"
      style={{ top: currentPos.top, left: currentPos.left }}
    >
      <div 
        className="flex justify-between items-center mb-3 border-b border-stone-100 dark:border-stone-800 pb-2 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-stone-500 select-none">
          {blockType?.replace('_', ' ')} Tweaker
        </span>
        <button onClick={closeTweaker} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
          <X size={14} />
        </button>
      </div>
      
      <div className="text-sm text-stone-600 dark:text-stone-300">
        {isTextType ? <TextTweaker /> : 
         isImageType ? <ImageTweaker /> : 
         isChartType ? <ChartTweaker /> : (
          <>
            <p>Source Line: {sourceLine}</p>
            <p className="mt-2 text-xs opacity-60">Specific controls for {blockType} will appear here.</p>
          </>
        )}
      </div>
    </div>
  );
};
