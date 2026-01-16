/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import { saveAs } from 'file-saver';
import { SLIDE_LAYOUTS } from '../constants/meta';
import { useEditorState } from './useEditorState';
import { useWordCount } from './useWordCount';
import { useSyncScroll } from './useSyncScroll';
import { usePptExport } from './usePptExport';

export const useMarkdownEditor = () => {
  // 1. Core State (Content, Parsing, Language)
  const { 
    content, 
    setContent, 
    parsedBlocks, 
    documentMeta, 
    showNotes,
    toggleNotes,
    activeTheme,
    setActiveThemeId,
    updateCustomTheme,
    language, 
    toggleLanguage, 
    resetToDefault, 
    t 
  } = useEditorState();

  // 2. Auxiliary Logic
  const { wordCount } = useWordCount(content);
  
  // 3. UI State
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  
  // 4. Refs & Scrolling
  const { textareaRef, previewRef, handleScroll } = useSyncScroll();

  // 5. Export Logic (PPTX)
  const { 
    exportToPpt,
    isExporting, 
    error: exportError 
  } = usePptExport();

  // Actions
  const handleDownload = () => {
    const layout = SLIDE_LAYOUTS[selectedSizeIndex];
    exportToPpt(parsedBlocks, {
      layoutName: layout.name,
      title: documentMeta.title,
      author: documentMeta.author,
      bg: documentMeta.bg
    });
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, "presentation.md");
  };

  return {
    // State
    content,
    setContent,
    parsedBlocks,
    documentMeta,
    showNotes,
    toggleNotes,
    activeTheme,
    setActiveThemeId,
    updateCustomTheme,
    isGenerating: isExporting,
    
    // UI Config
    selectedSizeIndex,
    setSelectedSizeIndex,
    pageSizes: SLIDE_LAYOUTS, // Expose as 'pageSizes' to keep EditorHeader compatible for now
    
    // Metrics
    wordCount,
    language,
    
    // Refs
    textareaRef,
    previewRef,
    
    // Actions
    handleScroll,
    handleDownload,
    handleExportMarkdown,
    resetToDefault,
    toggleLanguage,
    
    // Helpers
    t
  };
};