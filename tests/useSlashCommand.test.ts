import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSlashCommand } from '../hooks/useSlashCommand';

describe('useSlashCommand', () => {
  let textarea: HTMLTextAreaElement;
  let onInsert: any;

  beforeEach(() => {
    textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    onInsert = vi.fn();
    
    // Mock getBoundingClientRect for coordinates calc
    textarea.getBoundingClientRect = vi.fn(() => ({
      top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => {}
    }));
  });

  it('should trigger menu when / is typed at start', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1);
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should filter commands based on query', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1); // open
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      textarea.value = '/h';
      textarea.selectionStart = 2;
      result.current.handleInputChange('/h', 2); // query 'h'
    });

    expect(result.current.query).toBe('h');
    expect(result.current.filteredCommands.every(c => c.label.toLowerCase().includes('h') || c.category.toLowerCase().includes('h'))).toBe(true);
  });

  it('should select command and call onInsert', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1);
    });

    const command = result.current.filteredCommands[0];
    act(() => {
      result.current.selectCommand(command);
    });

    expect(onInsert).toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
  });

  it('should position cursor correctly at $cursor marker', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    // Select Heading 1 which has template '# $cursor'
    const h1Command = { id: 'h1', label: 'H1', icon: vi.fn(), category: 'B', template: '# $cursor' };
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1);
    });

    act(() => {
      result.current.selectCommand(h1Command as any);
    });

    // Mock the textarea behavior when onInsert is called by the parent
    textarea.value = '# ';
    
    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(textarea.selectionStart).toBe(2); // After '# '
    vi.useRealTimers();
  });

  it('should handle keyboard navigation', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1); // open
    });

    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown({ key: 'ArrowDown', preventDefault: vi.fn() } as any);
    });
    expect(result.current.selectedIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown({ key: 'ArrowUp', preventDefault: vi.fn() } as any);
    });
    expect(result.current.selectedIndex).toBe(0);

    act(() => {
      result.current.handleKeyDown({ key: 'Enter', preventDefault: vi.fn() } as any);
    });
    expect(onInsert).toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
  });

  it('should close menu on Escape', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1); // open
    });

    act(() => {
      result.current.handleKeyDown({ key: 'Escape', preventDefault: vi.fn() } as any);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should return empty list when no commands match', () => {
    const { result } = renderHook(() => useSlashCommand({ current: textarea } as any, onInsert));
    
    act(() => {
      textarea.value = '/';
      textarea.selectionStart = 1;
      result.current.handleInputChange('/', 1); // open
    });

    act(() => {
      textarea.value = '/xyznonexistent';
      textarea.selectionStart = 15;
      result.current.handleInputChange('/xyznonexistent', 15);
    });

    expect(result.current.filteredCommands.length).toBe(0);
  });
});
