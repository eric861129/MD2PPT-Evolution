/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { memo } from 'react';
import { SlideObject } from '../../services/parser/som';
import { PptTheme } from '../../services/types';
import { generateMeshGradient } from '../../services/ppt/GenerativeBgService';
import { SlideContent } from './SlideContent';
import { EditorContext } from '../../contexts/EditorContext';
import { getBrightness } from '../../utils/styleParser';

const DESIGN_WIDTH = 1200;

interface SlideRendererProps {
  slide: SlideObject;
  theme: PptTheme;
  globalBg?: string;
  width?: number; 
  height?: number; 
  scale?: number; 
  className?: string;
  showNotes?: boolean; 
}

/**
 * SlideRenderer - Optimized with React.memo
 */
export const SlideRenderer: React.FC<SlideRendererProps> = memo(({ 
  slide, 
  theme, 
  globalBg,
  width = DESIGN_WIDTH,
  height, 
  scale = 1,
  className = ""
}) => {
  const context = React.useContext(EditorContext);
  const brandConfig = context?.brandConfig;

  const bgImage = slide.background.image;
  const themeBg = theme.colors.background.startsWith('#') ? theme.colors.background : `#${theme.colors.background}`;
  const rawBg = slide.background.color || globalBg || themeBg;
  
  let finalBgStyle: React.CSSProperties = {};
  let effectiveBgColor = '#FFFFFF';
  const finalHeight = height || (width * 9 / 16);

  if (slide.background.type === 'mesh') {
    const meshConfig = slide.background.meshConfig || {};
    effectiveBgColor = meshConfig.colors?.[0] || '#000000';
    
    // Use requestIdleCallback if possible or standard generation
    const svgString = generateMeshGradient({
      colors: meshConfig.colors,
      seed: meshConfig.seed,
      width: width,
      height: finalHeight
    });
    const svgBase64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
    finalBgStyle = { backgroundImage: `url(${svgBase64})`, backgroundSize: 'cover' };
  } else {
    effectiveBgColor = rawBg.startsWith('#') ? rawBg : `#${rawBg}`;
    finalBgStyle = { backgroundColor: effectiveBgColor };
  }
  
  let isDark = bgImage ? true : getBrightness(effectiveBgColor) < 160;
  const themeText = theme.colors.text.startsWith('#') ? theme.colors.text : `#${theme.colors.text}`;
  let textColor = '#FFFFFF';

  if (!isDark) {
    const themeTextBrightness = getBrightness(themeText);
    textColor = themeTextBrightness > 180 ? '#1C1917' : themeText;
  }
  
  const getLogoPositionStyles = (): React.CSSProperties => {
    switch (brandConfig?.logoPosition) {
      case 'top-left': return { top: '40px', left: '40px' };
      case 'top-right': return { top: '40px', right: '40px' };
      case 'bottom-left': return { bottom: '40px', left: '40px' };
      case 'bottom-right': return { bottom: '40px', right: '40px' };
      default: return { top: '40px', right: '40px' };
    }
  };

  return (
    <div 
      className={`relative overflow-hidden flex flex-col ${className}`}
      style={{ 
        width: `${width}px`, 
        height: `${finalHeight}px`, 
        transform: `translate3d(0,0,0) scale(${scale})`, 
        transformOrigin: 'top left', 
        ...finalBgStyle,
        color: textColor, 
        fontFamily: theme.fonts.main,
        willChange: 'transform'
      }}
    >
      {bgImage && <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bgImage})` }}><div className="absolute inset-0 bg-black/40"></div></div>}
      
      {brandConfig?.logo && (
        <div className="absolute z-30" style={getLogoPositionStyles()}>
          <img src={brandConfig.logo} alt="Brand Logo" className="max-h-16 max-w-[200px] object-contain opacity-80" />
        </div>
      )}

      <div className="flex-1 relative z-10 flex flex-col p-[80px_100px]">
        <SlideContent slide={slide} isDark={isDark} theme={theme} />
      </div>
    </div>
  );
}, (prev, next) => {
  // Custom equality check for performance
  return (
    prev.slide === next.slide && 
    prev.theme.id === next.theme.id && 
    prev.scale === next.scale && 
    prev.width === next.width &&
    prev.globalBg === next.globalBg
  );
});