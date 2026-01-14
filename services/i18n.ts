/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { APP_VERSION } from '../constants/meta';

const resources = {
  zh: {
    translation: {
      title: 'MD2PPT',
      subtitle: `核心引擎：Markdown -> PPTX (v${APP_VERSION})`,
      export: '匯出 PPT',
      exportMD: '匯出 MD',
      exporting: '正在轉換...',
      reset: '重置為範例文件',
      resetConfirm: '確定要重置內容嗎？您目前的編輯將會遺失並恢復為預設範例。',
      switchLangConfirm: '切換語言將會重置當前內容為該語言的範例文件。確定要繼續嗎？',
      theme: {
        light: '切換至亮色模式',
        dark: '切換至深色模式'
      },
      sizes: {
        "16x9": '16:9 (寬螢幕)',
        "16x10": '16:10 (現代)',
        "4x3": '4:3 (標準)',
        "a4": 'A4 (橫向)'
      }
    }
  },
  en: {
    translation: {
      title: 'MD2PPT',
      subtitle: `Core Engine: Markdown -> PPTX (v${APP_VERSION})`,
      export: 'Export PPT',
      exportMD: 'Export MD',
      exporting: 'Converting...',
      reset: 'Reset to Example',
      resetConfirm: 'Are you sure you want to reset? Your current changes will be lost.',
      switchLangConfirm: 'Switching language will reset the content to the default example of that language. Continue?',
      theme: {
        light: 'Switch to Light Mode',
        dark: 'Switch to Dark Mode'
      },
      sizes: {
        "16x9": '16:9 (Widescreen)',
        "16x10": '16:10 (Modern)',
        "4x3": '4:3 (Standard)',
        "a4": 'A4 (Landscape)'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;