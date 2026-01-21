/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings2, Download, Sun, Moon, RotateCcw, Languages, 
  FileText, StickyNote, Palette, Check, ChevronDown, Maximize, Presentation 
} from 'lucide-react';
import { useEditor } from '../../contexts/EditorContext';
import { usePresenterMode } from '../../hooks/usePresenterMode';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { PRESET_THEMES } from '../../constants/themes';
import { CURATED_PALETTES } from '../../constants/palettes';
import { updateGlobalTheme } from '../../services/markdownUpdater';

export const EditorHeader: React.FC = () => {
  const {
    content,
    setContent,
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
    resetCustomTheme,
    toggleThemePanel, 
    isThemePanelOpen,
    openBrandModal
  } = useEditor() as any;

  const { startPresentation } = usePresenterMode();

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [showThemeSaved, setShowThemeSaved] = useState(false);
  
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const sizeDropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeChange = (id: string) => {
    const palette = CURATED_PALETTES.find(p => p.id === id);
    if (palette) {
      // 1. Clear any manual color overrides to let the palette take full effect
      resetCustomTheme();

      // 2. Update Markdown Content (for YAML persistence)
      const newContent = updateGlobalTheme(content, palette.id, palette.meshColors);
      setContent(newContent);
      
      // 3. Set the active theme ID
      setActiveThemeId(palette.id);
    }
    
    setShowThemeSaved(true);
    setIsThemeDropdownOpen(false);
    setTimeout(() => setShowThemeSaved(false), 2000);
  };

  const handleSizeChange = (index: number) => {
    setSelectedSizeIndex(index);
    setIsSizeDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
        setIsSizeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoPath = `${import.meta.env.BASE_URL}logo.svg`;
  const hasContent = parsedBlocks.length > 0;
  const headerBg = isDark ? 'bg-[#141414]/90' : 'bg-[#1C1917]/95';
  const selectedSize = pageSizes[selectedSizeIndex];

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
      <div className="flex items-center gap-2 lg:gap-4 overflow-visible">
        
        {/* Brand Settings Toggle */}
        <IconButton 
          onClick={openBrandModal} 
          title="Brand Settings"
          onBrand
          className="bg-white/5 text-stone-400 hover:text-[#EA580C]"
        >
          <Settings2 size={18} />
        </IconButton>

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
        <div className="relative shrink-0" ref={themeDropdownRef}>
          <button
            onClick={() => { setIsThemeDropdownOpen(!isThemeDropdownOpen); setIsSizeDropdownOpen(false); }}
            className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-[#EA580C]/50 transition-all text-white min-w-[120px] lg:min-w-[180px]"
          >
            <div className="flex gap-1 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full transition-colors duration-500" style={{ backgroundColor: activeTheme.colors.primary.startsWith('#') ? activeTheme.colors.primary : `#${activeTheme.colors.primary}` }} />
              <div className="w-2.5 h-2.5 rounded-full hidden sm:block opacity-50" style={{ backgroundColor: activeTheme.colors.background.startsWith('#') ? activeTheme.colors.background : `#${activeTheme.colors.background}` }} />
            </div>
            <span className="text-[10px] lg:text-xs font-black uppercase tracking-wider flex-1 text-left truncate">
              {activeTheme.label}
            </span>
            <ChevronDown size={14} className={`transition-transform duration-300 shrink-0 ${isThemeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isThemeDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-72 lg:w-80 bg-[#1C1917] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pb-2 z-[60] animate-in zoom-in-95 fade-in duration-200 origin-top-right max-h-[80vh] overflow-y-auto custom-scrollbar">
              
              <div className="px-5 py-4 mb-1 border-b border-white/5 sticky top-0 bg-[#1C1917] z-50 flex items-center justify-between">
                <span className="text-[11px] font-black text-[#EA580C] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Palette size={14} /> Design Systems
                </span>
                <span className="text-[9px] text-stone-500 font-bold">12 Styles</span>
              </div>
              
              <div className="grid grid-cols-1 gap-1 p-2 relative z-0">
                {CURATED_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => handleThemeChange(palette.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-white/10 rounded-xl transition-all group text-left ${activeTheme.name === palette.id ? 'bg-white/5 ring-1 ring-[#EA580C]/30' : ''}`}
                  >
                     <div className="w-10 h-10 rounded-full shadow-lg relative overflow-hidden shrink-0 border-2 border-white/10 group-hover:scale-110 transition-transform">
                        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${palette.meshColors[0]}, ${palette.meshColors[1]}, ${palette.meshColors[2]})` }} />
                        {activeTheme.name === palette.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                            <Check size={18} className="text-white" />
                          </div>
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between mb-0.5">
                         <span className={`text-[13px] font-black tracking-tight ${activeTheme.name === palette.id ? 'text-[#EA580C]' : 'text-white'}`}>
                           {palette.label}
                         </span>
                         <span className="text-[9px] font-bold text-stone-500 uppercase opacity-60">{palette.name}</span>
                       </div>
                       <div className="text-[10px] text-stone-400 font-medium leading-tight line-clamp-1 group-hover:text-stone-300">
                         {palette.description}
                       </div>
                     </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showThemeSaved && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] text-green-400 font-bold animate-in fade-in slide-in-from-top-1">
              <Check size={10} />
            </div>
          )}
        </div>

        <div className="w-[1px] h-6 bg-white/10 mx-0.5 lg:mx-1 shrink-0" />

        {/* Custom Paper Size Dropdown */}
        <div className="relative shrink-0" ref={sizeDropdownRef}>
          <button
            onClick={() => { setIsSizeDropdownOpen(!isSizeDropdownOpen); setIsThemeDropdownOpen(false); }}
            className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-[#EA580C]/50 transition-all text-white min-w-[100px] lg:min-w-[150px]"
          >
            <Settings2 size={14} className="text-[#FB923C] shrink-0" />
            <span className="text-[10px] lg:text-xs font-black uppercase tracking-wider flex-1 text-left truncate">
              {t(`sizes.${selectedSize.name}`)}
            </span>
            <ChevronDown size={14} className={`transition-transform duration-300 shrink-0 ${isSizeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSizeDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-56 lg:w-60 bg-[#1C1917] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 z-[60] animate-in zoom-in-95 fade-in duration-200 origin-top-right">
              <div className="px-4 py-2 mb-1 border-b border-white/5">
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Page Layout</span>
              </div>
              {pageSizes.map((size: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleSizeChange(index)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group ${selectedSizeIndex === index ? 'text-[#EA580C]' : 'text-stone-300'}`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <Maximize size={14} className={selectedSizeIndex === index ? 'text-[#EA580C]' : 'text-stone-500'} />
                    <span className="text-sm font-bold">{t(`sizes.${size.name}`)}</span>
                  </div>
                  {selectedSizeIndex === index && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-[1px] h-6 bg-white/10 mx-0.5 lg:mx-1 shrink-0 hidden md:block" />

        {/* Controls Group */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md shrink-0">
          <IconButton onClick={resetToDefault} title={t('reset')} onBrand className="flex">
            <RotateCcw className="w-4 h-4" />
          </IconButton>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
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

        <Button
          onClick={handleExportMarkdown}
          disabled={!hasContent}
          variant="outline-white"
          className="h-10 px-3 lg:px-4 font-bold border-white/10 shrink-0 hidden sm:flex"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden lg:block">MD</span>
        </Button>

        <Button
          onClick={startPresentation}
          disabled={!hasContent}
          variant="outline-white"
          className="h-10 px-3 lg:px-4 font-bold border-white/10 shrink-0 flex hover:text-[#EA580C] hover:border-[#EA580C]/50"
          title="Start Presentation Mode"
        >
          <Presentation className="w-4 h-4" />
          <span className="hidden lg:block ml-2">Present</span>
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