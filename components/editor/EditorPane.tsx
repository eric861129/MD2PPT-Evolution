/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useRef, useEffect } from 'react';
import { UI_THEME } from '../../constants/theme';
import { SlashMenu } from './SlashMenu';
import { useSlashCommand } from '../../hooks/useSlashCommand';
import { ColorHighlighter } from './ColorHighlighter';

interface EditorPaneProps {
  content: string;
  setContent: (content: string) => void;
  wordCount: number;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onScroll: () => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  content,
  setContent,
  wordCount,
  textareaRef,
  onScroll
}) => {
  const {
    isOpen,
    position,
    selectedIndex,
    filteredCommands,
    handleKeyDown: handleSlashKeyDown,
    handleInputChange,
    selectCommand,
    closeMenu
  } = useSlashCommand(textareaRef, setContent);

  const [scrollTop, setScrollTop] = useState(0);

  const handleScrollSync = (e: React.UIEvent<HTMLTextAreaElement>) => {
    onScroll();
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Handle Slash Command keys first
    handleSlashKeyDown(e);
    if (e.defaultPrevented) return;

    // 2. Handle existing Tab logic
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newContent = content.substring(0, start) + "  " + content.substring(end);
      setContent(newContent);
      setTimeout(() => { target.selectionStart = target.selectionEnd = start + 2; }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const selectionStart = e.target.selectionStart;
    setContent(newValue);
    handleInputChange(newValue, selectionStart);
  };

  return (
    <div className="flex-1 w-full flex flex-col border-r border-[#E7E5E4] dark:border-[#44403C] bg-[var(--bg-base)] transition-colors duration-500 relative">
      <div className="bg-white dark:bg-[#292524] px-6 py-2.5 border-b border-[#E7E5E4] dark:border-[#44403C] flex justify-between items-center z-20 relative">
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Editor</span>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{wordCount} Words</span>
      </div>
      
      <div className="flex-1 relative w-full h-full overflow-hidden">
        {/* Color Overlay Layer */}
        {textareaRef.current && (
           <ColorHighlighter content={content} textareaRef={textareaRef} scrollTop={scrollTop} />
        )}

        <textarea
          ref={textareaRef}
          onScroll={handleScrollSync}
          className="absolute inset-0 w-full h-full p-12 pl-16 resize-none focus:outline-none text-lg leading-relaxed text-stone-800 dark:text-stone-200 bg-transparent selection:bg-[var(--product-glow)] z-10"
          style={{ fontFamily: UI_THEME.FONTS.PREVIEW }}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="在此輸入您的 Markdown..."
        />
      </div>

      <SlashMenu 
        isOpen={isOpen}
        onSelect={selectCommand}
        onClose={closeMenu}
        position={position}
        commands={filteredCommands}
        selectedIndex={selectedIndex}
      />
    </div>
  );
};
