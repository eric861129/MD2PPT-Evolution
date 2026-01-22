/**
 * BookPublisher MD2Docx
 * Copyright (c) 2025 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';

import { useEditorController } from '../hooks/useEditorController';

import { EditorProvider } from '../contexts/EditorContext';

import { VisualTweakerProvider } from '../contexts/VisualTweakerContext';



// Components

import { EditorHeader } from './editor/EditorHeader';

import { EditorPane } from './editor/EditorPane';

import { PreviewPane } from './editor/PreviewPane';

import { QuickActionSidebar } from './editor/QuickActionSidebar';

import { ThemePanel } from './editor/ThemePanel';

import { BrandSettingsModal } from './editor/BrandSettingsModal';

import { AiPromptModal } from './editor/AiPromptModal';

import { TweakerOverlay } from './tweaker/TweakerOverlay';

import Footer from './Footer';



const MarkdownEditor: React.FC = () => {

  const {

    editorState,

    darkModeState,

    uiState,

    handlers

  } = useEditorController();

  

  const {

    content,

    setContent,

    parsedBlocks,

    wordCount,

    textareaRef,

    previewRef,

    brandConfig,

    updateBrandConfig,

    saveBrandConfigToFile,

    loadBrandConfigFromFile

  } = editorState;



  const {

    isThemePanelOpen,

    setIsThemePanelOpen,

    isBrandModalOpen,

    setIsBrandModalOpen,

    isAiModalOpen,

    setIsAiModalOpen

  } = uiState;



  const {

    handleAction,

    handleEditorDrop,

        handleUpdateSlideConfig,

        handleInsertColor,

        handleApplyPalette,

        handleReorderSlides,

        handleTweakerUpdate,

        handleGetLineContent

      } = handlers;

    



  // Add the panel state to the context data so EditorHeader can use it

  const extendedEditorState = {

    ...editorState,

    isThemePanelOpen,

    toggleThemePanel: () => setIsThemePanelOpen(!isThemePanelOpen),

    isBrandModalOpen,

    openBrandModal: () => setIsBrandModalOpen(true),

    closeBrandModal: () => setIsBrandModalOpen(false),

    isAiModalOpen,

    openAiModal: () => setIsAiModalOpen(true),

    closeAiModal: () => setIsAiModalOpen(false)

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



            <AiPromptModal 

              isOpen={isAiModalOpen}

              onClose={() => setIsAiModalOpen(false)}

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

                    onScroll={editorState.handleScroll}

                  />

              </div>



                            <PreviewPane 



                              parsedBlocks={parsedBlocks}



                              previewRef={previewRef}



                              onUpdateSlideConfig={handleUpdateSlideConfig}



                              onReorderSlides={handleReorderSlides}



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
