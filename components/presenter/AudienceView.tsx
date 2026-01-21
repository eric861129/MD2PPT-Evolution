/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { SlideContent } from '../editor/PreviewPane';
import { SlideData } from '../../services/parser/slides';
import { PptTheme } from '../../services/types';
import { PRESET_THEMES, DEFAULT_THEME_ID } from '../../constants/themes';

interface AudienceViewProps {
  slides: SlideData[];
  currentIndex: number;
  theme?: PptTheme;
  globalBg?: string;
}

export const AudienceView: React.FC<AudienceViewProps> = ({ 
  slides, 
  currentIndex, 
  theme,
  globalBg
}) => {
  const currentSlide = slides[currentIndex];
  const activeTheme = theme || PRESET_THEMES[DEFAULT_THEME_ID];

  if (!currentSlide) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Waiting for presenter...</h1>
          <p className="opacity-60">No slide content available.</p>
        </div>
      </div>
    );
  }

  // We reuse SlideContent but ensure it takes up the full viewport
  return (
    <div className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* 
         We need to scale the slide content to fit the screen. 
         SlideContent expects to be in a container. 
         Here we simulate the SlideCard's container logic but for full screen.
      */}
      <div 
        className="relative w-full h-full"
        style={{ 
          backgroundColor: activeTheme.colors.background.startsWith('#') ? activeTheme.colors.background : `#${activeTheme.colors.background}` 
        }}
      >
         <SlideContent 
            slide={currentSlide} 
            theme={activeTheme} 
            // We pass an undefined isDark to let SlideContent infer it from slide/theme
         />
      </div>
    </div>
  );
};
