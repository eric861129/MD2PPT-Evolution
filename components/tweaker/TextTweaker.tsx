import React, { useState, useEffect } from 'react';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';

export const TextTweaker: React.FC = () => {
  const { selectedElement, updateContent } = useVisualTweaker();
  const [text, setText] = useState('');

  // Sync with element content when opened
  useEffect(() => {
    if (selectedElement) {
      setText(selectedElement.innerText || '');
    }
  }, [selectedElement]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    updateContent(newValue); // Real-time sync
  };

  return (
    <div className="space-y-3">
      <label 
        htmlFor="text-tweaker-input"
        className="text-[10px] font-bold text-stone-400 uppercase tracking-wider"
      >
        Content Edit
      </label>
      <textarea
        id="text-tweaker-input"
        value={text}
        onChange={handleChange}
        className="w-full h-32 p-3 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none font-sans"
        placeholder="Enter text..."
      />
    </div>
  );
};
