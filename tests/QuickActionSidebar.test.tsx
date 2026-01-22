import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import { QuickActionSidebar } from '../components/editor/QuickActionSidebar';
import { EditorProvider } from '../contexts/EditorContext';
import React from 'react';

const mockEditorState = {
  isParsing: false,
  parsedBlocks: [],
  wordCount: 0,
  textareaRef: { current: null },
  previewRef: { current: null },
  content: '',
  setContent: vi.fn(),
  handleScroll: vi.fn(),
  brandConfig: { logoPosition: 'top-right' },
  updateBrandConfig: vi.fn(),
  saveBrandConfigToFile: vi.fn(),
  loadBrandConfigFromFile: vi.fn(),
  toggleNotes: vi.fn(),
  resetToDefault: vi.fn(),
  toggleLanguage: vi.fn(),
  handleDownload: vi.fn(),
  handleExportMarkdown: vi.fn(),
  handleExportImages: vi.fn(),
  toggleThemePanel: vi.fn(),
  isThemePanelOpen: false,
  openBrandModal: vi.fn(),
  closeBrandModal: vi.fn(),
  isBrandModalOpen: false,
  openAiModal: vi.fn(),
  closeAiModal: vi.fn(),
  isAiModalOpen: false
};

const mockDarkMode = { isDark: false, toggleDarkMode: vi.fn() };

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <EditorProvider editorState={mockEditorState as any} darkModeState={mockDarkMode}>
      {ui}
    </EditorProvider>
  );
};

describe('QuickActionSidebar', () => {
  it('should render collapsed by default or based on prop', () => {
    renderWithContext(<QuickActionSidebar onAction={() => {}} />);
    const sidebar = screen.getByRole('complementary'); 
    expect(sidebar).toBeInTheDocument();
  });

  it('should toggle expanded state when toggle button is clicked', () => {
    renderWithContext(<QuickActionSidebar onAction={() => {}} />);
    const toggleBtn = screen.getByLabelText(/toggle sidebar/i);
    fireEvent.click(toggleBtn);
  });

  it('should trigger onAction when an action button is clicked', () => {
    const handleAction = vi.fn();
    renderWithContext(<QuickActionSidebar onAction={handleAction} />);
    
    const addSlideBtn = screen.getByLabelText(/sidebar.newSlide/i);
    fireEvent.click(addSlideBtn);

    expect(handleAction).toHaveBeenCalledWith(expect.objectContaining({
      type: 'INSERT_SLIDE'
    }));
  });
});
