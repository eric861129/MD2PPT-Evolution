import React, { useState, useEffect, useRef } from 'react';
import { SlideData } from '../../services/parser/slides';
import { SlideObject } from '../../services/parser/som';
import { PptTheme } from '../../services/types';
import { PRESET_THEMES, DEFAULT_THEME_ID } from '../../constants/themes';
import { PresentationSyncService, SyncAction } from '../../services/PresentationSyncService';
import { ScaledSlideContainer } from '../common/ScaledSlideContainer';
import { SlideRenderer } from '../common/SlideRenderer';

interface AudienceViewProps {
  slides: SlideObject[];
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
  const [syncedTheme, setSyncedTheme] = useState<PptTheme | undefined>(theme);
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
          if (msg.payload?.theme) setSyncedTheme(msg.payload.theme);
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

  const currentSlide = slides[currentIndex];
  const activeTheme = syncedTheme || theme || PRESET_THEMES[DEFAULT_THEME_ID];

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

  return (
    <div className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center relative">
      {/* Blackout Overlay */}
      {isBlackout && (
        <div 
          data-testid="blackout-overlay"
          className="absolute inset-0 z-[1000] bg-black animate-in fade-in duration-500" 
        />
      )}

      {currentSlide && (
        <ScaledSlideContainer>
          <SlideRenderer 
             slide={currentSlide} 
             theme={activeTheme} 
             globalBg={globalBg}
          />
        </ScaledSlideContainer>
      )}
    </div>
  );
};
