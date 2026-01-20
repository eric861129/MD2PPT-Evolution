/**
 * MD2PPT-Evolution
 * Theme Definitions
 * Copyright (c) 2026 EricHuang
 */

import { PptTheme } from "../services/types";
import { CURATED_PALETTES } from "./palettes";

const BASE_THEMES: Record<string, PptTheme> = {
  'amber': {
    name: 'amber',
    label: '商務琥珀',
    colors: {
      primary: 'EA580C',
      background: 'FFFFFF',
      text: '1C1917',
      accent: 'FB923C',
      chart: ['#EA580C', '#FB923C', '#FDBA74', '#FFEDD5', '#A8A29E', '#44403C']
    },
    fonts: {
      main: 'Microsoft JhengHei',
      heading: 'Microsoft JhengHei'
    }
  },
  'midnight': {
    name: 'midnight',
    label: '科技深夜',
    colors: {
      primary: '38BDF8',
      background: '0F172A',
      text: 'F8FAFC',
      accent: 'F472B6',
      chart: ['#38BDF8', '#F472B6', '#4ADE80', '#FB923C', '#818CF8', '#A78BFA']
    },
    fonts: {
      main: 'Microsoft JhengHei',
      heading: 'Microsoft JhengHei'
    }
  },
  'academic': {
    name: 'academic',
    label: '簡約學術',
    colors: {
      primary: '0F172A',
      background: 'FFFFFF',
      text: '1E293B',
      accent: '64748B',
      chart: ['#0F172A', '#334155', '#64748B', '#94A3B8', '#CBD5E1', '#F1F5F9']
    },
    fonts: {
      main: 'Times New Roman',
      heading: 'Calibri'
    }
  },
  'material': {
    name: 'material',
    label: '現代翠綠',
    colors: {
      primary: '059669',
      background: 'FFFFFF',
      text: '064E3B',
      accent: '10B981',
      chart: ['#059669', '#10B981', '#34D399', '#A7F3D0', '#ECFDF5', '#064E3B']
    },
    fonts: {
      main: 'Microsoft JhengHei',
      heading: 'Microsoft JhengHei'
    }
  }
};

// Map palettes to full themes
const PALETTE_THEMES: Record<string, PptTheme> = {};
CURATED_PALETTES.forEach(p => {
  const base = BASE_THEMES[p.baseTheme] || BASE_THEMES['amber'];
  
  // Use the middle color from the mesh as the primary color for the UI/Icons
  const meshPrimary = p.meshColors[1] || p.meshColors[0];
  const meshAccent = p.meshColors[2] || p.meshColors[1];

  PALETTE_THEMES[p.id] = {
    ...base,
    name: p.id,
    label: p.label,
    colors: {
      ...base.colors,
      primary: meshPrimary.replace('#', ''),
      accent: meshAccent.replace('#', ''),
      // Also update chart colors to match the palette
      chart: [meshPrimary, meshAccent, ...base.colors.chart.slice(2)]
    }
  };
});

export const PRESET_THEMES: Record<string, PptTheme> = {
  ...PALETTE_THEMES // We only expose Palette Themes now
};

export const DEFAULT_THEME_ID = 'classic-amber';