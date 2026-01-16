import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { parseMarkdown } from '../services/markdownParser';
import { ParsedBlock, DocumentMeta } from '../services/types';
import { INITIAL_CONTENT_ZH, INITIAL_CONTENT_EN } from '../constants/defaultContent';
import { PRESET_THEMES, DEFAULT_THEME_ID } from '../constants/themes';
import { PptTheme } from '../services/types';

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

  // Theme Logic
  const activeTheme = useMemo(() => {
    // 1. Priority: Markdown YAML Global metadata > UI Selection
    const targetId = documentMeta.theme || activeThemeId;
    const preset = PRESET_THEMES[targetId] || PRESET_THEMES[DEFAULT_THEME_ID];
    
    return {
      ...preset,
      ...customThemeSettings,
      colors: { ...preset.colors, ...customThemeSettings.colors },
      fonts: { ...preset.fonts, ...customThemeSettings.fonts }
    };
  }, [activeThemeId, customThemeSettings, documentMeta.theme]);

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
    language,
    toggleLanguage,
    resetToDefault,
    t // Export translation helper if needed
  };
};