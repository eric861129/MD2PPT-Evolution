import React, { useEffect, useRef } from 'react';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';
import { X } from 'lucide-react';

export const TweakerOverlay: React.FC = () => {
  const { isVisible, position, blockType, sourceLine, closeTweaker, updatePosition } = useVisualTweaker();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        // Also check if we clicked on the selected element itself (to prevent immediate close/reopen flicker)
        // But for now, simple outside click is fine. 
        // Ideally we should check if the click target is NOT the selected element.
        // But the open logic is usually on the element click.
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
  }, [isVisible, closeTweaker, updatePosition]);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed z-50 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 shadow-xl rounded-lg p-4 w-64 animate-in fade-in zoom-in duration-200"
      style={{ top: position.top, left: position.left }}
    >
      <div className="flex justify-between items-center mb-3 border-b border-stone-100 dark:border-stone-800 pb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
          {blockType} Tweaker
        </span>
        <button onClick={closeTweaker} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
          <X size={14} />
        </button>
      </div>
      
      <div className="text-sm text-stone-600 dark:text-stone-300">
        <p>Source Line: {sourceLine}</p>
        <p className="mt-2 text-xs opacity-60">Specific controls for {blockType} will appear here.</p>
      </div>
    </div>
  );
};
