/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useEffect, useRef } from 'react';
import { SlideData } from '../../services/parser/slides';
import { PRESET_THEMES, DEFAULT_THEME_ID } from '../../constants/themes';
import { PresenterTimer } from './PresenterTimer';
import { ChevronLeft, ChevronRight, MonitorOff, Home, Smartphone, ExternalLink, LogOut } from 'lucide-react';
import { PresentationSyncService, SyncAction } from '../../services/PresentationSyncService';
import { RemoteControlService } from '../../services/RemoteControlService';
import { RemoteQRCodeModal } from './RemoteQRCodeModal';
import { ScaledSlideContainer } from '../common/ScaledSlideContainer';
import { SlideRenderer } from '../common/SlideRenderer';
import { PptTheme } from '../../services/types';

interface PresenterConsoleProps {
  slides: SlideData[];
  currentIndex: number;
  theme?: PptTheme;
}

export const PresenterConsole: React.FC<PresenterConsoleProps> = ({ slides, currentIndex: initialIndex, theme: propTheme }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [peerId, setPeerId] = useState<string>('');
  const [isRemoteModalOpen, setIsRemoteModalOpen] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  
  const syncService = useRef<PresentationSyncService | null>(null);
  const remoteService = useRef<RemoteControlService | null>(null);

  // Use a default theme for preview if none specified
  const activeTheme = propTheme || PRESET_THEMES[DEFAULT_THEME_ID];

  // Helper to open/re-open the audience window
  const openAudienceWindow = () => {
    const baseUrl = window.location.href.split('#')[0];
    const audienceUrl = `${baseUrl}#/audience`;
    window.open(audienceUrl, 'AudienceWindow', 'width=1280,height=720,menubar=no,toolbar=no');
  };

  const handleExit = () => {
    if (confirm('確定要結束演講模式並回到編輯器嗎？')) {
      window.location.hash = '';
    }
  };

  // Refs for accessing latest state in event handlers to avoid stale closures
  const stateRef = useRef({ currentIndex, isBlackout, slides });
  useEffect(() => {
    stateRef.current = { currentIndex, isBlackout, slides };
  }, [currentIndex, isBlackout, slides]);

  const activeThumbnailRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active thumbnail
  useEffect(() => {
    if (activeThumbnailRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentIndex]);

  // Helper to send sync state to all windows
  const broadcastState = (index: number, blackout: boolean) => {
    const currentSlides = stateRef.current.slides;
    if (currentSlides.length === 0) return;

    const currentNote = currentSlides[index]?.config?.note || currentSlides[index]?.metadata?.note || '';
    
    const statePayload = { index, blackout, slides: currentSlides, total: currentSlides.length, theme: propTheme };

    // Save to localStorage for initial load of new windows
    localStorage.setItem('md2ppt_presenter_state', JSON.stringify(statePayload));

    // Broadcast to other local windows (Audience View)
    syncService.current?.sendMessage({ 
      type: SyncAction.SYNC_STATE, 
      payload: statePayload 
    });

    // Also send to mobile remote via P2P
    remoteService.current?.broadcast({ 
      type: 'SYNC_STATE', 
      payload: { index, total: currentSlides.length, note: currentNote, blackout } 
    });
  };

  useEffect(() => {
    syncService.current = new PresentationSyncService();
    remoteService.current = new RemoteControlService();

    // Listen for local sync requests (e.g. when Audience View opens)
    syncService.current.onMessage((msg) => {
      if (msg.type === SyncAction.REQUEST_SYNC) {
        const { currentIndex, isBlackout } = stateRef.current;
        broadcastState(currentIndex, isBlackout);
      }
    });

    remoteService.current.onReady((id) => {
      setPeerId(id);
    });

    remoteService.current.onCommand((cmd) => {
      // Use ref-based logic to avoid stale closures
      if (cmd.action === 'NEXT') handleNextInternal();
      if (cmd.action === 'PREV') handlePrevInternal();
      if (cmd.action === 'BLACKOUT') toggleBlackoutInternal();
    });

    // Initial broadcast
    broadcastState(initialIndex, false);

    return () => {
      syncService.current?.close();
      remoteService.current?.close();
    };
  }, []);

  // Update effect for prop changes (e.g. content updated in editor)
  useEffect(() => {
    broadcastState(currentIndex, isBlackout);
  }, [slides]);

  const handleGotoSlide = (index: number) => {
    const { isBlackout } = stateRef.current;
    if (index >= 0 && index < slides.length) {
      setCurrentIndex(index);
      broadcastState(index, isBlackout);
    }
  };

  // Internal Logic using latest state
  const handleNextInternal = () => {
    const { currentIndex, slides, isBlackout } = stateRef.current;
    if (currentIndex < slides.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      broadcastState(next, isBlackout);
    }
  };

  const handlePrevInternal = () => {
    const { currentIndex, isBlackout } = stateRef.current;
    if (currentIndex > 0) {
      const next = currentIndex - 1;
      setCurrentIndex(next);
      broadcastState(next, isBlackout);
    }
  };

  const toggleBlackoutInternal = () => {
    const { currentIndex, isBlackout } = stateRef.current;
    const newState = !isBlackout;
    setIsBlackout(newState);
    syncService.current?.sendMessage({ type: SyncAction.BLACK_SCREEN, payload: { enabled: newState } });
    broadcastState(currentIndex, newState);
  };

  const currentSlide = slides[currentIndex];
  const nextSlide = slides[currentIndex + 1];
  const note = currentSlide?.config?.note || currentSlide?.metadata?.note;

  return (
    <div className="flex flex-col h-screen w-screen bg-stone-900 text-white overflow-hidden font-sans">
      {/* Top Bar: Timer & Progress */}
      <div className="h-14 border-b border-stone-700 flex items-center justify-between px-6 bg-stone-950 shrink-0">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="font-bold text-lg tracking-widest text-[#EA580C] hidden sm:block">PRESENTER VIEW</div>
          
          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
            <button 
              onClick={openAudienceWindow}
              title="重新開啟投影片視窗 (Audience View)"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 text-stone-400 hover:text-white rounded-lg transition-all"
            >
              <ExternalLink size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Project</span>
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button 
              onClick={() => setIsRemoteModalOpen(true)}
              title="手機遙控設定"
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-orange-500/20 text-stone-400 hover:text-[#EA580C] rounded-lg transition-all"
            >
              <Smartphone size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Remote</span>
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button 
              onClick={toggleBlackoutInternal}
              title="切換觀眾視窗黑屏"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isBlackout ? 'bg-red-600 text-white' : 'text-stone-400 hover:text-white'}`}
            >
              <MonitorOff size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:block">Blackout</span>
            </button>
          </div>

          <button 
            onClick={handleExit}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-red-500/20 text-stone-500 hover:text-red-400 border border-white/10 rounded-xl transition-all"
          >
            <LogOut size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.1em]">Exit</span>
          </button>
        </div>
        <PresenterTimer />
        <div className="font-mono text-xl font-bold text-stone-400">
          Slide <span className="text-white">{currentIndex + 1}</span> <span className="text-stone-600">/</span> {slides.length}
        </div>
      </div>

      <RemoteQRCodeModal 
        peerId={peerId} 
        isOpen={isRemoteModalOpen} 
        onClose={() => setIsRemoteModalOpen(false)} 
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: All Slides Navigator */}
        <div className="w-48 lg:w-56 flex flex-col bg-stone-950 border-r border-stone-700 shrink-0">
          <div className="px-4 py-3 border-b border-white/5 bg-stone-900/50">
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">All Slides</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
            {slides.map((s, idx) => (
              <button
                key={idx}
                ref={currentIndex === idx ? activeThumbnailRef : null}
                onClick={() => handleGotoSlide(idx)}
                title={`Jump to Slide ${idx + 1}`}
                className={`w-full group relative transition-all ${currentIndex === idx ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
              >
                {/* Index Label */}
                <div className={`absolute -left-1 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-colors ${
                  currentIndex === idx 
                    ? 'bg-[#EA580C] border-[#EA580C] text-white shadow-[0_0_10px_rgba(234,88,12,0.5)]' 
                    : 'bg-stone-800 border-stone-600 text-stone-400 group-hover:border-[#EA580C]/50'
                }`}>
                  {idx + 1}
                </div>

                {/* Thumbnail Container */}
                <div className={`w-full aspect-video bg-black rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === idx 
                    ? 'border-[#EA580C] shadow-[0_0_20px_rgba(234,88,12,0.2)]' 
                    : 'border-white/5 group-hover:border-white/20'
                }`}>
                  <div className="pointer-events-none scale-[0.15] origin-top-left" style={{ width: '1200px', height: '675px' }}>
                    <SlideRenderer slide={s} theme={activeTheme} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main View: Current Slide */}
        <div className="flex-1 flex flex-col p-6 border-r border-stone-700 relative group">
          <h2 className="text-xs font-black text-stone-500 mb-3 uppercase tracking-[0.2em]">Current Slide</h2>
          <div className="flex-1 bg-black relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10" data-testid="current-slide-view">
            {currentSlide ? (
               <ScaledSlideContainer>
                 <SlideRenderer slide={currentSlide} theme={activeTheme} />
               </ScaledSlideContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-stone-500">No content</p>
              </div>
            )}
          </div>

          {/* Navigation Overlays */}
          <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-start pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
               onClick={handlePrevInternal}
               disabled={currentIndex === 0}
               aria-label="Previous Slide"
               className="p-4 bg-stone-800/80 rounded-full hover:bg-[#EA580C] hover:text-white disabled:opacity-30 disabled:hover:bg-stone-800/80 transition-all"
             >
               <ChevronLeft size={32} />
             </button>
          </div>
          <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
               onClick={handleNextInternal}
               disabled={currentIndex === slides.length - 1}
               aria-label="Next Slide"
               className="p-4 bg-stone-800/80 rounded-full hover:bg-[#EA580C] hover:text-white disabled:opacity-30 disabled:hover:bg-stone-800/80 transition-all"
             >
               <ChevronRight size={32} />
             </button>
          </div>
        </div>

        {/* Sidebar: Next Slide & Notes */}
        <div className="w-80 lg:w-96 flex flex-col p-4 lg:p-6 bg-stone-900 gap-4 lg:gap-6 border-l border-stone-700 shrink-0">
          {/* Next Slide Preview */}
          <div className="flex-none aspect-video flex flex-col">
            <h2 className="text-xs font-black text-stone-500 mb-3 uppercase tracking-[0.2em]">Next Slide</h2>
            <div className="flex-1 bg-black relative rounded-xl overflow-hidden border border-stone-700 shadow-lg" data-testid="next-slide-view">
              {nextSlide ? (
                 <ScaledSlideContainer>
                   <SlideRenderer slide={nextSlide} theme={activeTheme} />
                 </ScaledSlideContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-stone-500 h-full w-full">
                  <span className="font-bold uppercase tracking-widest text-xs">End of Presentation</span>
                </div>
              )}
            </div>
          </div>

          {/* Speaker Notes */}
          <div className="flex-1 flex flex-col min-h-0">
            <h2 className="text-xs font-black text-stone-500 mb-3 uppercase tracking-[0.2em]">Speaker Notes</h2>
            <div className="flex-1 bg-stone-800/50 rounded-xl p-5 border border-stone-700/50 overflow-y-auto custom-scrollbar">
              {note ? (
                <div className="text-stone-200 text-lg leading-relaxed whitespace-pre-wrap font-medium font-sans">
                  {note}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-stone-600 text-sm italic">
                  No notes for this slide.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};