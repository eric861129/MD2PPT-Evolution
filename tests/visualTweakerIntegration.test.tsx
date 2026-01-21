import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VisualTweakerProvider, useVisualTweaker } from '../contexts/VisualTweakerContext';
import { BlockType } from '../services/types';
import { TweakerOverlay } from '../components/tweaker/TweakerOverlay';

// A simple component to trigger the tweaker
const TriggerComponent = () => {
  const { openTweaker } = useVisualTweaker();
  return (
    <div 
      data-testid="trigger" 
      onClick={(e) => openTweaker(e.currentTarget as HTMLElement, BlockType.PARAGRAPH, 5)}
    >
      Click me
    </div>
  );
};

describe('Visual Tweaker Integration', () => {
  
  it('should open tweaker and call onUpdateContent when content changes', async () => {
    const handleUpdateContent = vi.fn();
    const handleGetLineContent = vi.fn().mockReturnValue('Original Line Content');

    render(
      <VisualTweakerProvider 
        onUpdateContent={handleUpdateContent}
        onGetLineContent={handleGetLineContent}
      >
        <TriggerComponent />
        <TweakerOverlay />
      </VisualTweakerProvider>
    );

    // 1. Click to open
    fireEvent.click(screen.getByTestId('trigger'));
    
    // 2. Verify tweaker is visible
    expect(screen.getByText(/PARAGRAPH Tweaker/i)).toBeInTheDocument();
    
    // 3. Find input and change it
    const textarea = screen.getByDisplayValue('Original Line Content');
    fireEvent.change(textarea, { target: { value: 'Updated Line Content' } });
    
    // 4. Verify callback was called (Real-time sync)
    expect(handleUpdateContent).toHaveBeenCalledWith(5, 'Updated Line Content');
  });
});
