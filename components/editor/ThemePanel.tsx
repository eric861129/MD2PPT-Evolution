/**
 * MD2PPT-Evolution
 * Design System Panel (Sidebar)
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import { X, Pipette, Palette, Hash, Copy, Check, Sparkles, LayoutTemplate } from 'lucide-react';
import { CURATED_PALETTES, DesignPalette } from '../../constants/palettes';

interface ColorPickerPanelProps {
  onClose: () => void;
  onInsertColor: (hex: string) => void;
  onApplyPalette?: (palette: DesignPalette) => void;
}

const PRESET_BLOCKS = [
  { group: '商務琥珀', colors: ['#EA580C', '#C2410C', '#FB923C', '#FFF7ED'] },
  { group: '專業藍系', colors: ['#0EA5E9', '#0369A1', '#7DD3FC', '#F0F9FF'] },
  { group: '清新綠系', colors: ['#10B981', '#047857', '#6EE7B7', '#F0FDF4'] },
  { group: '優雅紅系', colors: ['#F43F5E', '#BE123C', '#FDA4AF', '#FFF1F2'] },
  { group: '中性石墨', colors: ['#1C1917', '#44403C', '#A8A29E', '#FAFAF9'] },
  { group: '基礎色', colors: ['#FFFFFF', '#000000', '#E5E7EB', '#9CA3AF'] }
];

export const ThemePanel: React.FC<ColorPickerPanelProps> = ({ onClose, onInsertColor, onApplyPalette }) => {
  const [activeTab, setActiveTab] = useState<'design' | 'picker'>('design');
  const [customHex, setCustomHex] = useState('#EA580C');
  const [copySuccess, setCopySuccess] = useState(false);
  const [appliedPaletteId, setAppliedPaletteId] = useState<string | null>(null);

  // Calculate brightness to determine icon color (Black vs White)
  const getContrastColor = (hexColor: string) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180 ? 'text-stone-900' : 'text-white';
  };

  const iconColorClass = getContrastColor(customHex);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomHex(hex);
  };

  const insertCustom = () => {
    onInsertColor(customHex.toUpperCase());
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(customHex.toUpperCase());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy color", err);
    }
  };

  const handlePaletteClick = (palette: DesignPalette) => {
    if (onApplyPalette) {
      onApplyPalette(palette);
      setAppliedPaletteId(palette.id);
      setTimeout(() => setAppliedPaletteId(null), 1500);
    }
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-white dark:bg-[#1C1917] border-l border-[#E7E5E4] dark:border-[#44403C] shadow-[-20px_0_50px_rgba(0,0,0,0.15)] z-30 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex flex-col bg-stone-50/50 dark:bg-stone-900/50 border-b border-[#E7E5E4] dark:border-[#44403C]">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] text-stone-500">
            <LayoutTemplate size={14} className="text-[var(--product-primary)]" />
            Design System
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md text-stone-400 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex px-4 gap-4">
          <button 
            onClick={() => setActiveTab('design')}
            className={`pb-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'design' ? 'text-[var(--product-primary)] border-[var(--product-primary)]' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
          >
            Curated Palettes
          </button>
          <button 
            onClick={() => setActiveTab('picker')}
            className={`pb-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'picker' ? 'text-[var(--product-primary)] border-[var(--product-primary)]' : 'text-stone-400 border-transparent hover:text-stone-600'}`}
          >
            Color Picker
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-stone-800 dark:text-stone-300">
        
        {/* TAB 1: Design Palettes */}
        {activeTab === 'design' && (
          <div className="space-y-6">
            <div className="text-[10px] text-stone-400 leading-relaxed mb-4">
              點擊下列色盤，將自動套用至整份簡報的 <strong>Theme</strong> 與 <strong>Mesh Gradients</strong>。
            </div>

            {['Tech & Trust', 'Energy & Warmth', 'Nature & Health', 'Creative & Mystery', 'Minimal & Modern'].map((category) => {
              // Simple categorization logic based on manual index matching or keywords?
              // Let's just render all for now, or group them logically in code
              // To save tokens/time, I will just map CURATED_PALETTES directly.
              return null;
            })}

            {/* Render all palettes */}
            <div className="grid gap-3">
              {CURATED_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => handlePaletteClick(palette)}
                  className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left group
                    ${appliedPaletteId === palette.id 
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-500 ring-1 ring-green-500' 
                      : 'bg-white dark:bg-white/5 border-stone-200 dark:border-white/5 hover:border-orange-500/50 hover:shadow-md'
                    }`}
                >
                  {/* Mesh Preview Circle */}
                  <div className="w-10 h-10 rounded-full shrink-0 shadow-inner overflow-hidden relative">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${palette.meshColors[0]}, ${palette.meshColors[1]}, ${palette.meshColors[2]})` 
                      }} 
                    />
                    {appliedPaletteId === palette.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <Check size={16} className="text-white animate-in zoom-in" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-stone-700 dark:text-stone-200">{palette.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-stone-100 dark:bg-white/10 rounded-full text-stone-500">
                        {palette.label}
                      </span>
                    </div>
                    <div className="text-[9px] text-stone-400 truncate">
                      {palette.keywords.slice(0, 3).join(' · ')}
                    </div>
                  </div>
                  
                  {/* Hover Action */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--product-primary)]">
                    <Sparkles size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Color Picker (Existing Logic) */}
        {activeTab === 'picker' && (
          <>
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
                      className="w-full aspect-square rounded-lg border border-stone-200 dark:border-white/5 shadow-sm hover:scale-110 hover:ring-2 hover:ring-[var(--product-primary)]/50 transition-all active:scale-95 group relative"
                      style={{ backgroundColor: hex }}
                    >
                      <span className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <Hash size={10} className={`${getContrastColor(hex)} opacity-60`} />
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}

            <section className="pt-6 border-t border-stone-100 dark:border-white/5 space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <Palette size={12} /> 自定義配色圓盤
              </label>
              
              <div className="flex flex-col items-center gap-4 bg-stone-50 dark:bg-white/5 p-4 rounded-2xl border border-dashed border-stone-200 dark:border-white/10">
                <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-inner border-4 border-white dark:border-stone-800 group transition-transform hover:scale-105 active:scale-95">
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
                    
                    <button
                      onClick={handleCopyCode}
                      title="Copy Hex Code"
                      className="w-10 h-10 rounded-lg shadow-md border border-stone-200 dark:border-white/10 relative overflow-hidden group transition-all hover:scale-110 active:scale-90 ring-offset-2 focus:ring-2 focus:ring-[var(--product-primary)]"
                      style={{ backgroundColor: customHex }}
                    >
                      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copySuccess ? 'bg-green-500' : 'bg-black/0 group-hover:bg-black/10'}`}>
                        {copySuccess ? (
                          <Check size={18} className="text-white animate-in zoom-in duration-300" />
                        ) : (
                          <Copy 
                            size={16} 
                            className={`transition-all duration-200 ${iconColorClass} drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`} 
                          />
                        )}
                      </div>
                    </button>
                  </div>
                  
                  <button
                    onClick={insertCustom}
                    className="w-full py-2.5 bg-[var(--product-primary)] hover:bg-[var(--product-hover)] text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-lg shadow-[var(--product-glow)] active:translate-y-0.5 transition-all"
                  >
                    插入色碼
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};