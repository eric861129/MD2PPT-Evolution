import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BlockType } from '../services/types';

interface TweakerState {
  isVisible: boolean;
  selectedElement: HTMLElement | null;
  sourceLine: number | null;
  blockType: BlockType | null;
  position: { top: number; left: number };
}

interface VisualTweakerContextType extends TweakerState {
  openTweaker: (element: HTMLElement, type: BlockType, sourceLine: number) => void;
  closeTweaker: () => void;
  updatePosition: () => void;
  updateContent: (newContent: string) => void;
}

const VisualTweakerContext = createContext<VisualTweakerContextType | undefined>(undefined);

export const VisualTweakerProvider: React.FC<{ children: ReactNode; onUpdateContent: (line: number, content: string) => void }> = ({ children, onUpdateContent }) => {
  const [state, setState] = useState<TweakerState>({
    isVisible: false,
    selectedElement: null,
    sourceLine: null,
    blockType: null,
    position: { top: 0, left: 0 }
  });

  const updateContent = useCallback((newContent: string) => {
    if (state.sourceLine !== null) {
      onUpdateContent(state.sourceLine, newContent);
    }
  }, [state.sourceLine, onUpdateContent]);

  const updatePosition = useCallback(() => {
    if (!state.selectedElement) return;
    
    const rect = state.selectedElement.getBoundingClientRect();
    const OVERLAY_WIDTH = 300; // Estimated width (w-64 + padding)
    const VIEWPORT_MARGIN = 20;
    
    let left = rect.right + VIEWPORT_MARGIN;
    
    // Flip to left if not enough space on right
    if (left + OVERLAY_WIDTH > window.innerWidth) {
      left = rect.left - OVERLAY_WIDTH - VIEWPORT_MARGIN;
      
      // If left is also off-screen (e.g., huge element on small screen), 
      // align to the right edge of the viewport
      if (left < 0) {
        left = window.innerWidth - OVERLAY_WIDTH - VIEWPORT_MARGIN;
      }
    }

    setState(prev => ({
      ...prev,
      position: {
        top: rect.top, // Use viewport coordinates for fixed positioning
        left: left
      }
    }));
  }, [state.selectedElement]);

  const openTweaker = useCallback((element: HTMLElement, type: BlockType, sourceLine: number) => {
    const rect = element.getBoundingClientRect();
    const OVERLAY_WIDTH = 300; 
    const VIEWPORT_MARGIN = 20;
    
    let left = rect.right + VIEWPORT_MARGIN;
    
    if (left + OVERLAY_WIDTH > window.innerWidth) {
      left = rect.left - OVERLAY_WIDTH - VIEWPORT_MARGIN;
      if (left < 0) {
        left = window.innerWidth - OVERLAY_WIDTH - VIEWPORT_MARGIN;
      }
    }

    setState({
      isVisible: true,
      selectedElement: element,
      blockType: type,
      sourceLine: sourceLine,
      position: {
        top: rect.top,
        left: left
      }
    });
  }, []);

  const closeTweaker = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false, selectedElement: null }));
  }, []);

  return (
    <VisualTweakerContext.Provider value={{ ...state, openTweaker, closeTweaker, updatePosition, updateContent }}>
      {children}
    </VisualTweakerContext.Provider>
  );
};

export const useVisualTweaker = () => {
  const context = useContext(VisualTweakerContext);
  if (!context) {
    throw new Error('useVisualTweaker must be used within a VisualTweakerProvider');
  }
  return context;
};
