import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PresenterConsole } from '../components/presenter/PresenterConsole';
import { BlockType } from '../services/types';

// Mock SlideContent to avoid complex rendering
vi.mock('../components/editor/PreviewPane', () => ({
  SlideContent: ({ slide }: any) => <div data-testid="slide-content">Slide {slide.index}</div>
}));

// Mock PresentationSyncService
vi.mock('../services/PresentationSyncService', () => ({
  PresentationSyncService: vi.fn().mockImplementation(() => ({
    sendMessage: vi.fn(),
    onMessage: vi.fn(),
    offMessage: vi.fn(),
    close: vi.fn()
  }))
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
});
