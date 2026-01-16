import React, { useState } from 'react';
import { ParsedBlock, BlockType, PptTheme } from '../../services/types';
import { parseInlineElements, InlineStyleType } from '../../utils/styleParser';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import MermaidRenderer from './MermaidRenderer';
import { ChartPreview } from './ChartPreview';

export const RenderRichText: React.FC<{ text: string, theme?: PptTheme }> = ({ text, theme }) => {
  const segments = parseInlineElements(text);
  const linkColor = theme ? `#${theme.colors.primary}` : '#EA580C';
  
  return (
    <>
      {segments.map((segment, i) => {
        switch (segment.type) {
          case InlineStyleType.BOLD: return <strong key={i} className="font-bold">{segment.content}</strong>;
          case InlineStyleType.ITALIC: return <span key={i} className="italic opacity-90">{segment.content}</span>;
          case InlineStyleType.CODE: return <code key={i} className="bg-slate-200/50 dark:bg-black/20 px-1.5 py-0.5 rounded font-mono text-[0.9em]">{segment.content}</code>;
          case InlineStyleType.LINK: return <span key={i} className="underline underline-offset-4" style={{ color: linkColor }}>{segment.content}</span>;
          case InlineStyleType.TEXT:
          default: return <span key={i}>{segment.content}</span>;
        }
      })}
    </>
  );
};

export const PreviewBlock: React.FC<{ block: ParsedBlock, isDark?: boolean, theme: PptTheme }> = ({ block, isDark, theme }) => {
  const [imgError, setImgError] = useState(false);
  const primaryColor = `#${theme.colors.primary}`;
  const accentColor = `#${theme.colors.accent}`;

  switch (block.type) {
    case BlockType.CHART:
      return <ChartPreview block={block} isDark={isDark} theme={theme} />;
    case BlockType.HEADING_1:
      return <h1 className="text-6xl font-black mb-10 border-l-[12px] pl-8 leading-tight uppercase tracking-tighter" style={{ borderColor: primaryColor }}><RenderRichText text={block.content} theme={theme} /></h1>;
    case BlockType.HEADING_2:
      return <h2 className="text-4xl font-bold mb-8 tracking-tight" style={{ color: isDark ? '#E2E8F0' : accentColor }}><RenderRichText text={block.content} theme={theme} /></h2>;
    case BlockType.HEADING_3:
      return <h3 className="text-3xl font-semibold mb-6 opacity-80 underline underline-offset-8" style={{ textDecorationColor: `${primaryColor}40` }}><RenderRichText text={block.content} theme={theme} /></h3>;
    case BlockType.CODE_BLOCK:
      return (
        <div className="my-10 bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-slate-700 p-8 rounded-lg font-mono text-xl shadow-inner overflow-hidden">
          <pre className="whitespace-pre-wrap break-all">{block.content}</pre>
        </div>
      );
    case BlockType.MERMAID:
      return <div className="my-10 scale-125 flex justify-center"><MermaidRenderer chart={block.content} /></div>;
    case BlockType.CHAT_CUSTOM:
      const align = block.alignment || 'left';
      return (
        <div className={`flex ${align === 'right' ? 'justify-end pl-24' : align === 'center' ? 'justify-center px-12' : 'justify-start pr-24'} my-10`}>
          <div className={`p-8 relative rounded-3xl shadow-lg border-2`} style={{ 
            backgroundColor: align === 'right' ? `${primaryColor}10` : align === 'center' ? '#EEF2FF' : '#ECFDF5',
            borderColor: align === 'right' ? `${primaryColor}30` : align === 'center' ? '#E0E7FF' : '#D1FAE5'
          }}>
            <div className={`absolute -top-4 ${align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'} px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-md text-white`} style={{ 
              backgroundColor: align === 'right' ? primaryColor : align === 'center' ? '#6366F1' : '#10B981'
            }}>
              {block.role}
            </div>
            <div className="text-2xl leading-relaxed text-slate-800"><RenderRichText text={block.content} theme={theme} /></div>
          </div>
        </div>
      );
    case BlockType.IMAGE:
      return (
        <div className="flex flex-col items-center justify-center my-12 w-full">
          {imgError ? (
            <div className="w-full h-64 bg-slate-100 rounded-xl border-4 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-4">
              <AlertCircle size={48} />
              <p className="text-xl font-bold">圖片載入失敗 (可能存在 CORS 限制)</p>
              <p className="text-sm opacity-60">{block.content}</p>
            </div>
          ) : (
            <div className="relative group w-full flex justify-center">
              <img 
                src={block.content} 
                alt={block.metadata?.alt || "Slide Content"} 
                className="max-w-[95%] max-h-[600px] object-contain shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-xl border-8 border-white"
                onError={() => setImgError(true)}
              />
              <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon size={20} />
              </div>
            </div>
          )}
          {block.metadata?.alt && (
            <p className="mt-4 text-lg text-slate-400 italic font-medium">{block.metadata.alt}</p>
          )}
        </div>
      );
    case BlockType.TABLE:
      return (
        <div className="my-10 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xl">
          <table className="w-full border-collapse text-2xl">
            <thead>
              <tr className="text-white" style={{ backgroundColor: primaryColor }}>
                {block.tableRows?.[0].map((cell, idx) => (
                  <th key={idx} className="p-6 text-left font-black tracking-widest uppercase">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.tableRows?.slice(1).map((row, rIdx) => (
                <tr key={rIdx} className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 last:border-0 hover:bg-slate-50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-6 text-slate-700 dark:text-slate-300"><RenderRichText text={cell} theme={theme} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case BlockType.CALLOUT_TIP:
    case BlockType.CALLOUT_NOTE:
    case BlockType.CALLOUT_WARNING:
      const isWarn = block.type === BlockType.CALLOUT_WARNING;
      return (
        <div className={`my-12 p-10 border-l-[16px] rounded-r-2xl shadow-xl ${isWarn ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
          <div className={`text-xl font-black uppercase mb-4 tracking-tighter ${isWarn ? 'text-red-600' : 'text-blue-600'}`}>{block.type.split('_')[1]}</div>
          <div className="text-3xl italic leading-relaxed text-slate-800"><RenderRichText text={block.content} theme={theme} /></div>
        </div>
      );
    case BlockType.QUOTE_BLOCK:
      const cleanQuote = block.content.replace(/^>\s*/gm, '').trim();
      return <p className="text-4xl leading-relaxed mb-10 text-center italic opacity-90" style={{ fontFamily: 'Georgia, serif' }}><RenderRichText text={cleanQuote} theme={theme} /></p>;
    default:
      return <p className="text-3xl leading-relaxed mb-10 text-justify tracking-tight opacity-90"><RenderRichText text={block.content} theme={theme} /></p>;
  }
};