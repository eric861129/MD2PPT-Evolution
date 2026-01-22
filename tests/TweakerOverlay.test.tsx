import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TweakerOverlay } from '../components/tweaker/TweakerOverlay';
import { VisualTweakerProvider, useVisualTweaker } from '../contexts/VisualTweakerContext';
import { BlockType } from '../services/types';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  X: () => 'X',
  ChevronUp: () => 'ChevronUp',
  ChevronDown: () => 'ChevronDown',
  Type: () => 'Type',
  Image: () => 'Image',
  AlertCircle: () => 'AlertCircle'
}));


describe('TweakerOverlay', () => {
  it('should not render when isVisible is false', () => {
    render(
      <VisualTweakerProvider onUpdateContent={() => {}} onGetLineContent={() => ""}>
        <TweakerOverlay />
      </VisualTweakerProvider>
    );
    
    expect(screen.queryByText(/Tweaker/)).toBeNull();
  });

  it('should render correctly when visible', () => {
    const TestWrapper = () => {
      const { openTweaker } = useVisualTweaker();
      React.useEffect(() => {
        const mockElement = document.createElement('div');
        openTweaker(mockElement, BlockType.HEADING_1, 10);
      }, [openTweaker]);
      
      return <TweakerOverlay />;
    };

    render(
      <VisualTweakerProvider onUpdateContent={() => {}} onGetLineContent={() => "# Test Heading"}>
        <TestWrapper />
      </VisualTweakerProvider>
    );

    expect(screen.getByText(/HEADING 1/i)).toBeDefined();
    expect(screen.getByText(/Tweaker/i)).toBeDefined();
    expect(screen.getByLabelText(/Content Edit/i)).toBeDefined();
  });
});
