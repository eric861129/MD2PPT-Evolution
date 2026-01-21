/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { useMarkdownEditor } from '../../hooks/useMarkdownEditor';
import { useDarkMode } from '../../hooks/useDarkMode';
import { EditorProvider } from '../../contexts/EditorContext';
import { PresenterConsole } from './PresenterConsole';
import { splitBlocksToSlides } from '../../services/parser/slides';

export const PresenterPage: React.FC = () => {
  const editorState = useMarkdownEditor();
  const darkModeState = useDarkMode();
  
  // Prepare slides from parsed blocks
  const slides = splitBlocksToSlides(editorState.parsedBlocks);

  return (
    <EditorProvider editorState={editorState} darkModeState={darkModeState}>
      <PresenterConsole slides={slides} currentIndex={0} />
    </EditorProvider>
  );
};
