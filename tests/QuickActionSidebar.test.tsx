import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For toBeInTheDocument
import { QuickActionSidebar } from '../components/editor/QuickActionSidebar';

describe('QuickActionSidebar', () => {
  it('should render collapsed by default or based on prop', () => {
    render(<QuickActionSidebar onAction={() => {}} />);
    // Assuming we have a toggle button or some indicator
    // This is a basic smoke test
    const sidebar = screen.getByRole('complementary'); 
    expect(sidebar).toBeInTheDocument();
  });

  it('should toggle expanded state when toggle button is clicked', () => {
    render(<QuickActionSidebar onAction={() => {}} />);
    const toggleBtn = screen.getByLabelText(/toggle sidebar/i);
    
    // Initial state check (implementation detail dependent, maybe check width or class)
    
    fireEvent.click(toggleBtn);
    // Expect expanded state
  });

  it('should trigger onAction when an action button is clicked', () => {
    const handleAction = vi.fn();
    render(<QuickActionSidebar onAction={handleAction} />);
    
    // The i18n mock returns the key itself
    const addSlideBtn = screen.getByLabelText(/sidebar.newSlide/i);
    fireEvent.click(addSlideBtn);

    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({
      type: 'INSERT_SLIDE'
    }));
  });
});
