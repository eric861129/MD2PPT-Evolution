/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';
import { parseMarkdownWithAST } from '../services/parser/ast';
import { ParsedBlock, DocumentMeta } from '../services/types';
import { INITIAL_CONTENT_ZH, INITIAL_CONTENT_EN } from '../constants/defaultContent';
import { PRESET_THEMES, DEFAULT_THEME_ID } from '../constants/themes';
import { PptTheme, BrandConfig } from '../services/types';

const DEFAULT_BRAND_CONFIG: BrandConfig = {
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#f59e0b',
  font: '微軟正黑體',
  logoPosition: 'top-right'
};

export const useEditorState = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language.split('-')[0];

  const getInitialContent = (lang: string) => lang.startsWith('zh') ? INITIAL_CONTENT_ZH : INITIAL_CONTENT_EN;

  const [content, setContent] = useState(() => {
    return localStorage.getItem('md2ppt_draft_content') || getInitialContent(i18n.language);
  });
  
  const [parsedBlocks, setParsedBlocks] = useState<ParsedBlock[]>([]);
  const [documentMeta, setDocumentMeta] = useState<DocumentMeta>({});
  const [isParsing, setIsParsing] = useState(false);
  
  const [showNotes, setShowNotes] = useState(() => {
    return localStorage.getItem('md2ppt_show_notes') === 'true';
  });

  const [activeThemeId, setActiveThemeId] = useState(() => {
    return localStorage.getItem('md2ppt_active_theme_id') || DEFAULT_THEME_ID;
  });

  const [customThemeSettings, setCustomThemeSettings] = useState<Partial<PptTheme>>(() => {
    const saved = localStorage.getItem('md2ppt_custom_theme_settings');
    return saved ? JSON.parse(saved) : {};
  });

  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    const saved = localStorage.getItem('md2ppt_brand_config');
    return saved ? JSON.parse(saved) : DEFAULT_BRAND_CONFIG;
  });

  // Theme Logic
  const activeTheme = useMemo(() => {
    const targetId = documentMeta.theme || activeThemeId;
    const preset = PRESET_THEMES[targetId] || PRESET_THEMES[DEFAULT_THEME_ID];
    
    return {
      ...preset,
      ...customThemeSettings,
      colors: { 
        ...preset.colors, 
        ...customThemeSettings.colors 
      },
      fonts: { 
        ...preset.fonts, 
        main: brandConfig.font,
        heading: brandConfig.font,
        ...customThemeSettings.fonts 
      }
    };
  }, [activeThemeId, customThemeSettings, documentMeta.theme, brandConfig]);

  // Parsing & Auto-save (Debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsParsing(true);
      try {
        const blocks = await parseMarkdownWithAST(content);
        setParsedBlocks(blocks);
        
        // Simple meta extraction from HORIZONTAL_RULE blocks
        const metaBlock = blocks.find(b => b.type === 'HORIZONTAL_RULE' && b.metadata);
        if (metaBlock) setDocumentMeta(metaBlock.metadata || {});

        localStorage.setItem('md2ppt_draft_content', content);
      } catch (e) {
        console.error("Markdown parsing error:", e);
      } finally {
        setIsParsing(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    localStorage.setItem('md2ppt_show_notes', showNotes.toString());
  }, [showNotes]);

  useEffect(() => {
    localStorage.setItem('md2ppt_active_theme_id', activeThemeId);
  }, [activeThemeId]);

  useEffect(() => {
    localStorage.setItem('md2ppt_custom_theme_settings', JSON.stringify(customThemeSettings));
  }, [customThemeSettings]);

  useEffect(() => {
    localStorage.setItem('md2ppt_brand_config', JSON.stringify(brandConfig));
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', brandConfig.primaryColor);
    root.style.setProperty('--brand-secondary', brandConfig.secondaryColor);
    root.style.setProperty('--brand-accent', brandConfig.accentColor);
    root.style.setProperty('--brand-font', brandConfig.font);
  }, [brandConfig]);

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    if (confirm(t('switchLangConfirm'))) {
      i18n.changeLanguage(nextLang);
      setContent(getInitialContent(nextLang));
      localStorage.removeItem('md2ppt_draft_content');
    }
  };

  const resetToDefault = () => {
    if (confirm(t('resetConfirm'))) {
      setContent(getInitialContent(i18n.language));
      localStorage.removeItem('md2ppt_draft_content');
    }
  };

  const saveBrandConfigToFile = () => {
    const json = JSON.stringify(brandConfig, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'brand.json');
  };

  const loadBrandConfigFromFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (typeof parsed === 'object' && parsed !== null) {
            setBrandConfig(prev => ({ ...prev, ...parsed }));
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return {
    content,
    setContent,
    parsedBlocks,
    documentMeta,
    isParsing,
    showNotes,
    toggleNotes: () => setShowNotes(!showNotes),
    activeTheme,
    setActiveThemeId,
    updateCustomTheme: (settings: Partial<PptTheme>) => setCustomThemeSettings(prev => ({ ...prev, ...settings })),
    resetCustomTheme: () => setCustomThemeSettings({}),
    brandConfig,
    updateBrandConfig: (updates: Partial<BrandConfig>) => setBrandConfig(prev => ({ ...prev, ...updates })),
    saveBrandConfigToFile,
    loadBrandConfigFromFile,
    language,
    toggleLanguage,
    resetToDefault,
    t
  };
};
