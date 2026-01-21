# MD2PPT AI 生成指南 (AI Generation Guide)

專案網址：https://github.com/eric861129/MD2PPT-Evolution

本指南旨在協助 AI 模型 (ChatGPT, Claude, Gemini) 生成完全相容於 **MD2PPT-Evolution v0.12+** 的 Markdown 簡報代碼。

## 1. 核心結構 (Core Structure)

### 1.1 全域設定 (Global Frontmatter)
**必須**位於文件第一行。

✅ **正確範例：**
```markdown
---
theme: amber
transition: slide
title: "簡報標題：主標題與副標題"  # 注意：字串請使用雙引號，避免冒號造成 YAML 解析錯誤
author: "講者名稱"
---
```

### 1.2 分頁符號 (Slide Separator)
使用 `===` 作為強制分頁。
**關鍵規則：**
1. `===` 前後**必須**保留一個空行。
2. `===` 之後**必須**緊接該頁的 `---` 設定區塊 (Frontmatter)。

✅ **正確範例：**
```markdown
# 第一頁內容...

===

---
layout: grid
columns: 2
---

# 第二頁內容...
```

## 2. 頁面設定 (Slide Configuration)

每一頁的頂部（`===` 之後）**必須**包含 YAML 設定。

### 支援參數
| 參數     | 說明      | 選項                                                                  |
| :------- | :-------- | :-------------------------------------------------------------------- |
| `layout` | 版面配置  | `default`, `impact`, `center`, `grid`, `two-column`, `quote`, `alert` |
| `bg`     | 背景模式  | `mesh` (網格), `#HEX` (純色), 或圖片 URL                              |
| `mesh`   | Mesh 設定 | 當 `bg: mesh` 時使用。包含 `colors` (陣列) 與 `seed` (數字)           |

### ⚠️ YAML 嚴格規範 (Strict YAML Rules)
- **字串引號**：所有文字欄位（尤其是 `title`）建議使用雙引號 `"` 包裹，以防特殊符號（如 `:`, `-`）導致解析失敗。
- **縮排**：巢狀屬性（如 `mesh` 下的 `colors`）必須使用 **2 個空格** 縮排。

✅ **Mesh 背景範例：**
```yaml
---
layout: impact
bg: mesh
mesh:
  colors: ["#FF5733", "#33FF57", "#3357FF"] # 必須是有效的 HEX 碼陣列
  seed: 12345
---
```

## 3. 元件語法 (Component Syntax)

### 3.1 圖表 (Charts)
使用 `::: chart-type` 語法。

### ⚠️ 致命錯誤預防 (Critical Syntax Rules)
1. **JSON 格式**：屬性 JSON **必須**是嚴格有效的 JSON。**屬性名稱與字串值必須使用雙引號 `"`**。禁止使用單引號 `'`。
   - ✅ 正確：`{ "title": "My Chart" }`
   - ❌ 錯誤：`{ 'title': 'My Chart' }` (JSON 解析會失敗)
2. **空行規則**：
   - `::: chart-xxx {json}` 與下方表格之間**必須空一行**。
   - 表格結束後，與結尾的 `:::` 之間**必須空一行**。

✅ **正確範例 (Correct)：**
```markdown
::: chart-pie { "title": "銷售數據", "showLegend": true }

| 季度 | 營收 |
| :--- | :--- |
| Q1   | 100  |
| Q2   | 200  |

:::
```

### 3.2 雙欄內容 (Two-Column)
當 `layout: two-column` 時，使用 `:: right ::` 分隔左右欄。

### ⚠️ 標題層級規則 (Heading Levels)
在 `grid` 或 `two-column` 佈局中：
- **H1 (#) 與 H2 (##)**：會被視為**投影片標題**，固定顯示於頂部。
- **H3 (###) 或更小**：才會進入**欄位內部**。
- **錯誤範例**：若在欄位內使用 `## 標題`，它會跑去投影片最上面，導致版面錯亂。

### ⚠️ 致命錯誤預防
**`:: right ::` 前後必須有空行**，否則會被視為普通文字。
**標題層級一致性**：左右兩側的標題層級（如 `#` 或 `##`）建議保持一致以維持美觀。

✅ **正確範例：**
```markdown
## 左側標題
左側內容...


:: right ::


## 右側標題
右側內容...
```

### 3.3 圖片處理 (Images)
若使用者未提供圖片 URL，請使用 Placeholder 服務，不要留空或編造無效網址。
- **語法**：`![Alt Text](URL)`
- **Placeholder 範例**：`https://placehold.co/600x400/2563eb/FFF?text=Image`

## 4. 設計系統 (Design System)

為了確保簡報的專業度與美感，請嚴格遵守以下視覺規範。

### 4.1 背景使用規則 (Background Strategy)
**嚴禁**每頁都使用 Mesh 背景。請依照頁面功能分配：

| 頁面類型 | Layout | 背景建議 |
| :--- | :--- | :--- |
| **封面/標題** | `default` (第一頁), `center` | ✅ **Mesh Gradient** (強烈視覺) |
| **轉場/重點** | `impact`, `alert`, `quote` | ✅ **Mesh Gradient** (強烈視覺) |
| **內容/圖表** | `two-column`, `grid`, `default` | ⬜ **純色背景** (確保閱讀性) |

**💡 專業小技巧 (v0.14.0)**：系統現在具備「視覺對比感知」，即使您在深色主題中將背景設為純白，系統也會自動將文字轉為深色，您可以大膽建議使用者混合深淺配色。

### 4.2 嚴選配色盤 (Curated Palettes Library)
**AI 請根據使用者內容的「關鍵字」或「情感」，從下方選擇最合適的一組。**

#### 🟦 科技與信任 (Tech & Trust)
| 名稱 | 關鍵字 | 建議 Theme | Mesh Colors |
| :--- | :--- | :--- | :--- |
| **Tech Blue** | 科技, 軟體, 雲端, 未來 | `midnight` | `["#0F172A", "#1E40AF", "#3B82F6"]` |
| **Ocean Depth** | 專業, 穩重, 深度, 海洋 | `academic` | `["#F0F9FF", "#0EA5E9", "#0284C7"]` |
| **FinTech Navy** | 金融, 銀行, 數據, 權威 | `academic` | `["#F1F5F9", "#334155", "#0F172A"]` |

#### 🟧 活力與溫暖 (Energy & Warmth)
| 名稱 | 關鍵字 | 建議 Theme | Mesh Colors |
| :--- | :--- | :--- | :--- |
| **Sunset Glow** | 溫暖, 活力, 希望, 夕陽 | `amber` | `["#FFF7ED", "#FB923C", "#EA580C"]` |
| **Coral Vivid** | 活潑, 年輕, 電商, 創意 | `amber` | `["#FFF1F2", "#FB7185", "#E11D48"]` |
| **Golden Hour** | 榮耀, 頒獎, 奢華, 冠軍 | `midnight` | `["#271A00", "#D97706", "#F59E0B"]` |

#### 🟩 自然與健康 (Nature & Health)
| 名稱 | 關鍵字 | 建議 Theme | Mesh Colors |
| :--- | :--- | :--- | :--- |
| **Fresh Mint** | 醫療, 健康, 環保, 清新 | `material` | `["#ECFDF5", "#10B981", "#047857"]` |
| **Deep Forest** | 永續, 生態, 露營, 戶外 | `midnight` | `["#022C22", "#166534", "#22C55E"]` |

#### 🟪 創意與神秘 (Creative & Mystery)
| 名稱 | 關鍵字 | 建議 Theme | Mesh Colors |
| :--- | :--- | :--- | :--- |
| **Cyber Neon** | 遊戲, 電競, 潮流, 區塊鏈 | `midnight` | `["#111827", "#7C3AED", "#DB2777"]` |
| **Lavender Dream** | 女性, 夢幻, 藝術, 柔和 | `academic` | `["#FAF5FF", "#C084FC", "#9333EA"]` |

#### ⬜ 極簡與現代 (Minimal & Modern)
| 名稱 | 關鍵字 | 建議 Theme | Mesh Colors |
| :--- | :--- | :--- | :--- |
| **Clean Slate** | 學術, 論文, 簡報, 純粹 | `academic` | `["#F8FAFC", "#94A3B8", "#475569"]` |
| **Dark Matter** | 駭客, 底層, 硬體, 隱密 | `midnight` | `["#000000", "#1C1917", "#44403C"]` |

## 5. AI 自我檢核表 (Self-Correction Checklist)
在輸出 Markdown 之前，請檢查：
1. [ ] 全域設定的 `theme` 是否為有效值 (`amber`, `midnight`, `academic`, `material`)？
2. [ ] 是否**只在**標題頁或重點頁使用 `bg: mesh`？
3. [ ] 內容頁 (`two-column`, `grid`) 是否保持乾淨背景？
4. [ ] `mesh.colors` 是否直接複製自上述「嚴選配色盤」？(不要自己發明顏色)
5. [ ] 圖表 `:::` 區塊與表格前後是否有空行？
6. [ ] 雙欄 `:: right ::` 前後是否有空行？
7. [ ] 雙欄內的標題是否已降級為 H3 (`###`)？
8. [ ] **代碼中是否包含「(在此需空行)」等不應出現的指示文字？（必須刪除所有指示文字）**