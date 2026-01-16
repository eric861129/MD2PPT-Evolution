/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

export const QuickActionSidebar: React.FC<QuickActionSidebarProps> = ({ onAction }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const ACTION_GROUPS = [
    {
      label: t('sidebar.structure'),
      items: [
        { type: 'INSERT_SLIDE', icon: Plus, label: t('sidebar.newSlide'), tooltip: t('sidebar.newSlide') },
      ]
    },
    {
      label: t('sidebar.layouts'),
      items: [
        { type: 'LAYOUT_GRID', icon: LayoutGrid, label: t('sidebar.grid'), tooltip: t('sidebar.grid') },
        { type: 'LAYOUT_TWO_COLUMN', icon: Columns, label: t('sidebar.twoCol'), tooltip: t('sidebar.twoCol') },
        { type: 'LAYOUT_CENTER', icon: AlignCenter, label: t('sidebar.center'), tooltip: t('sidebar.center') },
        { type: 'LAYOUT_QUOTE', icon: Quote, label: t('sidebar.quote'), tooltip: t('sidebar.quote') },
        { type: 'LAYOUT_ALERT', icon: AlertTriangle, label: t('sidebar.alert'), tooltip: t('sidebar.alert') },
      ]
    },
    {
      label: t('sidebar.components'),
      items: [
        { type: 'INSERT_TABLE', icon: Table, label: t('sidebar.table'), tooltip: t('sidebar.table') },
        { type: 'INSERT_CHAT', icon: MessageSquare, label: t('sidebar.chat'), tooltip: t('sidebar.chat') },
        { type: 'INSERT_CHART_BAR', icon: BarChart, label: t('sidebar.bar'), tooltip: t('sidebar.bar') },
        { type: 'INSERT_CHART_LINE', icon: LineChart, label: t('sidebar.line'), tooltip: t('sidebar.line') },
        { type: 'INSERT_CHART_PIE', icon: PieChart, label: t('sidebar.pie'), tooltip: t('sidebar.pie') },
        { type: 'INSERT_CHART_AREA', icon: AreaChart, label: t('sidebar.area'), tooltip: t('sidebar.area') },
        { type: 'INSERT_IMAGE', icon: Image, label: t('sidebar.image'), tooltip: t('sidebar.image') },
        { type: 'INSERT_NOTE', icon: StickyNote, label: t('sidebar.note'), tooltip: t('sidebar.note') },
      ]
    },
    {
      label: t('sidebar.formatting'),
      items: [
        { type: 'FORMAT_BOLD', icon: Bold, label: t('sidebar.bold'), tooltip: t('sidebar.bold') },
        { type: 'FORMAT_ITALIC', icon: Italic, label: t('sidebar.italic'), tooltip: t('sidebar.italic') },
        { type: 'FORMAT_CODE', icon: Code, label: t('sidebar.code'), tooltip: t('sidebar.code') },
      ]
    }
  ];

  return (
    <div 
      role="complementary"
      className={`
        flex flex-col border-r border-[#E7E5E4] dark:border-[#44403C] bg-white dark:bg-[#1C1917] transition-all duration-300 ease-in-out z-20
        ${isExpanded ? 'w-64' : 'w-14'}
      `}
    >
      {/* Header / Toggle */}
      <div className={`flex items-center border-b border-[#E7E5E4] dark:border-[#44403C] h-14 ${isExpanded ? 'justify-between p-3' : 'justify-center'}`}>
        {isExpanded && (
          <span className="font-bold text-sm uppercase tracking-wider text-stone-500">{t('sidebar.title')}</span>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle Sidebar"
          className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Actions List */}
      <div className="flex-1 overflow-y-auto py-2">
        {ACTION_GROUPS.map((group, idx) => (
          <div key={idx} className="mb-4">
            {isExpanded && (
              <div className="px-4 py-2 text-xs font-semibold text-stone-400 uppercase tracking-widest whitespace-nowrap">
                {group.label}
              </div>
            )}
            <div className="flex flex-col gap-1 px-2">
              {group.items.map((item) => (
                <button
                  key={item.type}
                  onClick={() => onAction({ type: item.type as ActionType })}
                  aria-label={item.label}
                  title={item.tooltip}
                  className={`
                    flex items-center p-2 rounded-md transition-all
                    hover:bg-[#FFF7ED] dark:hover:bg-[#44403C] hover:text-[#EA580C]
                    text-stone-600 dark:text-stone-400
                    ${isExpanded ? 'justify-start px-3' : 'justify-center'}
                  `}
                >
                  <item.icon size={20} strokeWidth={2} className="shrink-0" />
                  {isExpanded && (
                    <span className="ml-3 text-sm font-medium truncate">{item.label}</span>
                  )}
                </button>
              ))}
            </div>
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
          {isExpanded && <span className="ml-3 text-sm font-medium">{t('sidebar.settings')}</span>}
        </button>
      </div>
    </div>
  );
};