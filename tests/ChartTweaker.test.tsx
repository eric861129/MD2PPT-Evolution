import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChartTweaker } from '../components/tweaker/ChartTweaker';
import { VisualTweakerProvider, useVisualTweaker } from '../contexts/VisualTweakerContext';
import { BlockType } from '../services/types';
import React from 'react';

describe('ChartTweaker', () => {
  it('should parse chart markdown and update on apply', () => {
    const onUpdateContent = vi.fn();
    const mockMarkdown = `::: chart-bar {"title": "Test"}
| Year | Value |
| 2021 | 100 |
:::`;
    
    const TestWrapper = () => {
      const { openTweaker } = useVisualTweaker();
      React.useEffect(() => {
        const mockElement = document.createElement('div');
        openTweaker(mockElement, BlockType.CHART, 1);
      }, [openTweaker]);
      
      return <ChartTweaker />;
    };

    render(
      <VisualTweakerProvider onUpdateContent={onUpdateContent} onGetLineContent={() => mockMarkdown}>
        <TestWrapper />
      </VisualTweakerProvider>
    );

    const typeSelect = screen.getByRole('combobox') as HTMLSelectElement;
    const configInput = screen.getByDisplayValue(/{"title": "Test"}/i) as HTMLInputElement;
    const tableArea = screen.getByDisplayValue(/Year | Value/i) as HTMLTextAreaElement;
    
    expect(typeSelect.value).toBe('bar');
    
    fireEvent.change(typeSelect, { target: { value: 'line' } });
    fireEvent.change(tableArea, { target: { value: '| Year | Value |\n| 2021 | 500 |' } });
    
    fireEvent.click(screen.getByText(/Apply Data Changes/i));

    expect(onUpdateContent).toHaveBeenCalledWith(1, expect.stringContaining('::: chart-line {"title": "Test"}'));
    expect(onUpdateContent).toHaveBeenCalledWith(1, expect.stringContaining('| 2021 | 500 |'));
  });
});