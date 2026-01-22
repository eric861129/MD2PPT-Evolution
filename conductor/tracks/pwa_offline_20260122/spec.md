# 規格說明書 (spec.md) - PWA 離線化與原生化 (Offline Support)

## 1. 概述 (Overview)
本功能旨在將 MD2PPT-Evolution 轉換為漸進式網路應用程式 (PWA)。透過實作 Service Worker 與應用程式資訊清單 (Manifest)，讓使用者能將本工具安裝至作業系統桌面或行動裝置，並在無網路環境下（如飛機、會議室）依然能進行簡報編輯、預覽與全螢幕演示。

## 2. 功能需求 (Functional Requirements)

### 2.1 PWA 基礎架構
- **Manifest 配置**：定義應用程式名稱、圖示 (Icons)、啟動畫面 (Splash Screen) 及主題色。
- **Service Worker 實作**：使用 `vite-plugin-pwa` 管理快取策略。
- **快取範圍 (Caching)**：
    - 核心靜態資源：JS, CSS, HTML。
    - 外部字體：快取 Google Fonts 或專案內建字體。
    - 第三方組件：快取 `Shiki` (語法高亮)、`Mermaid` (圖表渲染) 及 `Lucide` 圖標。

### 2.2 UI/UX 互動
- **安裝功能 (Installation)**：
    - 在 Header 偵測 `beforeinstallprompt` 事件。
    - 提供「安裝為桌面應用程式」按鈕 (僅在未安裝時顯示)。
- **連線狀態提示 (Connectivity Indicator)**：
    - 偵測 `navigator.onLine` 狀態.
    - 離線時在介面角落（如 Footer 或 Header 側邊）顯示「離線模式」標籤。
- **更新管理 (Update Logic)**：
    - 當 Service Worker 偵測到新版本時，觸發「提示更新」彈窗。
    - 使用者確認後，執行 `sw.skipWaiting()` 並重整頁面以啟用新版本。

### 2.3 離線功能完整性
- **編輯器功能**：確保 Markdown 編輯、實時預覽、Visual Tweaker 及圖片轉 Base64 功能在離線時皆可運作。
- **導出功能**：`pptxgenjs` 於用戶端運作，需確保相關依賴已納入快取，支援離線導出 PPTX。

## 3. 非功能需求 (Non-Functional Requirements)
- **效能**：利用預取 (Precaching) 縮短首次加載後的啟動時間。
- **空間占用**：優化快取策略，僅保留必要的字體與程式碼定義檔，避免占用過多使用者磁碟空間。

## 4. 驗收標準 (Acceptance Criteria)
1. 瀏覽器網址列出現 PWA 安裝圖示，且 Header 安裝按鈕可正常喚起系統安裝視窗。
2. 開啟飛航模式後，重新整理頁面依然能載入應用程式並進行簡報編輯。
3. 離線狀態下，代碼高亮 (Shiki) 與流程圖 (Mermaid) 依然能正確渲染。
4. 發布新版本後，使用者會收到更新提示，點擊後能無縫切換至 V0.14.2。

## 5. 超出範圍 (Out of Scope)
- 離線狀態下的 P2P 手機遙控 (因 WebRTC 訊令伺服器需連網)。
- 雲端同步功能（目前專案採資料不落地原則，僅本地儲存）。
