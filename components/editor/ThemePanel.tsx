/**
 * MD2PPT-Evolution
 * Theme & Color Management Panel
 * Copyright (c) 2026 EricHuang
 */

import React from 'react';
import { X, Type, Paintbrush, Pipette } from 'lucide-react';
import { PRESET_THEMES } from '../../constants/themes';
import { useEditor } from '../../contexts/EditorContext';

interface ThemePanelProps {
  onClose: () => void;
  onInsertColor: (hex: string) => void;
}

const COMMON_COLORS = [
  '#EA580C', '#C2410C', '#FB923C', '#FFF7ED', // Amber/Orange
  '#0EA5E9', '#0369A1', '#7DD3FC', '#F0F9FF', // Sky/Blue
  '#10B981', '#047857', '#6EE7B7', '#F0FDF4', // Emerald/Green
  '#F43F5E', '#BE123C', '#FDA4AF', '#FFF1F2', // Rose/Red
  '#1C1917', '#44403C', '#A8A29E', '#FAFAF9', // Stone/Gray
  '#FFFFFF', '#000000'
];

const FONTS = [
  { label: '微軟正黑體', value: 'Microsoft JhengHei' },
  { label: '標楷體', value: 'KaiTi' },
  { label: 'Segoe UI', value: 'Segoe UI' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Consolas', value: 'Consolas' }
];

export const ThemePanel: React.FC<ThemePanelProps> = ({ onClose, onInsertColor }) => {
  const { activeTheme, setActiveThemeId, updateCustomTheme } = useEditor();

  return (
    <div className="absolute top-14 left-14 bottom-0 w-80 bg-white dark:bg-[#1C1917] border-r border-[#E7E5E4] dark:border-[#44403C] shadow-2xl z-30 flex flex-col animate-in slide-in-from-left duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E7E5E4] dark:border-[#44403C]">
        <div className="flex items-center gap-2 font-bold text-stone-700 dark:text-stone-200">
          <Paintbrush size={18} className="text-[#EA580C]" />
          主題與配色
        </div>
        <button onClick={onClose} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md text-stone-400">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 text-stone-800 dark:text-stone-300">
        {/* Preset Selection */}
        <section className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
            預設主題風格
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(PRESET_THEMES).map((theme) => (
              <button
                key={theme.name}
                onClick={() => setActiveThemeId(theme.name)}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  activeTheme.name === theme.name 
                    ? 'border-[#EA580C] bg-[#FFF7ED] dark:bg-[#EA580C]/10' 
                    : 'border-transparent bg-stone-50 dark:bg-[#292524] hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span className="text-sm font-bold">{theme.label}</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${theme.colors.primary}` }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `#${theme.colors.background}` }} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Color Palette */}
        <section className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
            <Pipette size={14} /> 色號配色盤 (點擊插入)
          </label>
          <div className="grid grid-cols-6 gap-2">
            {COMMON_COLORS.map((hex) => (
              <button
                key={hex}
                onClick={() => onInsertColor(hex)}
                className="w-full aspect-square rounded-md border border-stone-200 dark:border-stone-700 shadow-sm hover:scale-110 transition-transform active:scale-95"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </section>

        {/* Global Settings */}
        <section className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400">
            全域樣式客製化
          </label>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Type size={16} /> 預設字體
            </div>
            <select 
              value={activeTheme.fonts.main}
              onChange={(e) => updateCustomTheme({ fonts: { ...activeTheme.fonts, main: e.target.value } })}
              className="w-full p-2 rounded-md bg-stone-50 dark:bg-[#292524] border border-stone-200 dark:border-stone-700 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            >
              {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Paintbrush size={16} /> 預設背景
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={activeTheme.colors.background}
                onChange={(e) => updateCustomTheme({ colors: { ...activeTheme.colors, background: e.target.value } })}
                className="flex-1 p-2 rounded-md bg-stone-50 dark:bg-[#292524] border border-stone-200 dark:border-stone-700 text-sm uppercase"
                placeholder="Hex color..."
              />
              <input 
                type="color"
                value={`#${activeTheme.colors.background.replace('#', '')}`}
                onChange={(e) => updateCustomTheme({ colors: { ...activeTheme.colors, background: e.target.value.replace('#', '') } })}
                className="w-10 h-9 rounded-md border-none p-0 bg-transparent cursor-pointer"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 bg-stone-50 dark:bg-[#292524] text-[10px] text-stone-400 italic">
        * 設定將即時應用並儲存至本機快取。
      </div>
    </div>
  );
};
