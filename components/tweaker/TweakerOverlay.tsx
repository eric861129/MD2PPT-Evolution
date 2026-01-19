import React, { useEffect, useRef } from 'react';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';
import { X } from 'lucide-react';
import { TextTweaker } from './TextTweaker';
import { BlockType } from '../../services/types';

export const TweakerOverlay: React.FC = () => {
  const { isVisible, position, blockType, sourceLine, closeTweaker, updatePosition } = useVisualTweaker();
  const overlayRef = useRef<HTMLDivElement>(null);

  // ... (useEffect remains same)

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

  return (
    <div
      ref={overlayRef}
      className="fixed z-50 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xl rounded-lg p-4 w-72 animate-in fade-in zoom-in duration-200"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex justify-between items-center mb-3 border-b border-stone-100 dark:border-stone-800 pb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
          {blockType?.replace('_', ' ')} Tweaker
        </span>
        <button onClick={closeTweaker} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
          <X size={14} />
        </button>
      </div>
      
      <div className="text-sm text-stone-600 dark:text-stone-300">
        {isTextType ? <TextTweaker /> : (
          <>
            <p>Source Line: {sourceLine}</p>
            <p className="mt-2 text-xs opacity-60">Specific controls for {blockType} will appear here.</p>
          </>
        )}
      </div>
    </div>
  );
};
