/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useCallback } from 'react';
import { useMarkdownEditor } from '../../hooks/useMarkdownEditor';
import { useDarkMode } from '../../hooks/useDarkMode';
import { EditorProvider } from '../../contexts/EditorContext';
import { PresenterConsole } from './PresenterConsole';
import { transformToSOM } from '../../services/parser/som';
import { reorderSlides } from '../../services/markdownUpdater';

export const PresenterPage: React.FC = () => {
  const editorState = useMarkdownEditor();
  const darkModeState = useDarkMode();
  
  const { content, setContent, parsedBlocks } = editorState;

  // Prepare slides from parsed blocks
  const slides = transformToSOM(parsedBlocks);

  const handleReorder = useCallback((from: number, to: number) => {
    const newContent = reorderSlides(content, from, to);
    setContent(newContent);
  }, [content, setContent]);

  return (
    <EditorProvider editorState={editorState} darkModeState={darkModeState}>
      <PresenterConsole 
        slides={slides} 
        currentIndex={0} 
        theme={editorState.activeTheme}
        onReorderSlides={handleReorder}
      />
    </EditorProvider>
  );
};
