import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { VisualTweakerProvider, useVisualTweaker } from '../contexts/VisualTweakerContext';
import { BlockType } from '../services/types';
import React from 'react';

describe('VisualTweakerContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <VisualTweakerProvider 
      onUpdateContent={() => {}} 
      onGetLineContent={(line) => `Line ${line}`}
    >
      {children}
    </VisualTweakerProvider>
  );

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useVisualTweaker(), { wrapper });
    
    expect(result.current.isVisible).toBe(false);
    expect(result.current.selectedElement).toBeNull();
  });

  it('should open tweaker and set state', () => {
    const { result } = renderHook(() => useVisualTweaker(), { wrapper });
    const mockElement = document.createElement('div');
    
    act(() => {
      result.current.openTweaker(mockElement, BlockType.HEADING_1, 5);
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.blockType).toBe(BlockType.HEADING_1);
    expect(result.current.sourceLine).toBe(5);
  });

  it('should close tweaker', () => {
    const { result } = renderHook(() => useVisualTweaker(), { wrapper });

    const mockElement = document.createElement('div');
    act(() => {
      result.current.openTweaker(mockElement, BlockType.HEADING_1, 5);
    });

    act(() => {
      result.current.closeTweaker();
    });

    expect(result.current.isVisible).toBe(false);
    expect(result.current.selectedElement).toBeNull();
  });

  it('should call onUpdateContent when updateContent is called', () => {
    const onUpdateContent = vi.fn();
    const { result } = renderHook(() => useVisualTweaker(), {
      wrapper: ({ children }) => (
        <VisualTweakerProvider 
          onUpdateContent={onUpdateContent}
          onGetLineContent={() => ""}
        >
          {children}
        </VisualTweakerProvider>
      ),
    });

    const mockElement = document.createElement('div');
    act(() => {
      result.current.openTweaker(mockElement, BlockType.HEADING_1, 5);
    });

    act(() => {
      result.current.updateContent('New Content');
    });

    expect(onUpdateContent).toHaveBeenCalledWith(5, 'New Content', undefined);
  });
});

    