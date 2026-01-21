import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AudienceView } from '../components/presenter/AudienceView';
import { ParsedBlock, BlockType } from '../services/types';

// Mock dependencies
vi.mock('../components/editor/PreviewPane', () => ({
  SlideContent: ({ slide }: any) => <div data-testid="slide-content">Slide {slide.index} Content</div>
}));

// Mock PresentationSyncService to avoid side effects during render
vi.mock('../services/PresentationSyncService', () => ({
  PresentationSyncService: vi.fn().mockImplementation(() => ({
    onMessage: vi.fn(),
    offMessage: vi.fn(),
    close: vi.fn()
  }))
}));

const mockSlides: any[] = [
  { index: 0, blocks: [{ type: BlockType.HEADING_1, content: 'Slide 1' }] },
  { index: 1, blocks: [{ type: BlockType.HEADING_1, content: 'Slide 2' }] }
];

describe('AudienceView', () => {
  it('renders "Waiting for presenter..." when no content is available', () => {
    render(<AudienceView slides={[]} currentIndex={0} />);
    expect(screen.getByText(/Waiting for presenter/i)).toBeInTheDocument();
  });

  it('renders the specific slide based on currentIndex', () => {
    // Note: We need to mock how AudienceView renders the slide. 
    // If it reuses SlideContent from PreviewPane, we check for that.
    // For this test, we assume it passes data to a renderer.
    
    // Actually, AudienceView in a real scenario might need to *receive* the content 
    // via BroadcastChannel if it's a separate window opened empty.
    // But typically in SPA, we might share state if opened via route, OR receive it.
    // The spec says: "利用 window.open() 開啟一個新的「觀眾視圖」分頁".
    // If it's a new window in a static site, it MUST be a new instance of the App.
    // It won't share memory. It must receive content via localStorage or BroadcastChannel.
    
    // For this "Basic Route" task, let's assume we pass slides as props for now (testing the component),
    // or we simulate the data being present.
    
    // Let's refine the test to just check if it renders the slide provided in props.
    // The synchronization logic is a separate concern/integration.
    
    render(<AudienceView slides={mockSlides} currentIndex={1} />);
    // We expect it to render the 2nd slide (index 1)
    // Using the mocked SlideContent output
    expect(screen.getByText('Slide 1 Content')).toBeInTheDocument(); 
    // Wait, my mock above says "Slide {slide.index} Content". 
    // The SlideContent component usually takes `slide` object. 
    // Let's adjust the expectation based on the mock implementation I wrote above.
    // But `slide` object structure depends on how `splitBlocksToSlides` works.
    // Let's rely on text content search if we can.
  });
});
