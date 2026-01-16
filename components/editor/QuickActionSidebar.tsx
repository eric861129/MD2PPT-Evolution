/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import {
  Plus,
  LayoutGrid,
  Quote,
  AlertTriangle,
  Table,
  Image,
  Bold,
  Italic,
  Code,
  StickyNote,
  ChevronRight,
  ChevronLeft,
  Settings2,
  BarChart,
  PieChart,
  LineChart,
  AreaChart,
  Columns,
  AlignCenter,
  MessageSquare
} from 'lucide-react';

export type ActionType = 
  | 'INSERT_SLIDE'
  | 'LAYOUT_GRID'
  | 'LAYOUT_TWO_COLUMN'
  | 'LAYOUT_CENTER'
  | 'LAYOUT_QUOTE'
  | 'LAYOUT_ALERT'
  | 'INSERT_TABLE'
  | 'INSERT_CHAT'
  | 'INSERT_IMAGE'
  | 'INSERT_NOTE'
  | 'INSERT_CHART_BAR'
  | 'INSERT_CHART_LINE'
  | 'INSERT_CHART_PIE'
  | 'INSERT_CHART_AREA'
  | 'FORMAT_BOLD'
  | 'FORMAT_ITALIC'
  | 'FORMAT_CODE';

interface QuickActionSidebarProps {
  onAction: (action: { type: ActionType }) => void;
}

interface ActionGroup {
  label: string;
  items: {
    type: ActionType;
    icon: React.ElementType;
    label: string;
    tooltip: string;
  }[];
}

const ACTION_GROUPS: ActionGroup[] = [
  {
    label: 'Structure',
    items: [
      { type: 'INSERT_SLIDE', icon: Plus, label: 'New Slide', tooltip: 'Insert new slide (===)' },
    ]
  },
  {
    label: 'Layouts',
    items: [
      { type: 'LAYOUT_GRID', icon: LayoutGrid, label: 'Grid', tooltip: 'Grid Layout' },
      { type: 'LAYOUT_TWO_COLUMN', icon: Columns, label: '2-Col', tooltip: 'Two Columns' },
      { type: 'LAYOUT_CENTER', icon: AlignCenter, label: 'Center', tooltip: 'Center Layout' },
      { type: 'LAYOUT_QUOTE', icon: Quote, label: 'Quote', tooltip: 'Quote Layout' },
      { type: 'LAYOUT_ALERT', icon: AlertTriangle, label: 'Alert', tooltip: 'Alert Layout' },
    ]
  },
  {
    label: 'Components',
    items: [
      { type: 'INSERT_TABLE', icon: Table, label: 'Table', tooltip: 'Table' },
      { type: 'INSERT_CHAT', icon: MessageSquare, label: 'Chat', tooltip: 'Dialogue' },
      { type: 'INSERT_CHART_BAR', icon: BarChart, label: 'Bar', tooltip: 'Bar Chart' },
      { type: 'INSERT_CHART_LINE', icon: LineChart, label: 'Line', tooltip: 'Line Chart' },
      { type: 'INSERT_CHART_PIE', icon: PieChart, label: 'Pie', tooltip: 'Pie Chart' },
      { type: 'INSERT_CHART_AREA', icon: AreaChart, label: 'Area', tooltip: 'Area Chart' },
      { type: 'INSERT_IMAGE', icon: Image, label: 'Image', tooltip: 'Insert Image' },
      { type: 'INSERT_NOTE', icon: StickyNote, label: 'Note', tooltip: 'Speaker Note' },
    ]
  },
  {
    label: 'Formatting',

    items: [
      { type: 'FORMAT_BOLD', icon: Bold, label: 'Bold', tooltip: 'Bold Text' },
      { type: 'FORMAT_ITALIC', icon: Italic, label: 'Italic', tooltip: 'Italic Text' },
      { type: 'FORMAT_CODE', icon: Code, label: 'Code', tooltip: 'Inline Code' },
    ]
  }
];

export const QuickActionSidebar: React.FC<QuickActionSidebarProps> = ({ onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      role="complementary"
      className={`
        flex flex-col border-r border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#1C1917] transition-all duration-300 ease-in-out z-20
        ${isExpanded ? 'w-64' : 'w-14'}
      `}
    >
      {/* Header / Toggle */}
      <div className="flex items-center justify-between p-3 border-b border-[#E7E5E4] dark:border-[#44403C] h-14">
        {isExpanded && (
          <span className="font-bold text-sm uppercase tracking-wider text-stone-500">Quick Actions</span>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle Sidebar"
          className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors mx-auto"
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Actions List */}
      <div className="flex-1 overflow-y-auto py-2">
        {ACTION_GROUPS.map((group, idx) => (
          <div key={idx} className="mb-4">
            {isExpanded && (
              <div className="px-4 py-2 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                {group.label}
              </div>
            )}
            <div className="flex flex-col gap-1 px-2">
              {group.items.map((item) => (
                <button
                  key={item.type}
                  onClick={() => onAction({ type: item.type })}
                  aria-label={item.label}
                  title={item.tooltip}
                  className={`
                    flex items-center p-2 rounded-md transition-all
                    hover:bg-[#FFF7ED] dark:hover:bg-[#44403C] hover:text-[#EA580C]
                    text-stone-600 dark:text-stone-400
                    ${isExpanded ? 'justify-start px-3' : 'justify-center'}
                  `}
                >
                  <item.icon size={20} strokeWidth={2} />
                  {isExpanded && (
                    <span className="ml-3 text-sm font-medium">{item.label}</span>
                  )}
                </button>
              ))}
            </div>
            {/* Divider if collapsed and not last */}
            {!isExpanded && idx < ACTION_GROUPS.length - 1 && (
              <div className="my-2 mx-3 border-b border-stone-200 dark:border-stone-800" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#E7E5E4] dark:border-[#44403C]">
        <button
          className={`
            flex items-center w-full p-2 rounded-md transition-all
            hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500
            ${isExpanded ? 'justify-start px-3' : 'justify-center'}
          `}
        >
          <Settings2 size={20} />
          {isExpanded && <span className="ml-3 text-sm font-medium">Settings</span>}
        </button>
      </div>
    </div>
  );
};
