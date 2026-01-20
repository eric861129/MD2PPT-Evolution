/**
 * MD2PPT-Evolution
 * Curated Design Systems & Color Palettes
 * Copyright (c) 2026 EricHuang
 */

export interface DesignPalette {
  id: string;
  name: string;
  label: string;
  description: string;
  baseTheme: 'amber' | 'midnight' | 'academic' | 'material';
  meshColors: string[];
  keywords: string[];
}

export const CURATED_PALETTES: DesignPalette[] = [
  // --- MD2PPT Official ---
  {
    id: 'classic-amber',
    name: 'Classic Amber',
    label: '經典琥珀',
    description: 'MD2PPT 官方配色，專業且具備品牌識別度',
    baseTheme: 'amber',
    meshColors: ["#C2410C", "#EA580C", "#FDBA74"],
    keywords: ['official', 'brand', 'classic', 'orange']
  },

  // --- Tech & Trust ---
  {
    id: 'tech-blue',
    name: 'Tech Blue',
    label: '科技藍系',
    description: '適合商務、軟體、雲端服務',
    baseTheme: 'midnight',
    meshColors: ["#0F172A", "#1E40AF", "#3B82F6"],
    keywords: ['tech', 'cloud', 'software', 'business']
  },
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    label: '海洋深度',
    description: '適合專業報告、學術研究',
    baseTheme: 'academic',
    meshColors: ["#082F49", "#0EA5E9", "#BAE6FD"],
    keywords: ['professional', 'academic', 'ocean', 'calm']
  },
  {
    id: 'fintech-navy',
    name: 'FinTech Navy',
    label: '金融權威',
    description: '適合銀行、數據分析、投資',
    baseTheme: 'academic',
    meshColors: ["#020617", "#334155", "#94A3B8"],
    keywords: ['finance', 'data', 'bank', 'authority']
  },

  // --- Energy & Warmth ---
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    label: '夕陽活力',
    description: '適合行銷提案、願景分享',
    baseTheme: 'amber',
    meshColors: ["#451A03", "#EA580C", "#FDE68A"],
    keywords: ['marketing', 'warm', 'sunset', 'vision']
  },
  {
    id: 'coral-vivid',
    name: 'Coral Vivid',
    label: '珊瑚鮮活',
    description: '適合電商、時尚、年輕客群',
    baseTheme: 'amber',
    meshColors: ["#4C0519", "#E11D48", "#FECDD3"],
    keywords: ['ecommerce', 'fashion', 'youth', 'vivid']
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    label: '榮耀時刻',
    description: '適合頒獎典禮、奢華品牌',
    baseTheme: 'midnight',
    meshColors: ["#422006", "#D97706", "#FEF3C7"],
    keywords: ['luxury', 'award', 'gold', 'champion']
  },

  // --- Nature & Health ---
  {
    id: 'fresh-mint',
    name: 'Fresh Mint',
    label: '清新薄荷',
    description: '適合醫療、ESG、健康產業',
    baseTheme: 'material',
    meshColors: ["#064E3B", "#10B981", "#D1FAE5"],
    keywords: ['medical', 'health', 'esg', 'nature']
  },
  {
    id: 'deep-forest',
    name: 'Deep Forest',
    label: '深邃森林',
    description: '適合戶外、露營、永續議題',
    baseTheme: 'midnight',
    meshColors: ["#022C22", "#166534", "#4ADE80"],
    keywords: ['outdoor', 'camping', 'forest', 'sustainability']
  },

  // --- Creative & Mystery ---
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    label: '賽博霓虹',
    description: '適合遊戲、區塊鏈、潮流文化',
    baseTheme: 'midnight',
    meshColors: ["#1E1B4B", "#7C3AED", "#F472B6"],
    keywords: ['game', 'crypto', 'cyberpunk', 'trend']
  },
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    label: '薰衣草夢',
    description: '適合女性話題、藝術展覽',
    baseTheme: 'academic',
    meshColors: ["#2E1065", "#A855F7", "#F3E8FF"],
    keywords: ['art', 'female', 'dream', 'soft']
  },

  // --- Minimal ---
  {
    id: 'clean-slate',
    name: 'Clean Slate',
    label: '極簡純粹',
    description: '適合高度專業、資訊密集',
    baseTheme: 'academic',
    meshColors: ["#1E293B", "#94A3B8", "#F8FAFC"],
    keywords: ['minimal', 'clean', 'info', 'simple']
  },
  {
    id: 'dark-matter',
    name: 'Dark Matter',
    label: '暗物質',
    description: '適合駭客任務、底層技術',
    baseTheme: 'midnight',
    meshColors: ["#000000", "#3F3F46", "#D4D4D8"],
    keywords: ['hacker', 'dark', 'code', 'hardware']
  }
];