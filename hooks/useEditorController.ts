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
import { updateSlideYaml, replaceContentByLine, updateGlobalTheme } from '../services/markdownUpdater';
import { ActionType } from '../components/editor/QuickActionSidebar';
import { DesignPalette } from '../constants/palettes';

/**
 * Controller hook for MarkdownEditor.
 * Separates complex logic and event handlers from the UI view.
 */
export const useEditorController = () => {
  const darkModeState = useDarkMode();
  const editorState = useMarkdownEditor();
  
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const { content, setContent, textareaRef } = editorState;

  const handleAction = useCallback((action: { type: ActionType }) => {
    if (!textareaRef.current) return;
    
    const service = new EditorActionService(textareaRef.current);
    
    switch (action.type) {
        // Structure & Layouts
        case 'INSERT_SLIDE':
            service.insertText(ACTION_TEMPLATES.INSERT_SLIDE, setContent);
            break;
        case 'LAYOUT_GRID':
            service.insertText(ACTION_TEMPLATES.LAYOUT_GRID, setContent);
            break;
        case 'LAYOUT_TWO_COLUMN':
            service.insertText(ACTION_TEMPLATES.LAYOUT_TWO_COLUMN, setContent);
            break;
        case 'LAYOUT_CENTER':
            service.insertText(ACTION_TEMPLATES.LAYOUT_CENTER, setContent);
            break;
        case 'LAYOUT_QUOTE':
            service.insertText(ACTION_TEMPLATES.LAYOUT_QUOTE, setContent);
            break;
        case 'LAYOUT_ALERT':
            service.insertText(ACTION_TEMPLATES.LAYOUT_ALERT, setContent);
            break;
            
        // Components
        case 'INSERT_TABLE':
            service.insertText(ACTION_TEMPLATES.INSERT_TABLE, setContent);
            break;
        case 'INSERT_CHAT':
            service.insertText(ACTION_TEMPLATES.INSERT_CHAT, setContent);
            break;
        case 'INSERT_CHART_BAR':
            service.insertText(ACTION_TEMPLATES.INSERT_CHART_BAR, setContent);
            break;
        case 'INSERT_CHART_LINE':
            service.insertText(ACTION_TEMPLATES.INSERT_CHART_LINE, setContent);
            break;
        case 'INSERT_CHART_PIE':
            service.insertText(ACTION_TEMPLATES.INSERT_CHART_PIE, setContent);
            break;
        case 'INSERT_CHART_AREA':
            service.insertText(ACTION_TEMPLATES.INSERT_CHART_AREA, setContent);
            break;
        case 'INSERT_IMAGE':
            service.insertText(ACTION_TEMPLATES.INSERT_IMAGE, setContent);
            break;
        case 'INSERT_NOTE':
            service.insertText(ACTION_TEMPLATES.INSERT_NOTE, setContent);
            break;
            
        // Formatting
        case 'FORMAT_BOLD':
            service.wrapText('**', '**', setContent);
            break;
        case 'FORMAT_ITALIC':
            service.wrapText('*', '*', setContent);
            break;
        case 'FORMAT_CODE':
            service.wrapText('`', '`', setContent);
            break;
            
        default:
            console.warn(`Unknown action: ${action.type}`);
    }
  }, [textareaRef, setContent]);

  const handleEditorDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/') && textareaRef.current) {
        try {
          const base64 = await fileToBase64(file);
          const service = new EditorActionService(textareaRef.current);
          const altText = file.name.split('.')[0];
          const fullText = `![${altText}](${base64})`;
          service.insertText(fullText, setContent);
        } catch (err) {
          console.error("Failed to process dropped image", err);
        }
      }
    }
  }, [textareaRef, setContent]);

  const handleUpdateSlideConfig = useCallback((index: number, key: string, value: string) => {
    const newContent = updateSlideYaml(content, index, key, value);
    setContent(newContent);
  }, [content, setContent]);

  const handleInsertColor = useCallback((hex: string) => {
    if (!textareaRef.current) return;
    const service = new EditorActionService(textareaRef.current);
    service.insertText(hex, setContent);
  }, [textareaRef, setContent]);

  const handleApplyPalette = useCallback((palette: DesignPalette) => {
    const newContent = updateGlobalTheme(content, palette.id);
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
      handleTweakerUpdate,
      handleGetLineContent
    }
  };
};
