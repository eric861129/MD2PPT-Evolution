/**
 * MD2PPT-Evolution
 * Slash Command Hook
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { useState, useCallback, useRef } from 'react';
import { 
  Heading1, Heading2, List, ListOrdered, 
  LayoutGrid, Layout, Quote, AlertCircle,
  BarChart, LineChart, PieChart, Activity,
  Table, Image as ImageIcon, MessageSquare, StickyNote,
  AlignCenter, Plus, Sparkles
} from 'lucide-react';
import { Command } from '../components/editor/SlashMenu';
import { ACTION_TEMPLATES } from '../constants/templates';
import { getCaretCoordinates } from '../utils/caretPosition';

const ALL_COMMANDS: Command[] = [
  // Structure
  { id: 'new-slide', label: 'New Slide', icon: Plus, category: 'Structure', template: ACTION_TEMPLATES.INSERT_SLIDE },
  { id: 'bg-mesh', label: 'Mesh Background', icon: Sparkles, category: 'Structure', template: ACTION_TEMPLATES.INSERT_BG_MESH },

  // Basic
  { id: 'h1', label: 'Heading 1', icon: Heading1, category: 'Basic', template: '# $cursor' },
  { id: 'h2', label: 'Heading 2', icon: Heading2, category: 'Basic', template: '## $cursor' },
  { id: 'ul', label: 'Bullet List', icon: List, category: 'Basic', template: '- $cursor' },
  { id: 'ol', label: 'Numbered List', icon: ListOrdered, category: 'Basic', template: '1. $cursor' },
  
  // Layouts
  { id: 'grid', label: 'Grid Layout', icon: LayoutGrid, category: 'Layout', template: ACTION_TEMPLATES.LAYOUT_GRID },
  { id: 'twocol', label: 'Two Columns', icon: Layout, category: 'Layout', template: ACTION_TEMPLATES.LAYOUT_TWO_COLUMN },
  { id: 'center', label: 'Center Layout', icon: AlignCenter, category: 'Layout', template: ACTION_TEMPLATES.LAYOUT_CENTER },
  { id: 'quote_layout', label: 'Quote Layout', icon: Quote, category: 'Layout', template: ACTION_TEMPLATES.LAYOUT_QUOTE },
  { id: 'alert', label: 'Alert Layout', icon: AlertCircle, category: 'Layout', template: ACTION_TEMPLATES.LAYOUT_ALERT },
  
  // Components
  { id: 'table', label: 'Table', icon: Table, category: 'Component', template: ACTION_TEMPLATES.INSERT_TABLE },
  { id: 'image', label: 'Image', icon: ImageIcon, category: 'Component', template: ACTION_TEMPLATES.INSERT_IMAGE },
  { id: 'note', label: 'Speaker Note', icon: StickyNote, category: 'Component', template: ACTION_TEMPLATES.INSERT_NOTE },
  { id: 'chat', label: 'Chat Dialog', icon: MessageSquare, category: 'Component', template: ACTION_TEMPLATES.INSERT_CHAT },
  
  // Charts
  { id: 'chart-bar', label: 'Bar Chart', icon: BarChart, category: 'Chart', template: ACTION_TEMPLATES.INSERT_CHART_BAR },
  { id: 'chart-line', label: 'Line Chart', icon: LineChart, category: 'Chart', template: ACTION_TEMPLATES.INSERT_CHART_LINE },
  { id: 'chart-pie', label: 'Pie Chart', icon: PieChart, category: 'Chart', template: ACTION_TEMPLATES.INSERT_CHART_PIE },
  { id: 'chart-area', label: 'Area Chart', icon: Activity, category: 'Chart', template: ACTION_TEMPLATES.INSERT_CHART_AREA },
];

export const useSlashCommand = (
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  onInsert: (content: string) => void
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'bottom' as 'top' | 'bottom' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const triggerIndexRef = useRef<number>(-1);

  const filteredCommands = ALL_COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const openMenu = useCallback(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const coords = getCaretCoordinates(textarea, textarea.selectionStart);
    
    // Auto-flip logic
    const MENU_HEIGHT = 320;
    const spaceBelow = window.innerHeight - coords.top - coords.lineHeight;
    const placement = spaceBelow < MENU_HEIGHT ? 'top' : 'bottom';

    // Position menu
    setPosition({ 
      top: placement === 'bottom' 
        ? coords.top + coords.lineHeight + 5 
        : coords.top - 5, // Will need to transform -100% in CSS if top
      left: Math.min(coords.left, window.innerWidth - 300), // Basic edge safety
      placement
    });
    
    triggerIndexRef.current = textarea.selectionStart - 1;
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, [textareaRef]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    triggerIndexRef.current = -1;
  }, []);

  const selectCommand = useCallback((command: Command) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const content = textarea.value;
    const start = triggerIndexRef.current;
    const end = textarea.selectionStart;

    // Prepare template (remove $cursor marker for content)
    const templateWithCursor = command.template;
    const templateToInsert = templateWithCursor.replace('$cursor', '');
    
    const newContent = content.substring(0, start) + templateToInsert + content.substring(end);
    onInsert(newContent);

    // Calculate final cursor position
    const cursorOffset = templateWithCursor.indexOf('$cursor');
    const finalCursorPos = start + (cursorOffset !== -1 ? cursorOffset : templateToInsert.length);
    
    // Focus back and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(finalCursorPos, finalCursorPos);
    }, 10);

    closeMenu();
  }, [textareaRef, onInsert, closeMenu]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        selectCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
    } else if (e.key === 'Tab') {
      // Allow tab to select first item if menu is open
      if (isOpen && filteredCommands.length > 0) {
        e.preventDefault();
        selectCommand(filteredCommands[selectedIndex]);
      }
    }
  };

  const handleInputChange = (value: string, selectionStart: number) => {
    if (!isOpen) {
      const lastChar = value[selectionStart - 1];
      if (lastChar === '/') {
        const before = value[selectionStart - 2];
        // Trigger if start of content, after newline, or after space
        if (!before || before === ' ' || before === '\n') {
          openMenu();
        }
      }
    } else {
      const currentQuery = value.substring(triggerIndexRef.current + 1, selectionStart);
      // Close if space typed or if trigger char deleted
      if (currentQuery.includes(' ') || selectionStart <= triggerIndexRef.current) {
        closeMenu();
      } else {
        setQuery(currentQuery);
        // Reset selection index when query changes
        setSelectedIndex(0);
      }
    }
  };

  return {
    isOpen,
    position,
    query,
    selectedIndex,
    filteredCommands,
    handleKeyDown,
    handleInputChange,
    selectCommand,
    closeMenu
  };
};
