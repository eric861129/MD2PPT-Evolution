import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PresenterConsole } from '../components/presenter/PresenterConsole';
import { BlockType } from '../services/types';
import { PresentationSyncService, SyncAction } from '../services/PresentationSyncService';

// Mock SlideRenderer to avoid complex rendering and context dependency
vi.mock('../components/common/SlideRenderer', () => ({
  SlideRenderer: ({ slide }: any) => <div data-testid="slide-content">Slide {slide.index}</div>
}));

// Mock PresentationSyncService
const mockSendMessage = vi.fn();
vi.mock('../services/PresentationSyncService', () => ({
  PresentationSyncService: vi.fn().mockImplementation(function() {
    return {
      sendMessage: mockSendMessage,
      onMessage: vi.fn(),
      offMessage: vi.fn(),
      close: vi.fn()
    };
  }),
  SyncAction: {
    GOTO_SLIDE: 'GOTO_SLIDE',
    NEXT_SLIDE: 'NEXT_SLIDE',
    PREV_SLIDE: 'PREV_SLIDE',
    SYNC_STATE: 'SYNC_STATE',
    REQUEST_SYNC: 'REQUEST_SYNC'
  }
}));

// Mock peerjs
vi.mock('peerjs', () => ({
  default: vi.fn(),
  Peer: vi.fn().mockImplementation(function() {
    return {
      on: vi.fn(),
      disconnect: vi.fn(),
      destroy: vi.fn()
    };
  })
}));

// Mock RemoteControlService
vi.mock('../services/RemoteControlService', () => ({
  RemoteControlService: vi.fn().mockImplementation(function() {
    return {
      onReady: vi.fn(),
      onCommand: vi.fn(),
      broadcast: vi.fn(),
      close: vi.fn()
    };
  })
}));

// Mock peerjs
vi.mock('peerjs', () => ({
  default: vi.fn(),
  Peer: vi.fn(function() {
    return {
      on: vi.fn(),
      disconnect: vi.fn(),
      destroy: vi.fn()
    };
  })
}));

const mockSlides: any[] = [
  { index: 0, blocks: [{ type: BlockType.HEADING_1, content: 'Slide 1' }] },
  { index: 1, blocks: [{ type: BlockType.HEADING_1, content: 'Slide 2' }] },
  { index: 2, blocks: [{ type: BlockType.HEADING_1, content: 'Slide 3' }] }
];

describe('PresenterConsole', () => {
  it('renders Current Slide and Next Slide correctly', () => {
    render(<PresenterConsole slides={mockSlides} currentIndex={0} />);

    // Check Current Slide
    const currentSlide = screen.getByTestId('current-slide-view');
    expect(currentSlide).toHaveTextContent('Slide 0');

    // Check Next Slide
    const nextSlide = screen.getByTestId('next-slide-view');
    expect(nextSlide).toHaveTextContent('Slide 1');
  });

  it('renders Next Slide as empty/end when at the last slide', () => {
    render(<PresenterConsole slides={mockSlides} currentIndex={2} />);

    // Check Current Slide
    const currentSlide = screen.getByTestId('current-slide-view');
    expect(currentSlide).toHaveTextContent('Slide 2');

    // Check Next Slide (should indicate end or be empty)
    const nextSlide = screen.getByTestId('next-slide-view');
    expect(nextSlide).toHaveTextContent(/End of Presentation/i);
  });

  it('renders Speaker Notes if available', () => {
    const slidesWithNotes = [
      { 
        index: 0, 
        blocks: [], 
        config: { note: 'Do not forget to mention the roadmap.' } 
      }
    ];
    render(<PresenterConsole slides={slidesWithNotes} currentIndex={0} />);
    expect(screen.getByText('Do not forget to mention the roadmap.')).toBeInTheDocument();
  });

  it('renders Timer and Progress', () => {
    render(<PresenterConsole slides={mockSlides} currentIndex={1} />);
    
    // Check Progress
    const progressElement = screen.getByText((_, element) => {
        return element?.textContent === 'Slide 2 / 3' || element?.textContent?.replace(/\s+/g, ' ').trim() === 'Slide 2 / 3';
    });
    expect(progressElement).toBeInTheDocument();

    // Check Timer
    expect(screen.getByTestId('presenter-timer')).toBeInTheDocument();
  });

  it('sends navigation commands when controls are clicked', () => {
    render(<PresenterConsole slides={mockSlides} currentIndex={0} />);
    
    // Check Prev Button
    const nextBtn = screen.getByLabelText('Next Slide');

    fireEvent.click(nextBtn);
    // Component now uses broadcastState which sends SYNC_STATE
    expect(mockSendMessage).toHaveBeenCalledWith(expect.objectContaining({ 
      type: SyncAction.SYNC_STATE, 
      payload: expect.objectContaining({ index: 1 }) 
    }));
  });

  it('renders all slide thumbnails in the navigator and allows jumping', () => {
    render(<PresenterConsole slides={mockSlides} currentIndex={0} />);
    
    // Check if thumbnails are rendered by looking for the slide index text
    expect(screen.getByTitle('Jump to Slide 1')).toBeInTheDocument();
    expect(screen.getByTitle('Jump to Slide 2')).toBeInTheDocument();
    expect(screen.getByTitle('Jump to Slide 3')).toBeInTheDocument();
    
    // Jump to slide 3 (index 2)
    const slide3Btn = screen.getByTitle('Jump to Slide 3');
    fireEvent.click(slide3Btn);
    
    expect(mockSendMessage).toHaveBeenCalledWith(expect.objectContaining({ 
      type: SyncAction.SYNC_STATE, 
      payload: expect.objectContaining({ index: 2 }) 
    }));
  });
});
