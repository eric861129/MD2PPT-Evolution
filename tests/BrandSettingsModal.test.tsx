import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrandSettingsModal } from '../components/editor/BrandSettingsModal';

describe('BrandSettingsModal', () => {
  const mockConfig = {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    font: '微軟正黑體',
    logoPosition: 'top-right' as const
  };

  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    config: mockConfig,
    onUpdate: vi.fn(),
    onExport: vi.fn(),
    onImport: vi.fn(),
  };

  it('should not render when isOpen is false', () => {
    const { container } = render(<BrandSettingsModal {...mockProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(<BrandSettingsModal {...mockProps} />);
    expect(screen.getByText(/品牌設定/i)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<BrandSettingsModal {...mockProps} />);
    const closeBtn = screen.getByLabelText(/close/i);
    fireEvent.click(closeBtn);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('should call onUpdate when a color is changed', () => {
    render(<BrandSettingsModal {...mockProps} />);
    // Since we'll have color inputs, we search for them
    const primaryInput = screen.getByLabelText(/主色/i);
    fireEvent.change(primaryInput, { target: { value: '#ff0000' } });
    expect(mockProps.onUpdate).toHaveBeenCalledWith({ primaryColor: '#ff0000' });
  });

  it('should call onUpdate when font is changed', () => {
    render(<BrandSettingsModal {...mockProps} />);
    const fontSelect = screen.getByLabelText(/標題字體/i);
    fireEvent.change(fontSelect, { target: { value: '標楷體' } });
    expect(mockProps.onUpdate).toHaveBeenCalledWith({ font: '標楷體' });
  });

  it('should call onUpdate when logo position is changed', () => {
    render(<BrandSettingsModal {...mockProps} />);
    const posSelect = screen.getByLabelText(/Logo 顯示位置/i);
    fireEvent.change(posSelect, { target: { value: 'bottom-left' } });
    expect(mockProps.onUpdate).toHaveBeenCalledWith({ logoPosition: 'bottom-left' });
  });
});
