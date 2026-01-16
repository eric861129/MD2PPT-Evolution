/**
 * MD2PPT-Evolution
 * Theme Definitions
 * Copyright (c) 2026 EricHuang
 */

import { PptTheme } from "../services/types";

export const PRESET_THEMES: Record<string, PptTheme> = {
  'amber-graphite': {
    name: 'amber-graphite',
    label: '商務琥珀 (預設)',
    colors: {
      primary: 'EA580C',
      background: 'FFFFFF',
      text: '1C1917',
      accent: 'F59E0B',
      chart: ['#EA580C', '#F59E0B', '#0EA5E9', '#84CC16', '#10B981', '#6366F1']
    },
    fonts: {
      main: 'Microsoft JhengHei',
      heading: 'Microsoft JhengHei'
    }
  },
  'midnight-cyber': {
    name: 'midnight-cyber',
    label: '科技深夜',
    colors: {
      primary: '0EA5E9',
      background: '0F172A',
      text: 'F8FAFC',
      accent: 'F43F5E',
      chart: ['#0EA5E9', '#F43F5E', '#10B981', '#F59E0B', '#6366F1', '#D946EF']
    },
    fonts: {
      main: 'Segoe UI',
      heading: 'Segoe UI'
    }
  },
  'academic-clean': {
    name: 'academic-clean',
    label: '簡約學術',
    colors: {
      primary: '1E293B',
      background: 'FAFAFA',
      text: '0F172A',
      accent: '64748B',
      chart: ['#1E293B', '#475569', '#94A3B8', '#CBD5E1', '#E2E8F0', '#F1F5F9']
    },
    fonts: {
      main: 'Cambria',
      heading: 'Georgia'
    }
  },
  'material-teal': {
    name: 'material-teal',
    label: '現代翠綠',
    colors: {
      primary: '0D9488',
      background: 'F0FDFA',
      text: '134E4A',
      accent: 'FACC15',
      chart: ['#0D9488', '#FACC15', '#FB923C', '#2DD4BF', '#4ADE80', '#60A5FA']
    },
    fonts: {
      main: 'Roboto',
      heading: 'Roboto'
    }
  }
};

export const DEFAULT_THEME_ID = 'amber-graphite';
