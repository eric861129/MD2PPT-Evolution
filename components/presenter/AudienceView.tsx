import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { SlideContent } from '../editor/PreviewPane';
import { SlideData } from '../../services/parser/slides';
import { PptTheme } from '../../services/types';
import { PRESET_THEMES, DEFAULT_THEME_ID } from '../../constants/themes';
import { PresentationSyncService, SyncAction } from '../../services/PresentationSyncService';
import { generateMeshGradient } from '../../services/ppt/GenerativeBgService';

interface AudienceViewProps {
  slides: SlideData[];
  currentIndex: number;
  theme?: PptTheme;
  globalBg?: string;
}

const DESIGN_WIDTH = 1200;
const DESIGN_HEIGHT = 675; // 16:9 aspect ratio default

export const AudienceView: React.FC<AudienceViewProps> = ({
  slides: initialSlides,
  currentIndex: initialIndex,
  theme,
  globalBg
}) => {
  const [slides, setSlides] = useState(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isBlackout, setIsBlackout] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const syncService = useRef<PresentationSyncService | null>(null);

  useEffect(() => {
    syncService.current = new PresentationSyncService();

    syncService.current.onMessage((msg) => {
      switch (msg.type) {
        case SyncAction.GOTO_SLIDE:
          if (msg.payload?.index !== undefined) {
            setCurrentIndex(msg.payload.index);
          }
          break;
        case SyncAction.BLACK_SCREEN:
          setIsBlackout(!!msg.payload?.enabled);
          break;
        case SyncAction.SYNC_STATE:
          if (msg.payload?.slides) setSlides(msg.payload.slides);
          if (msg.payload?.index !== undefined) setCurrentIndex(msg.payload.index);
          break;
      }
    });

    // Request initial sync
    syncService.current.sendMessage({ type: SyncAction.REQUEST_SYNC });

    return () => {
      syncService.current?.close();
    };
  }, []);

  // Update internal state if props change (though sync service is primary)
  useEffect(() => {
    if (initialSlides.length > 0) setSlides(initialSlides);
  }, [initialSlides]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle responsive scaling
  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate scale to fit within the window while maintaining aspect ratio
        const scaleX = windowWidth / DESIGN_WIDTH;
        const scaleY = windowHeight / DESIGN_HEIGHT;
        
        // Use the smaller scale factor to ensure it fits entirely
        const newScale = Math.min(scaleX, scaleY);
        setScale(newScale);
      }
    };

    window.addEventListener('resize', updateScale);
    updateScale();
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const currentSlide = slides[currentIndex];
  const activeTheme = theme || PRESET_THEMES[DEFAULT_THEME_ID];

  if (!currentSlide && slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Waiting for presenter...</h1>
          <p className="opacity-60">Connecting to presentation session.</p>
        </div>
      </div>
    );
  }

  // Calculate background styles
  const rawBg = currentSlide?.config?.background || currentSlide?.config?.bg || currentSlide?.metadata?.bg || globalBg || activeTheme.colors.background;
  let finalBgStyle: React.CSSProperties = {};
  
  if (rawBg === 'mesh' || (typeof rawBg === 'string' && rawBg.startsWith('mesh'))) {
    const meshConfig = currentSlide?.config?.mesh || {};
    const svgString = generateMeshGradient({
      colors: meshConfig.colors,
      seed: meshConfig.seed,
      width: DESIGN_WIDTH,
      height: DESIGN_HEIGHT
    });
    const svgBase64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
    finalBgStyle = { backgroundImage: `url(${svgBase64})`, backgroundSize: 'cover' };
  } else {
    const bgColor = rawBg.startsWith('#') ? rawBg : `#${rawBg}`;
    finalBgStyle = { backgroundColor: bgColor };
  }

  return (
    <div 
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center relative"
    >
      {/* Blackout Overlay */}
      {isBlackout && (
        <div 
          data-testid="blackout-overlay"
          className="absolute inset-0 z-[1000] bg-black animate-in fade-in duration-500" 
        />
      )}

      <div 
        style={{
          width: `${DESIGN_WIDTH}px`,
          height: `${DESIGN_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          ...finalBgStyle
        }}
      >
         {/* Background Image Layer */}
         {(currentSlide?.config?.bgImage || currentSlide?.metadata?.bgImage) && (
           <div 
             className="absolute inset-0 bg-cover bg-center z-0" 
             style={{ backgroundImage: `url(${currentSlide.config?.bgImage || currentSlide.metadata?.bgImage})` }}
           >
             <div className="absolute inset-0 bg-black/40"></div>
           </div>
         )}

         {currentSlide && (
           <div className="flex-1 relative z-10 flex flex-col p-[80px_100px] text-left">
             <SlideContent 
                slide={currentSlide} 
                theme={activeTheme} 
             />
           </div>
         )}
      </div>
    </div>
  );
};
