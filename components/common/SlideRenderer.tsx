/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { SlideData } from '../../services/parser/slides';
import { SlideObject } from '../../services/parser/som';
import { PptTheme } from '../../services/types';
import { generateMeshGradient } from '../../services/ppt/GenerativeBgService';
import { SlideContent } from './SlideContent';
import { EditorContext } from '../../contexts/EditorContext';
import { getBrightness, getContrastColor } from '../../utils/styleParser';

const DESIGN_WIDTH = 1200;
const DESIGN_HEIGHT = 675;

interface SlideRendererProps {
  slide: SlideObject;
  theme: PptTheme;
  globalBg?: string;
  width?: number; // Optional override
  height?: number; // Optional override
  scale?: number; // Optional override
  className?: string;
  showNotes?: boolean; // Typically unused here but kept for compatibility if needed
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ 
  slide, 
  theme, 
  globalBg,
  width = DESIGN_WIDTH,
  height, // If undefined, calculated from aspect ratio or fixed
  scale = 1,
  className = ""
}) => {
  // Safe way to access context without throwing error
  const context = React.useContext(EditorContext);
  const brandConfig = context?.brandConfig;

  const bgImage = slide.background.image;
  
  // Theme Overrides
  const themeBg = theme.colors.background.startsWith('#') ? theme.colors.background : `#${theme.colors.background}`;
  
  const rawBg = slide.background.color || globalBg || themeBg;
  
  // Generative Background Logic
  let finalBgStyle: React.CSSProperties = {};
  let isMesh = false;
  let effectiveBgColor = '#FFFFFF';

  // Default height if not provided (assume 16:9)
  const finalHeight = height || (width * 9 / 16);

  if (slide.background.type === 'mesh') {
    isMesh = true;
    const meshConfig = slide.background.meshConfig || {};
    // Use the first color of the mesh to determine text contrast
    effectiveBgColor = meshConfig.colors?.[0] || '#000000';
    
    // Generate SVG data URI
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
  
  // Calculate isDark based on background
  let isDark = false;
  if (bgImage) {
    isDark = true; // Assume background images need white text overlay
  } else {
    isDark = getBrightness(effectiveBgColor) < 160; // Threshold for dark background
  }
  
  // Dynamic Text Color: Choose between white and theme text, or force dark gray if theme text is too light for light bg
  const themeText = theme.colors.text.startsWith('#') ? theme.colors.text : `#${theme.colors.text}`;
  let textColor = '#FFFFFF';

  if (!isDark) {
    // If background is light, and theme's text color is ALSO light (e.g. Midnight theme on White bg)
    // then force a dark gray color.
    const themeTextBrightness = getBrightness(themeText);
    textColor = themeTextBrightness > 180 ? '#1C1917' : themeText;
  }
  
  // Logo Position Styles
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
        transform: `scale(${scale})`, 
        transformOrigin: 'top left', 
        ...finalBgStyle,
        color: textColor, 
        fontFamily: theme.fonts.main,
      }}
    >
      {bgImage && <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bgImage})` }}><div className="absolute inset-0 bg-black/40"></div></div>}
      
      {/* Brand Logo */}
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
};
