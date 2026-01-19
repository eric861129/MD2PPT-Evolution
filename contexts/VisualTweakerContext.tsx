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
}

const VisualTweakerContext = createContext<VisualTweakerContextType | undefined>(undefined);

export const VisualTweakerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TweakerState>({
    isVisible: false,
    selectedElement: null,
    sourceLine: null,
    blockType: null,
    position: { top: 0, left: 0 }
  });

  const updatePosition = useCallback(() => {
    if (!state.selectedElement) return;
    
    const rect = state.selectedElement.getBoundingClientRect();
    // Position to the right of the element, or below if space is tight
    // For now, let's position it absolute to the viewport
    setState(prev => ({
      ...prev,
      position: {
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 20 // 20px padding
      }
    }));
  }, [state.selectedElement]);

  const openTweaker = useCallback((element: HTMLElement, type: BlockType, sourceLine: number) => {
    const rect = element.getBoundingClientRect();
    setState({
      isVisible: true,
      selectedElement: element,
      blockType: type,
      sourceLine: sourceLine,
      position: {
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 20
      }
    });
  }, []);

  const closeTweaker = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false, selectedElement: null }));
  }, []);

  return (
    <VisualTweakerContext.Provider value={{ ...state, openTweaker, closeTweaker, updatePosition }}>
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
