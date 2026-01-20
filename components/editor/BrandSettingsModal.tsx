/**
 * MD2PPT-Evolution
 * Brand Settings Modal
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import { X, Palette, Type, Image as ImageIcon, Upload, Download, Trash2, Layout } from 'lucide-react';
import { BrandConfig } from '../../services/types';
import { fileToBase64 } from '../../utils/imageUtils';

interface BrandSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BrandConfig;
  onUpdate: (updates: Partial<BrandConfig>) => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const BrandSettingsModal: React.FC<BrandSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdate,
  onExport,
  onImport
}) => {
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      onUpdate({ logo: base64 });
    } catch (err) {
      console.error("Failed to upload logo", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.json')) {
        onImport(file);
      } else if (file.type.startsWith('image/')) {
        handleLogoUpload(file);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div 
        className={`bg-white dark:bg-[#1C1917] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border transition-all ${isDragging ? 'border-orange-500 ring-4 ring-orange-500/20' : 'border-[#E7E5E4] dark:border-[#44403C]'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E7E5E4] dark:border-[#44403C]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-950 rounded-lg text-orange-600">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">品牌設定 (Brand Settings)</h2>
              <p className="text-xs text-stone-500">定義您的公司企業識別規範</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close"
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            這些設定將作為簡報的預設值，確保輸出的 PPT 具備一致的專業外觀。您可以直接在此處拖放 <strong>brand.json</strong> 或是 <strong>Logo 圖檔</strong>。
          </p>
          
          {/* Main Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {/* Left Section: Colors */}
             <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <Palette size={12} /> 品牌色票
                </label>
                
                <div className="space-y-4">
                  {[
                    { label: '主色 (Primary)', key: 'primaryColor' as const },
                    { label: '輔助色 (Secondary)', key: 'secondaryColor' as const },
                    { label: '強調色 (Accent)', key: 'accentColor' as const },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between group">
                      <label htmlFor={item.key} className="text-sm font-medium text-stone-700 dark:text-stone-300">
                        {item.label}
                      </label>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-stone-400 uppercase tracking-tighter">{config[item.key]}</span>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200 dark:border-white/10 shadow-sm transition-transform group-hover:scale-105">
                          <input 
                            id={item.key}
                            type="color" 
                            value={config[item.key]}
                            onChange={(e) => onUpdate({ [item.key]: e.target.value })}
                            className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* Right Section: Font */}
             <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <Type size={12} /> 字體選擇
                </label>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="brandFont" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      標題與內容字體
                    </label>
                    <select 
                      id="brandFont"
                      aria-label="標題字體"
                      value={config.font}
                      onChange={(e) => onUpdate({ font: e.target.value })}
                      className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none"
                    >
                      <option value="微軟正黑體">微軟正黑體 (Microsoft JhengHei)</option>
                      <option value="標楷體">標楷體 (DFKai-SB)</option>
                      <option value="新細明體">新細明體 (PMingLiU)</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Calibri">Calibri</option>
                      <option value="Consolas">Consolas (Monospace)</option>
                    </select>
                    <p className="text-[10px] text-stone-400 mt-1 italic">
                      * 僅建議使用共通字體，以確保在不同電腦開啟 PPT 時排版一致。
                    </p>
                  </div>

                  {/* Font Preview */}
                  <div 
                    className="p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-dashed border-stone-200 dark:border-white/10 flex flex-col gap-1 items-center justify-center min-h-[80px]"
                    style={{ fontFamily: config.font }}
                  >
                    <span className="text-lg font-bold">字體預覽效果</span>
                    <span className="text-xs opacity-60">Professional Presentation Style</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Logo Section */}
          <div className="pt-10 border-t border-stone-100 dark:border-white/5 space-y-6">
             <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
               <ImageIcon size={12} /> 品牌 Logo 與位置
             </label>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    企業 Logo (建議使用 PNG 透明底)
                  </label>
                  
                  {config.logo ? (
                    <div className="relative group aspect-video bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10 p-4 flex items-center justify-center">
                      <img src={config.logo} alt="Brand Logo" className="max-w-full max-h-full object-contain" />
                      <button 
                        onClick={() => onUpdate({ logo: undefined })}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="aspect-video bg-stone-50 dark:bg-white/5 rounded-xl border-2 border-dashed border-stone-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-stone-100 dark:hover:bg-white/10 transition-colors">
                      <Upload size={24} className="text-stone-300" />
                      <span className="text-xs text-stone-400">點擊或拖放圖片至此</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files && handleLogoUpload(e.target.files[0])}
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="logoPosition" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      Logo 顯示位置
                    </label>
                    <select 
                      id="logoPosition"
                      aria-label="Logo 顯示位置"
                      value={config.logoPosition}
                      onChange={(e) => onUpdate({ logoPosition: e.target.value as any })}
                      className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none"
                    >
                      <option value="top-left">左上角 (Top Left)</option>
                      <option value="top-right">右上角 (Top Right)</option>
                      <option value="bottom-left">左下角 (Bottom Left)</option>
                      <option value="bottom-right">右下角 (Bottom Right)</option>
                    </select>
                  </div>

                  <div className="p-4 bg-stone-50/50 dark:bg-white/5 rounded-xl border border-stone-100 dark:border-white/5 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
                      <Layout size={16} />
                    </div>
                    <p className="text-[10px] text-stone-500 leading-relaxed">
                      Logo 將自動套用至預覽區與 PPTX 母片。建議使用高解析度向量圖轉存之 PNG。
                    </p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-stone-50/50 dark:bg-stone-900/50 border-t border-[#E7E5E4] dark:border-[#44403C] flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
            >
              <Download size={14} /> 匯出 JSON
            </button>
            <label className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
              <Upload size={14} /> 匯入 JSON
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                onChange={(e) => e.target.files && onImport(e.target.files[0])}
              />
            </label>
          </div>
          
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-orange-600/20 transition-all active:scale-95"
          >
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
};