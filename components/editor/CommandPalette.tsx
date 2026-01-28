/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * 
 * Command Palette UI using kbar
 */

import React from 'react';
import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
} from 'kbar';

export const CommandPalette: React.FC = () => {
  return (
    <KBarPortal>
      <KBarPositioner className="z-[100] backdrop-blur-sm bg-stone-900/40 p-4 md:p-0">
        <KBarAnimator className="w-full max-w-[640px] overflow-hidden rounded-2xl bg-[#1C1917] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200">
          <div className="p-5 border-b border-white/5 bg-white/[0.02]">
            <KBarSearch 
              className="w-full bg-transparent text-white outline-none placeholder-stone-600 text-xl font-medium tracking-tight" 
              placeholder="輸入指令執行操作..."
            />
          </div>
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            <RenderResults />
          </div>
          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex gap-4">
              <span className="text-[9px] font-bold text-stone-500 flex items-center gap-1.5 uppercase tracking-widest">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-white/5 text-stone-400">↑↓</kbd> 選擇
              </span>
              <span className="text-[9px] font-bold text-stone-500 flex items-center gap-1.5 uppercase tracking-widest">
                <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-white/5 text-stone-400">Enter</kbd> 執行
              </span>
            </div>
            <span className="text-[9px] font-black text-[var(--product-primary)] uppercase tracking-[0.2em] opacity-80">Command Center</span>
          </div>
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
};

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--product-primary)] bg-stone-950/80 sticky top-0 z-10 backdrop-blur-md border-b border-white/5">
            {item}
          </div>
        ) : (
          <div
            className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-all duration-200 relative group ${
              active 
                ? "bg-[var(--product-primary)]/10 text-white" 
                : "text-stone-400 hover:bg-white/5"
            }`}
          >
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--product-primary)] shadow-[0_0_15px_var(--product-glow)]" />}
            
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? "bg-[var(--product-primary)] text-white" : "bg-white/5 text-stone-500 group-hover:text-stone-300"}`}>
                {item.icon || <div className="w-4 h-4 rounded-sm border border-current opacity-40" />}
              </div>
              <div className="flex flex-col">
                <span className={`text-[15px] font-bold tracking-tight ${active ? "text-white" : "text-stone-300"}`}>
                  {item.name}
                </span>
                {item.subtitle && (
                  <span className="text-[11px] opacity-50 font-medium truncate max-w-[350px] mt-0.5">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </div>
            
            {item.shortcut?.length ? (
              <div className="flex gap-1.5">
                {item.shortcut.map((sc) => (
                  <kbd 
                    key={sc} 
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors ${
                      active 
                        ? "bg-[var(--product-primary)] border-[var(--product-hover)] text-white shadow-lg shadow-[var(--product-glow)]" 
                        : "bg-stone-800 border-white/5 text-stone-500"
                    }`}
                  >
                    {sc.toUpperCase()}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  );
}
