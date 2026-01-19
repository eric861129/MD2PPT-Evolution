/**
 * MD2PPT-Evolution
 * Slash Command Menu (Floating Popover)
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useEffect, useRef } from 'react';

export interface Command {
  id: string;
  label: string;
  icon: React.ElementType;
  category: string;
  template: string;
}

interface SlashMenuProps {
  isOpen: boolean;
  onSelect: (command: Command) => void;
  onClose: () => void;
  position: { top: number; left: number };
  commands: Command[];
  selectedIndex: number;
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
  isOpen,
  onSelect,
  onClose,
  position,
  commands,
  selectedIndex
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const activeItem = menuRef.current.children[0]?.children[selectedIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-64 max-h-80 overflow-y-auto bg-white dark:bg-[#1C1917] border border-stone-200 dark:border-[#44403C] rounded-xl shadow-2xl animate-in fade-in zoom-in duration-150"
      style={{ top: position.top, left: position.left }}
      role="listbox"
    >
      <div className="p-2">
        {commands.length === 0 ? (
          <div className="p-4 text-center text-stone-400 text-xs font-medium italic">
            No matching commands
          </div>
        ) : (
          commands.map((command, index) => (
            <button
              key={command.id}
              onClick={() => onSelect(command)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs rounded-lg transition-all ${
                index === selectedIndex
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20 shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5'
              }`}
            >
              <div className={`p-1.5 rounded-md ${
                index === selectedIndex ? 'bg-orange-500 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
              }`}>
                <command.icon size={14} />
              </div>
              <div className="flex-1 text-left font-semibold tracking-tight">{command.label}</div>
              <div className="text-[9px] text-stone-400 font-black uppercase tracking-widest opacity-40">{command.category}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
