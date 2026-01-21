# 技術堆疊: MD2PPT-Evolution

## 核心技術
- **程式語言**: TypeScript (~5.8)
- **前端框架**: React 19 (React DOM)
- **構建工具**: Vite 6
- **CSS 框架**: Tailwind CSS

## 關鍵功能庫
- **PowerPoint 生成**: `pptxgenjs` (v4.0+) - 提供原生圖表與表格生成能力。
- **Markdown 解析**: `marked` (AST 引擎) + `js-yaml` (配置解析)。
- **圖表預覽**: `recharts` (React 原生 SVG 圖表渲染)。
- **語法高亮**: `shiki` - 負責預處理程式碼 Token，確保預覽與 PPT 導出的一致性。
- **流程圖渲染**: `mermaid` - 支援技術架構圖的 SVG 轉換。
- **國際化**: `i18next` + `react-i18next` (支援中/英切換)。
- **資產與工具**:
    - `lucide-react`: UI 圖標系統。
    - `file-saver`: 瀏覽器端檔案下載管理。
    - `qrcode`: 支援 QR Code 生成。
    - `peerjs`: 實現 P2P WebRTC 通訊，支援手機遙控功能。

## 測試與品質保證
- **測試框架**: Vitest
- **元件測試**: React Testing Library + JSDom