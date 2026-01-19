import React, { useState, useEffect } from 'react';
import { useVisualTweaker } from '../../contexts/VisualTweakerContext';

export const ChartTweaker: React.FC = () => {
  const { sourceLine, getLineContent, updateContent, closeTweaker } = useVisualTweaker();
  const [chartType, setChartType] = useState('bar');
  const [configStr, setConfigStr] = useState('{}');
  const [tableData, setTableData] = useState('');

  useEffect(() => {
    if (sourceLine !== null) {
      const raw = getLineContent(sourceLine);
      const lines = raw.split('\n');
      
      // 1. Parse Start Line: ::: chart-type {config}
      const startLine = lines[0].trim();
      const startMatch = startLine.match(/^::: chart-([\w-]+)(?:\s+(.*))?$/);
      if (startMatch) {
        setChartType(startMatch[1]);
        setConfigStr(startMatch[2] || '{}');
      }

      // 2. Extract Table Body
      const tableLines = lines.filter(l => l.trim().startsWith('|'));
      setTableData(tableLines.join('\n'));
    }
  }, [sourceLine, getLineContent]);

  const handleApply = () => {
    const newMarkdown = `::: chart-${chartType} ${configStr}\n${tableData}\n:::`;
    updateContent(newMarkdown);
    closeTweaker();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Type</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="w-full p-1 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded outline-none"
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="area">Area</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Config (JSON)</label>
          <input 
            type="text" 
            value={configStr} 
            onChange={(e) => setConfigStr(e.target.value)}
            className="w-full p-1 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Table Data (Markdown Table)</label>
        <textarea
          value={tableData}
          onChange={(e) => setTableData(e.target.value)}
          className="w-full h-32 p-2 text-xs font-mono bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded outline-none resize-none"
        />
      </div>

      <button
        onClick={handleApply}
        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded shadow-md transition-colors"
      >
        Apply Data Changes
      </button>
    </div>
  );
};
