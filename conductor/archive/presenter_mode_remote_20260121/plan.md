# 實作計畫: Web 演講模式與手機遙控 (Presenter Mode & Remote)

## 階段一：雙螢幕基礎架構與即時通訊同步 (Infrastructure & Sync)
本階段重點在於建立視窗開啟機制與資料同步通道。

- [x] Task: 實作通訊 Service 與單元測試 c480dcc
    - [x] 撰寫測試：驗證 `PresentationSyncService` 是否能正確封裝 `BroadcastChannel`。
    - [x] 實作：建立基於 `BroadcastChannel` 的通訊類別，處理翻頁與狀態同步指令。
- [x] Task: 實作觀眾視圖 (Audience View) 基本路徑 d5c64fa
    - [x] 撰寫測試：驗證渲染器能根據傳入的 Slides 數據正確顯示特定頁面。
    - [x] 實作：建立 `/audience` 專用渲染組件，僅包含全螢幕投影片內容。
- [x] Task: 實作視窗開啟邏輯 324add9
    - [x] 撰寫測試：驗證點擊啟動按鈕時，`window.open` 被呼叫且帶有正確參數。
    - [x] 實作：在編輯器 Header 加入「開始演講」按鈕，實作開啟觀眾視窗邏輯。
- [ ] Task: Conductor - User Manual Verification '階段一' (Protocol in workflow.md)

## 階段二：演講者主控台 (Presenter Console) UI 實作 [checkpoint: efddbe3]
本階段將打造演講者專屬的儀表板。

- [x] Task: 實作主控台佈局與縮圖預覽 4846529
    - [x] 撰寫測試：驗證「當前頁」與「下一頁」縮圖邏輯是否計算正確。
    - [x] 實作：設計主控台 UI，包含主視窗與側邊的 Next Slide 預覽。
- [x] Task: 實作備忘錄與進度顯示系統 6c95726
    - [x] 撰寫測試：驗證備忘錄解析器能從 Markdown AST 中提取註解內容。
    - [x] 實作：將備忘錄、計時器 (Timer) 與頁碼進度條整合至主控台介面。
- [x] Task: 整合主控台至主應用程式 467d258
    - [x] 撰寫測試：驗證主控台與觀眾視圖間的雙向翻頁同步。
    - [x] 實作：確保主控台翻頁時，透過 `PresentationSyncService` 通知所有視窗。
- [ ] Task: Conductor - User Manual Verification '階段二' (Protocol in workflow.md)

## 階段三：WebRTC P2P 手機遙控基礎建設 [checkpoint: d88de5b]
本階段實作 PeerJS 整合與連線握手。

- [x] Task: 實作 P2P 連線 Service cf931bf
    - [x] 撰寫測試：驗證 `RemoteControlService` 能正確處理 PeerID 生成與連線回呼。
    - [x] 實作：整合 `peerjs` 庫，實作連線初始化、接收指令等邏輯。
- [x] Task: QR Code 生成與顯示 a85e0e4
    - [x] 撰寫測試：驗證產生的 URL 包含正確的 Peer ID。
    - [x] 實作：在主控台介面加入「手機遙控」按鈕，點擊後彈出 QR Code。
- [ ] Task: Conductor - User Manual Verification '階段三' (Protocol in workflow.md)

## 階段四：手機端遙控頁面 UI 實作 [checkpoint: 76cf26f]
本階段完成最後的手機端實作。

- [x] Task: 打造手機遙控頁面 UI 5df21dc
    - [x] 撰寫測試：驗證手機端按鈕點擊後發送正確的 P2P 指令。
    - [x] 實作：實作 `/remote` 專用頁面，針對觸控優化的大按鈕、備忘錄顯示區。
- [x] Task: 實作黑屏控制與全域狀態整合 f5bc225
    - [x] 撰寫測試：驗證黑屏指令能穿透 P2P 通道並觸發觀眾視圖背景切換。
    - [x] 實作：在手機端與主控台加入黑屏切換功能。
- [ ] Task: 最終回歸測試與性能優化
    - [ ] 執行所有單元測試與整合測試。
    - [ ] 優化 P2P 連線穩定性與重新連線機制。
- [ ] Task: Conductor - User Manual Verification '階段四' (Protocol in workflow.md)
