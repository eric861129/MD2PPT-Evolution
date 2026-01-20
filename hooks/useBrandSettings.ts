/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { BrandConfig } from '../services/types';

const DEFAULT_BRAND_CONFIG: BrandConfig = {
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#f59e0b',
  font: '微軟正黑體',
  logoPosition: 'top-right'
};

export const useBrandSettings = () => {
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    const saved = localStorage.getItem('brand_config');
    return saved ? JSON.parse(saved) : DEFAULT_BRAND_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('brand_config', JSON.stringify(brandConfig));
  }, [brandConfig]);

  const updateBrandConfig = (updates: Partial<BrandConfig>) => {
    setBrandConfig(prev => ({ ...prev, ...updates }));
  };

  const exportConfig = () => {
    return JSON.stringify(brandConfig, null, 2);
  };

  const importConfig = (json: string) => {
    try {
      const parsed = JSON.parse(json);
      // Basic validation
      if (typeof parsed === 'object' && parsed !== null) {
        setBrandConfig(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Invalid brand config JSON:", e);
    }
  };

  const saveConfigToFile = () => {
    const json = exportConfig();
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'brand.json');
  };

  const loadConfigFromFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importConfig(content);
        resolve();
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return {
    brandConfig,
    updateBrandConfig,
    exportConfig,
    importConfig,
    saveConfigToFile,
    loadConfigFromFile
  };
};
