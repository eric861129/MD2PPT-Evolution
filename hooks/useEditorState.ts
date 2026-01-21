import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';
import { parseMarkdown } from '../services/markdownParser';
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
    return localStorage.getItem('draft_content') || getInitialContent(i18n.language);
  });
  
  const [parsedBlocks, setParsedBlocks] = useState<ParsedBlock[]>([]);
  const [documentMeta, setDocumentMeta] = useState<DocumentMeta>({});
  const [showNotes, setShowNotes] = useState(() => {
    return localStorage.getItem('show_notes') === 'true';
  });

  const [activeThemeId, setActiveThemeId] = useState(() => {
    return localStorage.getItem('active_theme_id') || DEFAULT_THEME_ID;
  });

  const [customThemeSettings, setCustomThemeSettings] = useState<Partial<PptTheme>>(() => {
    const saved = localStorage.getItem('custom_theme_settings');
    return saved ? JSON.parse(saved) : {};
  });

  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    const saved = localStorage.getItem('brand_config');
    return saved ? JSON.parse(saved) : DEFAULT_BRAND_CONFIG;
  });

  // Theme Logic
  const activeTheme = useMemo(() => {
    // 1. Priority: Markdown YAML Global metadata > UI Selection
    const targetId = documentMeta.theme || activeThemeId;
    const preset = PRESET_THEMES[targetId] || PRESET_THEMES[DEFAULT_THEME_ID];
    
    // 2. Incorporate Brand Overrides (if they differ from defaults)
    // Actually, we should always merge brand colors as they are the "Corporate Identity"
    const brandColors = {
      primary: brandConfig.primaryColor.replace('#', ''),
      accent: brandConfig.accentColor.replace('#', '')
    };

    return {
      ...preset,
      ...customThemeSettings,
      colors: { 
        ...preset.colors, 
        // ...brandColors, // Remove forced Brand override to let Preset Themes work
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
    const timer = setTimeout(() => {
      try {
        const { blocks, meta } = parseMarkdown(content);
        setParsedBlocks(blocks);
        setDocumentMeta(meta);
        localStorage.setItem('draft_content', content);
      } catch (e) {
        console.error("Markdown parsing error:", e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    localStorage.setItem('show_notes', showNotes.toString());
  }, [showNotes]);

  useEffect(() => {
    localStorage.setItem('active_theme_id', activeThemeId);
  }, [activeThemeId]);

  useEffect(() => {
    localStorage.setItem('custom_theme_settings', JSON.stringify(customThemeSettings));
  }, [customThemeSettings]);

  useEffect(() => {
    localStorage.setItem('brand_config', JSON.stringify(brandConfig));
    
    // Inject CSS Variables for UI and Preview components
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', brandConfig.primaryColor);
    root.style.setProperty('--brand-secondary', brandConfig.secondaryColor);
    root.style.setProperty('--brand-accent', brandConfig.accentColor);
    root.style.setProperty('--brand-font', brandConfig.font);
  }, [brandConfig]);

  // Language Toggle Logic
  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    
    if (confirm(t('switchLangConfirm'))) {
      i18n.changeLanguage(nextLang);
      setContent(getInitialContent(nextLang));
      localStorage.removeItem('draft_content');
    }
  };

  // Reset Logic
  const resetToDefault = () => {
    if (confirm(t('resetConfirm'))) {
      setContent(getInitialContent(i18n.language));
      localStorage.removeItem('draft_content');
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
    t // Export translation helper if needed
  };
};