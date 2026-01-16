/**
 * MD2PPT-Evolution
 * Color Picker Tool (Sidebar)
 * Copyright (c) 2026 EricHuang
 */

import React from 'react';
import { X, Pipette, Palette, Hash } from 'lucide-react';

interface ColorPickerPanelProps {
  onClose: () => void;
  onInsertColor: (hex: string) => void;
}

const PRESET_BLOCKS = [
  { group: '商務琥珀', colors: ['#EA580C', '#C2410C', '#FB923C', '#FFF7ED'] },
  { group: '專業藍系', colors: ['#0EA5E9', '#0369A1', '#7DD3FC', '#F0F9FF'] },
  { group: '清新綠系', colors: ['#10B981', '#047857', '#6EE7B7', '#F0FDF4'] },
  { group: '優雅紅系', colors: ['#F43F5E', '#BE123C', '#FDA4AF', '#FFF1F2'] },
  { group: '中性石墨', colors: ['#1C1917', '#44403C', '#A8A29E', '#FAFAF9'] },
  { group: '基礎色', colors: ['#FFFFFF', '#000000', '#E5E7EB', '#9CA3AF'] }
];

export const ThemePanel: React.FC<ColorPickerPanelProps> = ({ onClose, onInsertColor }) => {
  const [customHex, setCustomHex] = React.useState('#EA580C');

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomHex(hex);
  };

  const insertCustom = () => {
    onInsertColor(customHex.toUpperCase());
  };

  return (
    <div className="absolute top-14 left-14 bottom-0 w-72 bg-white dark:bg-[#1C1917] border-r border-[#E7E5E4] dark:border-[#44403C] shadow-2xl z-30 flex flex-col animate-in slide-in-from-left duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#E7E5E4] dark:border-[#44403C] bg-stone-50/50 dark:bg-stone-900/50">
        <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] text-stone-500">
          <Pipette size={14} className="text-[#EA580C]" />
          Color Picker Tool
        </div>
        <button onClick={onClose} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md text-stone-400">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-stone-800 dark:text-stone-300">
        {/* Preset Groups */}
        {PRESET_BLOCKS.map((group) => (
          <section key={group.group} className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              {group.group}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {group.colors.map((hex) => (
                <button
                  key={hex}
                  onClick={() => onInsertColor(hex)}
                  className="w-full aspect-square rounded-lg border border-stone-200 dark:border-white/5 shadow-sm hover:scale-110 hover:ring-2 hover:ring-orange-500/50 transition-all active:scale-95 group relative"
                  style={{ backgroundColor: hex }}
                >
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Hash size={10} className={hex === '#FFFFFF' ? 'text-stone-400' : 'text-white/50'} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Custom Wheel / Picker Area */}
        <section className="pt-6 border-t border-stone-100 dark:border-white/5 space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
            <Palette size={12} /> 自定義配色圓盤
          </label>
          
          <div className="flex flex-col items-center gap-4 bg-stone-50 dark:bg-white/5 p-4 rounded-2xl border border-dashed border-stone-200 dark:border-white/10">
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-inner border-4 border-white dark:border-stone-800 group">
              <input 
                type="color"
                value={customHex}
                onChange={handleCustomColorChange}
                className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer bg-transparent border-none p-0"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-gradient-to-tr from-black/10 to-transparent">
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-md shadow-black/20" />
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Hash size={12} className="text-stone-400" />
                  <input 
                    type="text" 
                    value={customHex.replace('#', '')}
                    onChange={(e) => setCustomHex(`#${e.target.value}`)}
                    className="w-full bg-transparent text-sm font-mono uppercase outline-none"
                    placeholder="FFFFFF"
                  />
                </div>
                <div 
                  className="w-10 h-10 rounded-lg shadow-sm border border-stone-200 dark:border-white/10" 
                  style={{ backgroundColor: customHex }} 
                />
              </div>
              
              <button
                onClick={insertCustom}
                className="w-full py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-lg shadow-orange-500/20 active:translate-y-0.5 transition-all"
              >
                插入色碼
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 bg-stone-50 dark:bg-stone-900/50 text-[9px] text-stone-400 font-medium leading-relaxed">
        提示：點擊色塊將自動插入 Hex 色碼至目前游標位置。
      </div>
    </div>
  );
};
