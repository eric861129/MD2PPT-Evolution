# 規格說明書 (spec.md) - 全域快捷鍵與命令面板 (Command Palette)

## 1. 概述 (Overview)
本功能旨在為 MD2PPT-Evolution 引入專業的鍵盤驅動工作流。透過整合 `kbar` 組件，提供一個以 `Ctrl + K` (或 `Cmd + K`) 喚起的命令面板，讓專業使用者無需滑鼠即可快速執行導航、插入內容、更換主題及檔案匯出等操作。

## 2. 功能需求 (Functional Requirements)

### 2.1 核心命令面板 (Command Palette)
- **觸發方式**：全域監聽 `Ctrl + K` 或 `Cmd + K`。
- **技術基礎**：使用 `kbar` 庫實作。
- **UI 結構**：
    - 頂部搜尋框。
    - 指令列表（支援分組顯示：導航、佈局、元件、系統）。
    - 最近執行的操作 (Recent Actions)。
    - 指令右側顯示對應的快捷鍵提示。

### 2.2 指令庫 (Actions Registry)
- **內容導航**：跳轉至指定序號的投影片。
- **內容插入**（整合斜線選單功能）：
    - 佈局：Grid, Two-column, Center, Impact, Quote, Alert。
    - 元件：Table, Chart (Bar/Line/Pie), Image, Note, Mermaid。
- **系統控制**：
    - 切換主題（支援搜尋現有 12 種配色）。
    - 切換深/淺色模式。
    - 切換語系 (ZH/EN)。
    - 顯示/隱藏演講者備忘錄。
- **檔案操作**：匯出 PPTX、匯出 Markdown、匯出圖片 ZIP。

### 2.3 快捷鍵系統 (Hotkeys)
- 實作一組常用的全域實體快捷鍵（不需喚起面板），例如：
    - `Alt + P`：開啟演講模式。
    - `Ctrl + S`：手動下載 Markdown 備份（雖然有自動存檔）。
    - `Alt + D`：切換深色模式。

## 3. 非功能需求 (Non-Functional Requirements)
- **效能**：搜尋與過濾必須在毫秒級反應，確保輸入流暢。
- **視覺**：面板需具備毛玻璃效果 (`backdrop-blur`)，風格與現有的琥珀/石墨主題一致。
- **可擴展性**：指令定義需模組化，方便未來新增功能。

## 4. 驗收標準 (Acceptance Criteria)
1. 按下 `Ctrl + K` 能夠正確顯示面板，且編輯器自動失去焦點以避免衝突。
2. 在面板搜尋「Midnight」並按下 Enter，能正確更換全域主題。
3. 搜尋並執行「Export PPTX」，應立即觸發下載。
4. 在面板中可以看到最近執行過的指令。
5. 實體快捷鍵（如 Alt + D）能直接生效。

## 5. 超出範圍 (Out of Scope)
- 自定義快捷鍵綁定介面（暫採硬編碼配置）。
- 跨應用的指令宏。
