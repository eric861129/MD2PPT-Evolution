import { useState } from 'react';
import { generatePpt } from '../services/pptGenerator';
import { ParsedBlock } from '../services/parser/ast';

export const usePptExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPpt = async (blocks: ParsedBlock[]) => {
    setIsExporting(true);
    setError(null);
    try {
      await generatePpt(blocks);
    } catch (err) {
      console.error('Export failed:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToPpt, isExporting, error };
};
