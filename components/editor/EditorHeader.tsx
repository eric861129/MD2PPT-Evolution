/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings2, Download, Sun, Moon, RotateCcw, Languages, 
  FileText, StickyNote, Palette, Check, ChevronDown 
} from 'lucide-react';
import { useEditor } from '../../contexts/EditorContext';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { PRESET_THEMES } from '../../constants/themes';

export const EditorHeader: React.FC = () => {
  const {
    pageSizes,
    selectedSizeIndex,
    setSelectedSizeIndex,
    handleDownload,
    handleExportMarkdown,
    resetToDefault,
    language,
    toggleLanguage,
    t,
    showNotes,
    toggleNotes,
    isGenerating,
    parsedBlocks,
    isDark,
    toggleDarkMode,
    activeTheme,
    setActiveThemeId,
    toggleThemePanel, 
    isThemePanelOpen
  } = useEditor() as any;

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [showThemeSaved, setShowThemeSaved] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (id: string) => {
    setActiveThemeId(id);
    setShowThemeSaved(true);
    setIsThemeDropdownOpen(false);
    setTimeout(() => setShowThemeSaved(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoPath = `${import.meta.env.BASE_URL}logo.svg`;
  const hasContent = parsedBlocks.length > 0;
  const headerBg = isDark ? 'bg-[#141414]/90' : 'bg-[#1C1917]/95';

  return (
    <header className={`${headerBg} backdrop-blur-xl px-4 lg:px-8 py-3 flex justify-between items-center z-40 shadow-2xl relative transition-all duration-500 border-b border-white/5`}>
      {/* Left: Brand */}
      <div className="flex items-center gap-3 lg:gap-5 shrink-0">
        <div className="bg-stone-900 p-1.5 rounded-lg shadow-inner ring-1 ring-white/10 hidden sm:block">
          <img 
            src={logoPath} 
            alt="Logo" 
            className="w-6 h-6 lg:w-7 lg:h-7" 
            style={{ filter: 'invert(48%) sepia(91%) saturate(1841%) hue-rotate(345deg) brightness(95%) contrast(92%)' }}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg lg:text-xl font-black text-white leading-none tracking-tight">
            MD2PPT <span className="text-[#FB923C] font-light ml-1">EVO</span>
          </h1>
          <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1.5 hidden xl:block">
            Warm Business Pro
          </p>
        </div>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-2 lg:gap-4 overflow-hidden">
        
        {/* Color Tool Toggle */}
        <IconButton 
          onClick={toggleThemePanel} 
          title="Color Picker Tool"
          onBrand
          className={`relative shrink-0 ${isThemePanelOpen ? 'bg-[#EA580C] text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'bg-white/5 text-stone-400 hover:text-[#EA580C]'}`}
        >
          <Palette size={18} />
          {isThemePanelOpen && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />}
        </IconButton>

        <div className="w-[1px] h-6 bg-white/10 mx-0.5 lg:mx-1 shrink-0" />

        {/* Custom Theme Dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-[#EA580C]/50 transition-all text-white min-w-[140px] lg:min-w-[180px]"
          >
            <div className="flex gap-1 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `#${activeTheme.colors.primary}` }} />
              <div className="w-2.5 h-2.5 rounded-full hidden sm:block" style={{ backgroundColor: `#${activeTheme.colors.background}` }} />
            </div>
            <span className="text-[10px] lg:text-xs font-black uppercase tracking-wider flex-1 text-left truncate">
              {activeTheme.label}
            </span>
            <ChevronDown size={14} className={`transition-transform duration-300 shrink-0 ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isThemeDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-60 lg:w-64 bg-[#1C1917] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 z-50 animate-in zoom-in-95 fade-in duration-200 origin-top-right">
              <div className="px-4 py-2 mb-1 border-b border-white/5">
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Select PPT Theme</span>
              </div>
              {Object.values(PRESET_THEMES).map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleThemeChange(theme.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group ${activeTheme.name === theme.name ? 'text-[#EA580C]' : 'text-stone-300'}`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex -space-x-1">
                      <div className="w-3.5 h-3.5 rounded-full border border-[#1C1917] z-10" style={{ backgroundColor: `#${theme.colors.primary}` }} />
                      <div className="w-3.5 h-3.5 rounded-full border border-[#1C1917] z-0" style={{ backgroundColor: `#${theme.colors.background}` }} />
                    </div>
                    <span className="text-sm font-bold">{theme.label}</span>
                  </div>
                  {activeTheme.name === theme.name && <Check size={14} />}
                </button>
              ))}
            </div>
          )}

          {showThemeSaved && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] text-green-400 font-bold animate-in fade-in slide-in-from-top-1">
              <Check size={10} />
            </div>
          )}
        </div>

        <div className="w-[1px] h-6 bg-white/10 mx-0.5 lg:mx-1 shrink-0 hidden md:block" />

        {/* Controls Group */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md shrink-0">
          <IconButton onClick={resetToDefault} title={t('reset')} onBrand className="hidden md:flex">
            <RotateCcw className="w-4 h-4" />
          </IconButton>
          <div className="w-[1px] h-4 bg-white/10 mx-1 hidden md:block" />
          <IconButton onClick={toggleLanguage} className="gap-2 px-2 lg:px-3 w-auto" onBrand>
            <Languages className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase">{language === 'zh' ? 'EN' : 'ZH'}</span>
          </IconButton>
          <IconButton onClick={toggleDarkMode} title={isDark ? t('theme.light') : t('theme.dark')} onBrand>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </IconButton>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <IconButton 
            onClick={toggleNotes} 
            title={showNotes ? t('hideNotes') : t('showNotes')} 
            onBrand
            className={showNotes ? 'bg-orange-500/20 text-[#FB923C]' : ''}
          >
            <StickyNote className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Paper Size Selector - Hidden on very small screens */}
        <div className="w-32 lg:w-40 hidden sm:block shrink-0">
          <select 
            value={selectedSizeIndex}
            onChange={(e) => setSelectedSizeIndex(Number(e.target.value))}
            className="w-full h-10 px-2 lg:px-3 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] lg:text-xs font-bold outline-none hover:border-[#EA580C]/50 transition-all appearance-none cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
          >
              {pageSizes.map((size, index) => (
                <option key={index} value={index} className="text-slate-900 bg-white">
                  {t(`sizes.${size.name}`)}
                </option>
              ))}
          </select>
        </div>

        <Button
          onClick={handleExportMarkdown}
          disabled={!hasContent}
          variant="outline-white"
          className="h-10 px-3 lg:px-4 font-bold border-white/10 shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden lg:block">MD</span>
        </Button>

        <Button
          onClick={handleDownload}
          disabled={!hasContent}
          isLoading={isGenerating}
          variant="brand"
          className="h-10 px-4 lg:px-8 shadow-[0_10px_30px_rgba(234,88,12,0.3)] border-none ring-1 ring-white/10 active:translate-y-0.5 transition-all shrink-0"
        >
          <Download className="w-5 h-5 stroke-[2.5px]" />
          <span className="font-black text-sm uppercase tracking-widest hidden md:block">
            {isGenerating ? t('exporting') : t('export')}
          </span>
        </Button>
      </div>
    </header>
  );
};