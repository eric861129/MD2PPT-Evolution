import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ImageTweaker } from '../components/tweaker/ImageTweaker';
import { VisualTweakerProvider, useVisualTweaker } from '../contexts/VisualTweakerContext';
import { BlockType } from '../services/types';
import React from 'react';

describe('ImageTweaker', () => {
  it('should parse image markdown correctly and update on apply', () => {
    const onUpdateContent = vi.fn();
    const mockMarkdown = '![Old Alt](https://old.url)';
    
    const TestWrapper = () => {
      const { openTweaker } = useVisualTweaker();
      React.useEffect(() => {
        const mockElement = document.createElement('div');
        openTweaker(mockElement, BlockType.IMAGE, 1);
      }, [openTweaker]);
      
      return <ImageTweaker />;
    };

    render(
      <VisualTweakerProvider onUpdateContent={onUpdateContent} onGetLineContent={() => mockMarkdown}>
        <TestWrapper />
      </VisualTweakerProvider>
    );

    const urlInput = screen.getByLabelText(/Image URL/i) as HTMLInputElement;
    const altInput = screen.getByLabelText(/Alt Text/i) as HTMLInputElement;
    
    expect(urlInput.value).toBe('https://old.url');
    expect(altInput.value).toBe('Old Alt');

    fireEvent.change(urlInput, { target: { value: 'https://new.url' } });
    fireEvent.change(altInput, { target: { value: 'New Alt' } });
    
    fireEvent.click(screen.getByText(/Apply Changes/i));

    expect(onUpdateContent).toHaveBeenCalledWith(1, '![New Alt](https://new.url)', undefined);
  });
});
