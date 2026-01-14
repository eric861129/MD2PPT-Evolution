/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { Sparkles } from 'lucide-react';
import { ParsedBlock, BlockType } from '../../services/types';
import { PreviewBlock, RenderRichText } from './PreviewRenderers';
import { UI_THEME } from '../../constants/theme';
import { splitBlocksToSlides } from '../../services/parser/slides';
import { useEditor } from '../../contexts/EditorContext';

interface PreviewPaneProps {
  parsedBlocks: ParsedBlock[];
  previewRef: React.RefObject<HTMLDivElement>;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  parsedBlocks,
  previewRef
}) => {
  const { pageSizes, selectedSizeIndex } = useEditor();
  const selectedLayout = pageSizes[selectedSizeIndex];
  const slides = splitBlocksToSlides(parsedBlocks);

  const renderSlideContent = (slideBlocks: ParsedBlock[]) => {
    const elements: JSX.Element[] = [];
    let i = 0;
    while (i < slideBlocks.length) {
      const block = slideBlocks[i];
      if (block.type === BlockType.BULLET_LIST) {
        const listItems: ParsedBlock[] = [];
        while (i < slideBlocks.length && slideBlocks[i].type === BlockType.BULLET_LIST) {
          listItems.push(slideBlocks[i]);
          i++;
        }
        elements.push(
          <ul key={`bullet-list-${i}`} className="ml-8 mb-8">
            {listItems.map((item, idx) => (
              <li key={idx} className="relative mb-2 pl-4 leading-[1.8] list-none before:content-[''] before:absolute before:left-0 before:top-[0.7em] before:w-2 before:h-2 before:bg-slate-400 dark:before:bg-slate-600 before:rounded-full">
                 <RenderRichText text={item.content} />
              </li>
            ))}
          </ul>
        );
      } else if (block.type === BlockType.NUMBERED_LIST) {
        const listItems: ParsedBlock[] = [];
        while (i < slideBlocks.length && slideBlocks[i].type === BlockType.NUMBERED_LIST) {
          listItems.push(slideBlocks[i]);
          i++;
        }
        elements.push(
          <ol key={`numbered-list-${i}`} className="ml-8 mb-8 list-decimal">
            {listItems.map((item, idx) => (
              <li key={idx} className="mb-2 pl-2 leading-[1.8] text-slate-800 dark:text-slate-200">
                 <RenderRichText text={item.content} />
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(<PreviewBlock key={i} block={block} />);
        i++;
      }
    }
    return elements;
  };

  return (
    <div className="w-1/2 flex flex-col bg-slate-100/50 dark:bg-slate-900/50 transition-colors">
      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-2 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        Slide Deck Preview (WYSIWYG)
      </div>
      <div 
        ref={previewRef}
        className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth bg-slate-200 dark:bg-slate-950"
      >
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          {slides.length > 0 && slides.some(s => s.blocks.length > 0) ? (
            slides.map((slide, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-slate-900 shadow-2xl p-12 lg:p-16 text-slate-900 dark:text-slate-100 rounded-sm border border-slate-200 dark:border-slate-800 transition-colors relative overflow-hidden flex flex-col"
                style={{ 
                  fontFamily: UI_THEME.FONTS.PREVIEW,
                  aspectRatio: `${selectedLayout.width} / ${selectedLayout.height}`
                }}
              >
                {/* Slide Number / Label */}
                <div className="absolute top-4 right-6 text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest select-none">
                  Slide {index + 1}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {renderSlideContent(slide.blocks)}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 mt-20 opacity-30">
              <Sparkles className="w-12 h-12 mb-4" />
              <p className="font-bold tracking-widest">等待輸入內容...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
