import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { VisualTweakerProvider, useVisualTweaker } from '../contexts/VisualTweakerContext';
import { BlockType } from '../services/types';

// Mock DOM elements
const createMockElement = (rect: any) => ({
  getBoundingClientRect: () => rect,
});

describe('VisualTweakerContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <VisualTweakerProvider>{children}</VisualTweakerProvider>
  );

  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useVisualTweaker(), { wrapper });
    expect(result.current.isVisible).toBe(false);
    expect(result.current.selectedElement).toBeNull();
  });

  it('should open tweaker with correct data and position', () => {
    const { result } = renderHook(() => useVisualTweaker(), { wrapper });
    const mockElement = createMockElement({ top: 100, right: 200, bottom: 150, left: 100 }) as any;

    act(() => {
      result.current.openTweaker(mockElement, BlockType.HEADING_1, 5);
    });

    expect(result.current.isVisible).toBe(true);
    expect(result.current.selectedElement).toBe(mockElement);
    expect(result.current.blockType).toBe(BlockType.HEADING_1);
    expect(result.current.sourceLine).toBe(5);
    // Position check: top + scrollY, left: right + scrollX + 20
    // Default scroll is 0
    expect(result.current.position).toEqual({ top: 100, left: 220 });
  });

  it('should close tweaker', () => {
    const { result } = renderHook(() => useVisualTweaker(), { wrapper });
    const mockElement = createMockElement({ top: 0, right: 0 }) as any;

    act(() => {
      result.current.openTweaker(mockElement, BlockType.PARAGRAPH, 1);
    });
    expect(result.current.isVisible).toBe(true);

    act(() => {
      result.current.closeTweaker();
    });
    expect(result.current.isVisible).toBe(false);
    expect(result.current.selectedElement).toBeNull();
  });
});
