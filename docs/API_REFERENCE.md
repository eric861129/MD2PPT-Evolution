# API Reference - MD2PPT-Evolution

This document describes the configuration options available in the Markdown frontmatter and custom block syntax.

## Global Configuration

Global settings are defined at the very beginning of the Markdown file using YAML frontmatter.

```yaml
---
title: "Presentation Title"
author: "Author Name"
theme: "academic" # Options: amber, midnight, academic, material
---
```

| Key | Type | Description |
| :--- | :--- | :--- |
| `title` | `string` | The title of the presentation (used in PPTX metadata and filename). |
| `author` | `string` | The author of the presentation (used in PPTX metadata). |
| `theme` | `string` | The default design system to apply. |
| `bg` | `string` | Global background color (Hex) or `mesh`. |

---

## Slide-Specific Configuration

Each slide can have its own configuration block immediately following the slide separator (`===`).

```markdown
===
---
layout: two-column
background: "#f0f0f0"
transition: fade
---
```

### Layouts (`layout`)

| Value | Description |
| :--- | :--- |
| `default` | Standard layout with a title and content area. |
| `impact` | Large centered text, optimized for title slides or big statements. |
| `center` | Vertically and horizontally centered content. |
| `quote` | Stylized blockquote layout with large quotation marks. |
| `alert` | High-visibility box for warnings or key takeaways. |
| `two-column` | Automatically splits content into two side-by-side columns. |
| `grid` | Multi-column layout (requires `columns` parameter). |
| `full-bg` | Similar to impact, optimized for slides with a background image. |

### Visuals

| Key | Type | Description |
| :--- | :--- | :--- |
| `background` / `bg` | `string` | Background color (Hex like `#FFFFFF`) or `mesh` for generative gradient. |
| `bgImage` | `string` | URL or Base64 data URI for a background image. |
| `transition` | `string` | Transition effect in web preview: `fade`, `slide`, `zoom`, `none`. |
| `columns` | `number` | Number of columns for the `grid` layout (Default: 2). |

### Generative Background (`bg: mesh`)

When `bg: mesh` is used, you can fine-tune the gradient:

```yaml
bg: mesh
mesh:
  colors: ["#4158D0", "#C850C0", "#FFCC70"]
  seed: 12345
```

| Key | Type | Description |
| :--- | :--- | :--- |
| `mesh.colors` | `string[]` | Array of hex colors to use in the gradient. |
| `mesh.seed` | `number` | Random seed for the noise pattern (change to get a different look). |

---

## Custom Block Syntax

### Charts

```markdown
::: chart-bar { "title": "Monthly Sales", "showValues": true }
| Month | Sales |
| :--- | :--- |
| Jan | 100 |
| Feb | 150 |
:::
```

| Type | Description |
| :--- | :--- |
| `::: chart-bar` | Vertical bar chart. |
| `::: chart-line` | Line chart. |
| `::: chart-pie` | Pie chart (uses first data column). |
| `::: chart-area` | Area chart. |

**Parameters (JSON):**
- `title`: String
- `showValues`: Boolean
- `showLegend`: Boolean

### Column Break

In `two-column` or `grid` layouts, use `:: right ::` to manually force a break to the next column.

### Speaker Notes

Use the HTML comment syntax to add notes that only appear in the Presenter Console and PPTX notes field.

```markdown
<!-- note: Remind the audience about the Q4 growth. -->
```
