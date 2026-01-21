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
import { useBrandSettings } from './useBrandSettings';
import { ImageExportService } from '../services/imageExportService';

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
    resetCustomTheme,
    brandConfig,
    updateBrandConfig,
    saveBrandConfigToFile,
    loadBrandConfigFromFile,
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

  const [isExportingImages, setIsExportingImages] = useState(false);

  // Actions
  const handleDownload = () => {
    const layout = SLIDE_LAYOUTS[selectedSizeIndex];
    exportToPpt(parsedBlocks, {
      layoutName: layout.name,
      title: documentMeta.title,
      author: documentMeta.author,
      bg: documentMeta.bg,
      theme: activeTheme,
      brandConfig
    });
  };

  const handleExportImages = async () => {
    if (!previewRef.current) return;
    
    setIsExportingImages(true);
    try {
      // Find all slide elements with the capture attribute
      const slideElements = Array.from(
        previewRef.current.querySelectorAll('[data-slide-capture]')
      ) as HTMLElement[];

      if (slideElements.length === 0) {
        alert("No slides found to export.");
        return;
      }

      await ImageExportService.exportSlidesToZip(slideElements, {
        fileName: documentMeta.title ? `${documentMeta.title}_Images` : 'Presentation_Images'
      });
    } catch (err) {
      console.error("Failed to export images:", err);
      alert("Failed to export images. Please check the console for details.");
    } finally {
      setIsExportingImages(false);
    }
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
    resetCustomTheme,
    brandConfig,
    updateBrandConfig,
    saveBrandConfigToFile,
    loadBrandConfigFromFile,
    isGenerating: isExporting || isExportingImages,
    isExportingImages,
    
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
    handleExportImages,
    handleExportMarkdown,
    resetToDefault,
    toggleLanguage,
    
    // Helpers
    t
  };
};