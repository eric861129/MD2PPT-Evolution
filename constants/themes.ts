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
      primary: '38BDF8',
      background: '0F172A',
      text: 'F8FAFC',
      accent: 'F472B6',
      chart: ['#38BDF8', '#F472B6', '#4ADE80', '#FB923C', '#818CF8', '#A78BFA']
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
      primary: '0F172A',
      background: 'FFFFFF',
      text: '334155',
      accent: '64748B',
      chart: ['#0F172A', '#334155', '#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0']
    },
    fonts: {
      main: 'Times New Roman',
      heading: 'Calibri'
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
