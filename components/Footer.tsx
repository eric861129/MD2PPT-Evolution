/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

import React from 'react';
import { APP_VERSION } from '../constants/meta';
import { Github, Star, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full h-8 bg-white/80 dark:bg-[#1C1917]/80 backdrop-blur-md border-t border-slate-200 dark:border-white/5 flex items-center justify-between px-4 z-30 shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold text-slate-400 dark:text-stone-600 uppercase tracking-widest">
          MD2PPT Evolution v{APP_VERSION}
        </span>
        <div className="w-[1px] h-3 bg-slate-200 dark:bg-white/10 hidden sm:block" />
        <span className="text-[10px] text-slate-400 dark:text-stone-600 hidden sm:flex items-center gap-1 font-medium">
          Made with <Heart size={10} className="fill-current text-rose-400" /> by <span className="text-[var(--brand-primary)] font-bold">EricHuang</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* GoatCounter Visitor Counter */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-tighter">Views</span>
          <img 
            src="https://eric861129.goatcounter.com/counter/TOTAL.svg" 
            alt="Views" 
            className="h-3 opacity-60 dark:invert dark:contrast-200"
            style={{ minWidth: '20px' }}
          />
        </div>

        {/* GitHub Star Link */}
        <a 
          href="https://github.com/eric861129/MD2PPT-Evolution" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 px-2 py-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          <Github size={12} className="text-slate-500 dark:text-stone-500 group-hover:text-black dark:group-hover:text-white" />
          <span className="text-[10px] font-bold text-slate-500 dark:text-stone-500 group-hover:text-black dark:group-hover:text-white transition-colors">
            GitHub
          </span>
          <div className="flex items-center gap-0.5 pl-1.5 border-l border-slate-200 dark:border-white/10 text-[10px] font-medium text-slate-400 dark:text-stone-600 group-hover:text-[var(--brand-primary)]">
            <Star size={10} className="fill-current" />
          </div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
