import React, { useState, useEffect } from 'react';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';
import { updateElementAttribute } from '../../services/markdownUpdater';
import { ChevronUp, ChevronDown, Type } from 'lucide-react';

export const TextTweaker: React.FC = () => {
  const { sourceLine, getLineContent, updateContent } = useVisualTweaker();
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState<number | ''>('');

  // Sync with source content when opened
  useEffect(() => {
    if (sourceLine !== null) {
      const rawContent = getLineContent(sourceLine);
      setText(rawContent);

      // Extract existing size from {size=N}
      const sizeMatch = rawContent.match(/\{size=(\d+)\}/);
      if (sizeMatch) {
        setFontSize(parseInt(sizeMatch[1], 10));
      } else {
        setFontSize('');
      }
    }
  }, [sourceLine, getLineContent]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    updateContent(newValue); // Real-time sync
  };

  const updateFontSize = (newSize: number | '') => {
    setFontSize(newSize);
    
    if (sourceLine === null) return;

    // Get fresh content directly from source to avoid stale state issues
    const currentRaw = getLineContent(sourceLine);
    let updatedLine = '';
    
    if (newSize === '') {
      // Remove any existing size tags
      updatedLine = currentRaw.replace(/\s*\{size=\d+\}\s*$/, '').trimEnd();
    } else {
      updatedLine = updateElementAttribute(currentRaw, 'size', newSize);
    }
    
    setText(updatedLine);
    updateContent(updatedLine); 
  };

  const adjustSize = (delta: number) => {
    const current = typeof fontSize === 'number' ? fontSize : 24; // Default baseline
    updateFontSize(Math.max(8, current + delta));
  };

  return (
    <div className="space-y-4">
      {/* 1. Content Edit */}
      <div className="space-y-2">
        <label 
          htmlFor="text-tweaker-input"
          className="text-[10px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Type size={12} className="text-orange-500" /> Content Edit
        </label>
        <textarea
          id="text-tweaker-input"
          value={text}
          onChange={handleTextChange}
          className="w-full h-32 p-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none font-sans"
          placeholder="Enter text..."
        />
      </div>

      {/* 2. Font Size Control */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
          Font Size (pt)
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              value={fontSize}
              onChange={(e) => updateFontSize(e.target.value ? parseInt(e.target.value, 10) : '')}
              className="w-full pl-3 pr-8 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:ring-2 focus:ring-orange-500 outline-none font-mono"
              placeholder="Auto"
            />
            <div className="absolute right-1 top-1 bottom-1 flex flex-col gap-0.5">
              <button 
                onClick={() => adjustSize(2)}
                className="flex-1 px-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-500 transition-colors"
              >
                <ChevronUp size={12} />
              </button>
              <button 
                onClick={() => adjustSize(-2)}
                className="flex-1 px-1.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded text-stone-500 transition-colors"
              >
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
          <button 
            onClick={() => updateFontSize('')}
            className="px-3 py-2 text-[10px] font-bold bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-md hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors uppercase"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
