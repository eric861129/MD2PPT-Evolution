# MD2PPT-Evolution 🚀

[English](README_EN.md) | [繁體中文](README.md)

**The ultimate tool for converting Markdown notes into professional PowerPoint presentations.**

![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/github/actions/workflow/status/eric861129/MD2PPT-Evolution/deploy.yml)

**MD2PPT-Evolution** is a web-based presentation tool designed for developers, educators, and technical writers. It allows you to focus on content creation (Markdown) while automatically handling layout and design (PPTX). No installation required—start creating directly in your browser.

---

## ✨ Key Features

*   **⚡ Real-time Preview & Edit**: Split-pane interface with Markdown code on the left and instant slide rendering on the right.
*   **🎨 Global Theme System**: Built-in professional themes (Business, Tech, Academic, Modern) with Dark Mode and custom brand color support.
*   **🧠 Smart Command Palette**: Press `Ctrl + K` to open the command center for quick navigation, layout switching, and exporting.
*   **📊 Native Chart Conversion**: Automatically converts simple Markdown tables into editable PowerPoint charts (Bar, Line, Pie, Area).
*   **🖥️ Professional Presenter Mode**: Features a dual-screen view, speaker notes, timer, and a **P2P Mobile Remote**.
*   **📱 PWA Offline Support**: Installable as a desktop app, allowing you to create presentations anytime, even without an internet connection.
*   **🧩 Rich Layout Library**: Includes Grid, Two-Column, Quote, Alert, and various responsive layouts.
*   **🤖 AI Assistant**: Built-in prompts optimized for ChatGPT/Gemini to help you generate presentation code automatically.

### 🔒 Privacy First
*   **100% Client-Side**: All parsing and generation happen entirely within your browser.
*   **No Data Upload**: Your notes and images are **never** uploaded to any server.

---

## 🚀 Quick Start

### Online Demo
[Try it now](https://eric861129.github.io/MD2PPT-Evolution/) _(Link will be active after deployment)_

### Basic Syntax Example

```markdown
---
title: "My Presentation"
theme: academic
---

# Slide 1: Title Page
This is the opening of the presentation.

===

---
layout: two-column
---

## Key Points (Left)
- Point A
- Point B

:: right ::

## Chart (Right)

::: chart-pie { "title": "Market Share" }
| Product | Value |
| :--- | :--- |
| A    | 60   |
| B    | 40   |
:::
```

---

## 🛠️ Installation & Development

If you wish to run it locally or contribute:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/eric861129/MD2PPT-Evolution.git
    cd MD2PPT-Evolution
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The browser will automatically open `http://localhost:3000`.

---

## 📚 Documentation

*   [**User Manual & Customization Guide (ZH)**](CUSTOMIZATION.md)
    *   Learn YAML configuration parameters
    *   Master all Layout usages
    *   Charts and advanced component syntax
*   [**AI Generation Guide (ZH)**](docs/AI_GENERATION_GUIDE.md)
    *   How to let ChatGPT/Claude write perfect MD2PPT code for you
*   [**API Reference (English)**](docs/API_REFERENCE.md)
    *   Technical reference for developers and advanced users

---

## 🗺️ Roadmap

- [x] **v0.14.0**: Command Palette
- [x] **v0.14.2**: PWA Offline Support
- [x] **v0.15.0**: Custom Font Sizing
- [x] **v0.16.0**: Performance Optimization & Refactoring
- [ ] **Future**: More Generative AI integrations and Cloud Sync

## 🤝 Contributing

Contributions are welcome! If you want to add new layouts or fix bugs, please check [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

MIT © 2026 EricHuang
