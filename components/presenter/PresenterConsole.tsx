/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { SlideContent } from '../editor/PreviewPane';
import { SlideData } from '../../services/parser/slides';
import { PRESET_THEMES, DEFAULT_THEME_ID } from '../../constants/themes';

interface PresenterConsoleProps {
  slides: SlideData[];
  currentIndex: number;
}

export const PresenterConsole: React.FC<PresenterConsoleProps> = ({ slides, currentIndex }) => {
  const currentSlide = slides[currentIndex];
  const nextSlide = slides[currentIndex + 1];
  
  // Use a default theme for preview if none specified in slide
  const theme = PRESET_THEMES[DEFAULT_THEME_ID];

  return (
    <div className="flex h-screen w-screen bg-stone-900 text-white overflow-hidden">
      {/* Main View: Current Slide */}
      <div className="flex-1 flex flex-col p-4 border-r border-stone-700">
        <h2 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Current Slide</h2>
        <div className="flex-1 bg-black relative rounded-lg overflow-hidden flex items-center justify-center" data-testid="current-slide-view">
          {currentSlide ? (
             <div className="scale-[0.8] origin-center">
               <SlideContent slide={currentSlide} theme={theme} />
             </div>
          ) : (
            <p>No content</p>
          )}
        </div>
      </div>

      {/* Sidebar: Next Slide & Notes */}
      <div className="w-1/3 flex flex-col p-4 bg-stone-800">
        {/* Next Slide Preview */}
        <div className="h-1/3 flex flex-col mb-4">
          <h2 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Next Slide</h2>
          <div className="flex-1 bg-black relative rounded-lg overflow-hidden flex items-center justify-center border border-stone-600" data-testid="next-slide-view">
            {nextSlide ? (
               <div className="scale-[0.4] origin-center">
                 <SlideContent slide={nextSlide} theme={theme} />
               </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-stone-500 h-full w-full">
                <span className="font-bold">End of Presentation</span>
              </div>
            )}
          </div>
        </div>

        {/* Placeholder for Notes (Next Task) */}
        <div className="flex-1 bg-stone-900 rounded-lg p-4 border border-stone-700">
          <h2 className="text-sm font-bold text-stone-400 mb-2 uppercase tracking-wider">Speaker Notes</h2>
          <div className="text-stone-300 text-sm leading-relaxed">
            {/* Notes will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};
