/**
 * BookPublisher MD2Docx
 * Copyright (c) 2025 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { useMarkdownEditor } from '../hooks/useMarkdownEditor';
import { useDarkMode } from '../hooks/useDarkMode';
import { EditorProvider } from '../contexts/EditorContext';
import { VisualTweakerProvider } from '../contexts/VisualTweakerContext';

// Components
import { EditorHeader } from './editor/EditorHeader';
import { EditorPane } from './editor/EditorPane';
import { PreviewPane } from './editor/PreviewPane';
import { QuickActionSidebar, ActionType } from './editor/QuickActionSidebar';
import { EditorActionService } from '../services/editorActionService';
import { ACTION_TEMPLATES } from '../constants/templates';
import { fileToBase64 } from '../utils/imageUtils';
import { updateSlideYaml, replaceContentByLine, updateGlobalTheme } from '../services/markdownUpdater';
import { ThemePanel } from './editor/ThemePanel';
import { BrandSettingsModal } from './editor/BrandSettingsModal';
import { TweakerOverlay } from './tweaker/TweakerOverlay';
import { DesignPalette } from '../constants/palettes';
import Footer from './Footer';

const MarkdownEditor: React.FC = () => {
  const darkModeState = useDarkMode();
  const editorState = useMarkdownEditor();
  const [isThemePanelOpen, setIsThemePanelOpen] = React.useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = React.useState(false);
  
  const {
    content,
    setContent,
    parsedBlocks,
    wordCount,
    textareaRef,
    previewRef,
    handleScroll,
    brandConfig,
    updateBrandConfig,
    saveBrandConfigToFile,
    loadBrandConfigFromFile
  } = editorState;

  // Add the panel state to the context data so EditorHeader can use it
  const extendedEditorState = {
    ...editorState,
    isThemePanelOpen,
    toggleThemePanel: () => setIsThemePanelOpen(!isThemePanelOpen),
    isBrandModalOpen,
    openBrandModal: () => setIsBrandModalOpen(true),
    closeBrandModal: () => setIsBrandModalOpen(false)
  };

  const handleAction = (action: { type: ActionType }) => {
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
  };

  const handleEditorDrop = async (e: React.DragEvent) => {
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
  };

  const handleUpdateSlideConfig = (index: number, key: string, value: string) => {
    const newContent = updateSlideYaml(content, index, key, value);
    setContent(newContent);
  };

  const handleInsertColor = (hex: string) => {
    if (!textareaRef.current) return;
    const service = new EditorActionService(textareaRef.current);
    service.insertText(hex, setContent);
  };

  const handleApplyPalette = (palette: DesignPalette) => {
    const newContent = updateGlobalTheme(content, palette.id);
    setContent(newContent);
  };

  // ... (inside the component)
  const handleTweakerUpdate = (line: number, newContent: string) => {
    const updated = replaceContentByLine(content, line, newContent);
    setContent(updated);
  };

  const handleGetLineContent = (line: number) => {
    const lines = content.split(/\r?\n/);
    return lines[line] || "";
  };

  return (
    <EditorProvider editorState={extendedEditorState as any} darkModeState={darkModeState}>
      <VisualTweakerProvider 
        onUpdateContent={handleTweakerUpdate}
        onGetLineContent={handleGetLineContent}
      >
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors relative font-sans">
          <EditorHeader />

          <main className="flex flex-1 overflow-hidden relative">
            <QuickActionSidebar onAction={handleAction} />
            <TweakerOverlay />
            
            {isThemePanelOpen && (
              <ThemePanel 
                onClose={() => setIsThemePanelOpen(false)} 
                onInsertColor={handleInsertColor}
                onApplyPalette={handleApplyPalette}
              />
            )}

            <BrandSettingsModal 
              isOpen={isBrandModalOpen}
              onClose={() => setIsBrandModalOpen(false)}
              config={brandConfig}
              onUpdate={updateBrandConfig}
              onExport={saveBrandConfigToFile}
              onImport={loadBrandConfigFromFile}
            />
            
            <div className="flex flex-1 overflow-hidden">
              <div 
                  className="w-1/2 flex flex-col"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleEditorDrop}
              >
                  <EditorPane 
                    content={content}
                    setContent={setContent}
                    wordCount={wordCount}
                    textareaRef={textareaRef}
                    onScroll={handleScroll}
                  />
              </div>

              <PreviewPane 
                parsedBlocks={parsedBlocks}
                previewRef={previewRef}
                onUpdateSlideConfig={handleUpdateSlideConfig}
                />
            </div>
          </main>
          
          <Footer />
        </div>
      </VisualTweakerProvider>
    </EditorProvider>
  );
};

export default MarkdownEditor;