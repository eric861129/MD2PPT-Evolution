import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PresenterConsole } from '../components/presenter/PresenterConsole';
import { BlockType } from '../services/types';
import { PresentationSyncService, SyncAction } from '../services/PresentationSyncService';

// Mock SlideContent to avoid complex rendering
vi.mock('../components/editor/PreviewPane', () => ({
  SlideContent: ({ slide }: any) => <div data-testid="slide-content">Slide {slide.index}</div>
}));

// Mock PresentationSyncService
const mockSendMessage = vi.fn();
vi.mock('../services/PresentationSyncService', () => ({
  PresentationSyncService: vi.fn(function() {
    return {
      sendMessage: mockSendMessage,
      onMessage: vi.fn(),
      offMessage: vi.fn(),
      close: vi.fn()
    };
  }),
  SyncAction: {
    NEXT_SLIDE: 'NEXT_SLIDE',
    PREV_SLIDE: 'PREV_SLIDE'
  }
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
    
    // Check Prev Button (should be disabled or present)
    const prevBtn = screen.getByLabelText('Previous Slide');
    const nextBtn = screen.getByLabelText('Next Slide');

    fireEvent.click(nextBtn);
    expect(mockSendMessage).toHaveBeenCalledWith({ type: SyncAction.NEXT_SLIDE, payload: { index: 1 } });

    fireEvent.click(prevBtn);
    // Note: click doesn't update prop currentIndex in test (unless rerendered), but internal state updates.
    // Initial index was 0. Next clicked -> index becomes 1. Prev clicked -> index becomes 0.
    expect(mockSendMessage).toHaveBeenCalledWith({ type: SyncAction.PREV_SLIDE, payload: { index: 0 } });
  });
});
