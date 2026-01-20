/**
 * BookPublisher MD2Docx
 * Copyright (c) 2025 EricHuang
 * Licensed under the MIT License.
 */

export enum BlockType {
  PARAGRAPH = 'PARAGRAPH',
  HEADING_1 = 'HEADING_1',
  HEADING_2 = 'HEADING_2',
  HEADING_3 = 'HEADING_3',
  CODE_BLOCK = 'CODE_BLOCK',
  MERMAID = 'MERMAID',
  QUOTE_BLOCK = 'QUOTE_BLOCK',
  CHAT_USER = 'CHAT_USER', // Legacy, to be removed or mapped
  CHAT_AI = 'CHAT_AI',     // Legacy, to be removed or mapped
  CHAT_CUSTOM = 'CHAT_CUSTOM',
  CALLOUT_TIP = 'CALLOUT_TIP',
  CALLOUT_NOTE = 'CALLOUT_NOTE',
  CALLOUT_WARNING = 'CALLOUT_WARNING',
  BULLET_LIST = 'BULLET_LIST',
  NUMBERED_LIST = 'NUMBERED_LIST',
  TABLE = 'TABLE',
  CHART = 'CHART',
  NOTE = 'NOTE',
  IMAGE = 'IMAGE',
  HORIZONTAL_RULE = 'HORIZONTAL_RULE',
  TOC = 'TOC',
  COLUMN_BREAK = 'COLUMN_BREAK'
}

export interface SlideMetadata {
  bg?: string;
  bgImage?: string;
  layout?: 'impact' | 'full-bg' | 'two-column' | 'default' | string;
  note?: string;
  cols?: number[];
  align?: 'left' | 'center' | 'right';
  big?: boolean;
  language?: string; // For code blocks
  showLineNumbers?: boolean; // For code blocks
  tokens?: any[][]; // For pre-highlighted code tokens (Shiki)
  [key: string]: any; // Allow extensibility
}

export interface ParsedBlock {
  type: BlockType;
  content: string;
  role?: string;         // For chat blocks
  alignment?: 'left' | 'right' | 'center'; // For chat blocks
  tableRows?: string[][]; // For table blocks
  sourceLine?: number;    // Starting line number in the original markdown
  startIndex?: number;    // Character index start
  endIndex?: number;      // Character index end
  metadata?: SlideMetadata;
}

export interface DocumentMeta extends SlideMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  header?: boolean; // Show header? Default true
  footer?: boolean; // Show page number footer? Default true
  theme?: string;   // Added for Theme Manager
}

export interface PptTheme {
  name: string;
  label: string;
  colors: {
    primary: string;
    background: string;
    text: string;
    accent: string;
    chart: string[];
  };
  fonts: {
    main: string;
    heading: string;
  };
}

export interface ThemeConfig {
  activeTheme: string;
  customSettings?: Partial<PptTheme>;
}

export interface ParseResult {
  blocks: ParsedBlock[];
  meta: DocumentMeta;
}

export interface BrandConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  logo?: string; // Base64
  logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}