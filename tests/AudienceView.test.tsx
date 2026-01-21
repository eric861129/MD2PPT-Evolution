import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AudienceView } from '../components/presenter/AudienceView';
import { BlockType } from '../services/types';
import { EditorContext } from '../contexts/EditorContext';

// Mock dependencies
vi.mock('../components/common/SlideRenderer', () => ({
  SlideRenderer: ({ slide }: any) => <div data-testid="slide-content">Slide {slide.index + 1} Content</div>
}));

// Mock PresentationSyncService to avoid side effects during render
vi.mock('../services/PresentationSyncService', () => ({
  PresentationSyncService: vi.fn().mockImplementation(function() {
    return {
      onMessage: vi.fn((handler) => { 
        (global as any).lastMessageHandler = handler; 
      }),
      offMessage: vi.fn(),
      close: vi.fn(),
      sendMessage: vi.fn()
    };
  }),
  SyncAction: {
    GOTO_SLIDE: 'GOTO_SLIDE',
    BLACK_SCREEN: 'BLACK_SCREEN',
    REQUEST_SYNC: 'REQUEST_SYNC',
    SYNC_STATE: 'SYNC_STATE'
  }
}));

const mockSlides: any[] = [
  { index: 0, blocks: [{ type: BlockType.HEADING_1, content: 'Slide 1' }] },
  { index: 1, blocks: [{ type: BlockType.HEADING_1, content: 'Slide 2' }] }
];

const mockContextValue = {
  brandConfig: { logo: null, logoPosition: 'top-right' },
  activeTheme: { colors: { primary: 'EA580C', background: 'FFFFFF', text: '1C1917' }, fonts: { main: 'Arial' } }
};

describe('AudienceView', () => {
  it('renders "Waiting for presenter..." when no content is available', () => {
    render(
      <EditorContext.Provider value={mockContextValue as any}>
        <AudienceView slides={[]} currentIndex={0} />
      </EditorContext.Provider>
    );
    expect(screen.getByText(/Waiting for presenter/i)).toBeInTheDocument();
  });

  it('updates slide index when receiving GOTO_SLIDE message', async () => {
    render(
      <EditorContext.Provider value={mockContextValue as any}>
        <AudienceView slides={mockSlides} currentIndex={0} />
      </EditorContext.Provider>
    );
    
    // Simulate sync message
    act(() => {
      (global as any).lastMessageHandler({ type: 'GOTO_SLIDE', payload: { index: 1 } });
    });

    expect(screen.getByText(/Slide 2 Content/i)).toBeInTheDocument();
  });

  it('toggles blackout mode when receiving BLACK_SCREEN message', () => {
    render(
      <EditorContext.Provider value={mockContextValue as any}>
        <AudienceView slides={mockSlides} currentIndex={0} />
      </EditorContext.Provider>
    );
    
    // Default: visible
    expect(screen.queryByTestId('blackout-overlay')).not.toBeInTheDocument();

    // Blackout ON
    act(() => {
      (global as any).lastMessageHandler({ type: 'BLACK_SCREEN', payload: { enabled: true } });
    });
    expect(screen.getByTestId('blackout-overlay')).toBeInTheDocument();

    // Blackout OFF
    act(() => {
      (global as any).lastMessageHandler({ type: 'BLACK_SCREEN', payload: { enabled: false } });
    });
    expect(screen.queryByTestId('blackout-overlay')).not.toBeInTheDocument();
  });
});
