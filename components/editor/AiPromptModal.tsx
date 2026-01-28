/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import { X, Copy, Check, Bot, ExternalLink } from 'lucide-react';
import { AI_ASSISTANT_PROMPT } from '../../constants/prompts';
import { Button } from '../ui/Button';

interface AiPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiPromptModal: React.FC<AiPromptModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(AI_ASSISTANT_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-[#1C1917] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--product-primary)]/20 flex items-center justify-center text-[var(--product-primary)]">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">AI Assistant Prompt</h2>
              <p className="text-xs text-stone-400 font-medium">Use this prompt to convert your content with ChatGPT/Gemini</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-stone-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#141414]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--product-primary)]">Prompt Text</span>
            <div className="flex gap-2">
                <a 
                    href="https://chatgpt.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 hover:text-white transition-colors px-2 py-1 rounded bg-white/5"
                >
                    ChatGPT <ExternalLink size={10} />
                </a>
                <a 
                    href="https://gemini.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 hover:text-white transition-colors px-2 py-1 rounded bg-white/5"
                >
                    Gemini <ExternalLink size={10} />
                </a>
            </div>
          </div>
          
          <div className="relative group">
            <pre className="bg-stone-900/50 border border-white/5 rounded-2xl p-5 text-sm text-stone-300 font-mono whitespace-pre-wrap break-words leading-relaxed">
              {AI_ASSISTANT_PROMPT}
            </pre>
            
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    onClick={handleCopy}
                    variant="brand"
                    className="h-9 px-4 shadow-xl"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span className="ml-2">{copied ? 'Copied!' : 'Copy Prompt'}</span>
                </Button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[var(--product-primary)]/10 border border-[var(--product-primary)]/20">
            <h4 className="text-sm font-bold text-[var(--product-hover)] mb-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--product-hover)]" />
              How to use:
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Copy the prompt above and paste it into your favorite AI tool. Then, provide your raw notes or content and specify your preferred style (e.g., "Corporate Tech Blue", "Minimalist Dark"). The AI will generate a perfectly formatted Markdown for MD2PPT.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-stone-900/50 flex justify-end">
          <Button
            onClick={handleCopy}
            variant="brand"
            className="px-8"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span className="ml-2 font-black uppercase tracking-widest">{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
