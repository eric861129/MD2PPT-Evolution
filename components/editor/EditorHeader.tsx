/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React from 'react';
import { Settings2, Download, Sun, Moon, RotateCcw, Languages, FileText, StickyNote } from 'lucide-react';
import { useEditor } from '../../contexts/EditorContext';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Select } from '../ui/Select';

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
    toggleDarkMode
  } = useEditor();

  const logoPath = `${import.meta.env.BASE_URL}logo.svg`;
  const hasContent = parsedBlocks.length > 0;

  const headerBg = isDark ? 'bg-[#141414]' : 'bg-[#1C1917]';

  return (
    <header className={`${headerBg} px-8 py-3 flex justify-between items-center z-20 shadow-2xl relative transition-all duration-500 border-b border-white/5`}>
      {/* Left: Brand */}
      <div className="flex items-center gap-5">
        {/* Logo Container: Using a subtle dark background to make the orange/white logo pop */}
        <div className="bg-stone-900 p-1.5 rounded-lg shadow-inner ring-1 ring-white/10">
          <img 
            src={logoPath} 
            alt="Logo" 
            className="w-7 h-7" 
            style={{
              filter: 'invert(48%) sepia(91%) saturate(1841%) hue-rotate(345deg) brightness(95%) contrast(92%)' // Target #EA580C
            }} 
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-white leading-none tracking-tight">
            MD2PPT <span className="text-[#FB923C] font-light ml-1">EVO</span>
          </h1>
          <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1.5">
            Warm Business Pro
          </p>
        </div>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Controls Group */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          <IconButton onClick={resetToDefault} title={t('reset')} onBrand>
            <RotateCcw className="w-4 h-4" />
          </IconButton>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <IconButton onClick={toggleLanguage} className="gap-2 px-3 w-auto" onBrand>
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
        <Select 
          icon={<Settings2 className="w-4 h-4 text-[#FB923C]" />}
          value={selectedSizeIndex}
          onChange={(e) => setSelectedSizeIndex(Number(e.target.value))}
          containerClassName="bg-white/5 border-white/10 hover:border-[#EA580C]/50"
          className="text-white text-xs font-bold"
        >
            {pageSizes.map((size, index) => (
              <option key={index} value={index} className="text-slate-900 bg-white">
                {t(`sizes.${size.name}`)}
              </option>
            ))}
        </Select>

        <Button
          onClick={handleExportMarkdown}
          disabled={!hasContent}
          variant="outline-white"
          className="h-10 px-4 font-bold border-white/10"
        >
          <FileText className="w-4 h-4" />
          <span>MD</span>
        </Button>

        {/* Primary Action: Warm Orange */}
        <Button
          onClick={handleDownload}
          disabled={!hasContent}
          isLoading={isGenerating}
          variant="brand"
          className="h-10 px-8 shadow-[0_10px_30px_rgba(234,88,12,0.3)] border-none ring-1 ring-white/10 active:translate-y-0.5 transition-all"
        >
          <Download className="w-5 h-5 stroke-[2.5px]" />
          <span className="font-black text-sm uppercase tracking-widest">
            {isGenerating ? t('exporting') : '匯出 PPT'}
          </span>
        </Button>
      </div>
    </header>
  );
};
