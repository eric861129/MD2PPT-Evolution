import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Type } from 'lucide-react';
import { SlashMenu } from '../components/editor/SlashMenu';

describe('SlashMenu', () => {
  const mockCommands = [
    { id: 'h1', label: 'Heading 1', icon: Type, category: 'Basic', template: '# ' },
    { id: 'h2', label: 'Heading 2', icon: Type, category: 'Basic', template: '## ' },
  ];

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <SlashMenu 
        isOpen={false} 
        onSelect={vi.fn()} 
        onClose={vi.fn()}
        position={{ top: 0, left: 0 }}
        commands={mockCommands}
        selectedIndex={0}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <SlashMenu 
        isOpen={true} 
        onSelect={vi.fn()} 
        onClose={vi.fn()}
        position={{ top: 100, left: 100 }}
        commands={mockCommands}
        selectedIndex={0}
      />
    );
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
  });

  it('should call onSelect when a command is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <SlashMenu 
        isOpen={true} 
        onSelect={handleSelect} 
        onClose={vi.fn()}
        position={{ top: 100, left: 100 }}
        commands={mockCommands}
        selectedIndex={0}
      />
    );
    
    fireEvent.click(screen.getByText('Heading 1'));
    expect(handleSelect).toHaveBeenCalledWith(mockCommands[0]);
  });
});
