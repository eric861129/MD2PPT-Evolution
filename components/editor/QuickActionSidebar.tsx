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
  MessageSquare,
  List,
  Wrench
} from 'lucide-react';
import { useEditor } from '../../contexts/EditorContext';
import { transformToSOM, SlideObject } from '../../services/parser/som';
import { SlideRenderer } from '../common/SlideRenderer';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { DragHandle } from './DragHandle';

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
  onReorderSlides?: (from: number, to: number) => void;
}

const SortableOutlineItem: React.FC<{
  index: number;
  slide: SlideObject;
  activeTheme: any;
  onClick: () => void;
}> = ({ index, slide, activeTheme, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `outline-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="group relative px-3 py-1"
    >
      <DragHandle 
        id={`outline-${index}`} 
        className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/80 dark:bg-stone-800/80 scale-75" 
      />
      <button
        onClick={onClick}
        className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
      >
        <div className="w-6 h-6 shrink-0 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[10px] font-black text-stone-500">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="w-full aspect-video bg-black rounded border border-stone-200 dark:border-stone-700 overflow-hidden mb-1">
            <div className="pointer-events-none scale-[0.1] origin-top-left" style={{ width: '1200px', height: '675px' }}>
              <SlideRenderer slide={slide} theme={activeTheme} />
            </div>
          </div>
          <div className="text-[10px] font-medium text-stone-500 truncate uppercase tracking-tighter">
            {slide.config?.layout || 'Default'}
          </div>
        </div>
      </button>
    </div>
  );
};

export const QuickActionSidebar: React.FC<QuickActionSidebarProps> = ({ onAction, onReorderSlides }) => {
  const { t } = useTranslation();
  const { parsedBlocks, activeTheme, previewRef } = useEditor();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'outline'>('tools');
  const [activeId, setActiveId] = useState<string | null>(null);

  const slides = transformToSOM(parsedBlocks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id && onReorderSlides) {
      onReorderSlides(parseInt((active.id as string).split('-')[1], 10), parseInt((over.id as string).split('-')[1], 10));
    }
  };

  const scrollToSlide = (index: number) => {
    if (previewRef?.current) {
      const slideElements = previewRef.current.querySelectorAll('[data-slide-capture]');
      if (slideElements[index]) {
        slideElements[index].scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const activeSlideIndex = activeId ? parseInt(activeId.split('-')[1], 10) : -1;
  const activeSlide = activeSlideIndex >= 0 ? slides[activeSlideIndex] : null;

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
      <div className={`flex items-center border-b border-[#E7E5E4] dark:border-[#44403C] h-14 ${isExpanded ? 'px-3 justify-between' : 'justify-center'}`}>
        {isExpanded && (
          <div className="flex bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('tools')}
              className={`p-1.5 rounded-md transition-all ${activeTab === 'tools' ? 'bg-white dark:bg-stone-700 shadow-sm text-orange-600' : 'text-stone-400'}`}
              title="工具"
            >
              <Wrench size={16} />
            </button>
            <button 
              onClick={() => setActiveTab('outline')}
              className={`p-1.5 rounded-md transition-all ${activeTab === 'outline' ? 'bg-white dark:bg-stone-700 shadow-sm text-orange-600' : 'text-stone-400'}`}
              title="大綱"
            >
              <List size={16} />
            </button>
          </div>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle Sidebar"
          className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
        >
          {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {activeTab === 'tools' || !isExpanded ? (
          /* Tools View */
          ACTION_GROUPS.map((group, idx) => (
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
          ))
        ) : (
          /* Outline View */
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd} 
            onDragCancel={() => setActiveId(null)}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={slides.map((_, i) => `outline-${i}`)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1">
                {slides.map((slide, index) => (
                  <SortableOutlineItem 
                    key={index} 
                    index={index} 
                    slide={slide} 
                    activeTheme={activeTheme} 
                    onClick={() => scrollToSlide(index)} 
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeSlide ? (
                <div className="w-48 aspect-video bg-black rounded-lg overflow-hidden border-2 border-orange-500 shadow-2xl opacity-90 rotate-2 cursor-grabbing">
                  <div className="pointer-events-none w-full h-full overflow-hidden relative">
                    <div className="scale-[0.16] origin-top-left" style={{ width: '1200px', height: '675px' }}>
                      <SlideRenderer slide={activeSlide} theme={activeTheme} />
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
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