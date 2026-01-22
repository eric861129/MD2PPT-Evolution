/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { useState, useRef, useCallback } from 'react';
import { useMarkdownEditor } from './useMarkdownEditor';
import { useDarkMode } from './useDarkMode';
import { EditorActionService } from '../services/editorActionService';
import { ACTION_TEMPLATES } from '../constants/templates';
import { fileToBase64 } from '../utils/imageUtils';
import { updateSlideYaml, replaceContentByLine, updateGlobalTheme, reorderSlides } from '../services/markdownUpdater';
...
  const handleApplyPalette = useCallback((palette: DesignPalette) => {
    const newContent = updateGlobalTheme(content, palette.id);
    setContent(newContent);
  }, [content, setContent]);

  const handleReorderSlides = useCallback((fromIndex: number, toIndex: number) => {
    const newContent = reorderSlides(content, fromIndex, toIndex);
    setContent(newContent);
  }, [content, setContent]);

  const handleTweakerUpdate = useCallback((line: number, newContent: string) => {
    const updated = replaceContentByLine(content, line, newContent);
    setContent(updated);
  }, [content, setContent]);

  const handleGetLineContent = useCallback((line: number) => {
    const lines = content.split(/\r?\n/);
    
    const targetLine = lines[line]?.trim() || "";

    // Block Detection: ::: (Charts, etc.)
    if (targetLine.startsWith(':::') && targetLine !== ':::') {
      let endIndex = line + 1;
      while (endIndex < lines.length) {
        if (lines[endIndex].trim() === ':::') {
          return lines.slice(line, endIndex + 1).join('\n');
        }
        endIndex++;
      }
    }

    // Block Detection: --- (YAML)
    if (targetLine === '---') {
      let endIndex = line + 1;
      while (endIndex < lines.length) {
        if (lines[endIndex].trim() === '---') {
          return lines.slice(line, endIndex + 1).join('\n');
        }
        endIndex++;
      }
    }

    return lines[line] || "";
  }, [content]);

  return {
    editorState,
    darkModeState,
    uiState: {
      isThemePanelOpen,
      setIsThemePanelOpen,
      isBrandModalOpen,
      setIsBrandModalOpen,
      isAiModalOpen,
      setIsAiModalOpen
    },
    handlers: {
      handleAction,
      handleEditorDrop,
      handleUpdateSlideConfig,
      handleInsertColor,
      handleApplyPalette,
      handleReorderSlides,
      handleTweakerUpdate,
      handleGetLineContent
    }
  };
};
