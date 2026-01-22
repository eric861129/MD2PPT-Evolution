/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */

import path from 'path';
import { readFileSync } from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      // 改用相對路徑，增加部署靈活性
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'prompt', // Prompt user for update
          includeAssets: ['logo.svg', 'robots.txt', 'apple-touch-icon.png'],
          manifest: {
            name: 'MD2PPT Evolution',
            short_name: 'MD2PPT',
            description: 'Markdown to Professional PowerPoint Converter',
            theme_color: '#1C1917',
            background_color: '#1C1917',
            display: 'standalone',
            start_url: './',
            icons: [
              {
                src: 'logo.svg',
                sizes: '192x192',
                type: 'image/svg+xml'
              },
              {
                src: 'logo.svg',
                sizes: '512x512',
                type: 'image/svg+xml'
              }
            ]
          },
          workbox: {
            // Include all static assets in precache
            globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
            // Cleanup old caches
            cleanupOutdatedCaches: true,
            // Allow large chunks (some dependencies like pptxgenjs/shiki are big)
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        __APP_VERSION__: JSON.stringify(packageJson.version),
      },
      build: {
        chunkSizeWarningLimit: 2000, // 提高警告門檻至 2MB，適配大型庫
        rollupOptions: {
          output: {
            manualChunks: {
              // 分拆大型第三方庫以優化載入與緩存
              'vendor-react': ['react', 'react-dom'],
              'vendor-utils': ['lucide-react', 'file-saver', 'i18next', 'react-i18next', 'js-yaml', 'marked'],
              'vendor-mermaid': ['mermaid'],
              'vendor-pptx': ['pptxgenjs'],
            },
          },
        },
      },
    };
});
