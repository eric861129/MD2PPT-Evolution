import { createHighlighter, Highlighter } from 'shiki';

export type HighlightingTheme = 'github-dark' | 'github-light';

class HighlighterService {
  private highlighter: Highlighter | null = null;
  private initPromise: Promise<Highlighter> | null = null;
  private readonly languages = ['javascript', 'typescript', 'html', 'css', 'json', 'markdown', 'python', 'java', 'bash', 'sql'];
  private readonly themes: HighlightingTheme[] = ['github-dark', 'github-light'];

  /**
   * Initializes the highlighter if it hasn't been initialized yet.
   * Returns a promise that resolves to the highlighter instance.
   */
  async init(): Promise<Highlighter> {
    if (this.highlighter) return this.highlighter;
    if (this.initPromise) return this.initPromise;

    this.initPromise = createHighlighter({
      themes: this.themes,
      langs: this.languages
    }).then(h => {
      this.highlighter = h;
      return h;
    });

    return this.initPromise;
  }

  /**
   * Returns the highlighter instance if it's already initialized, otherwise null.
   */
  getHighlighter(): Highlighter | null {
    return this.highlighter;
  }

  /**
   * Renders code to HTML with syntax highlighting.
   */
  async codeToHtml(code: string, lang: string, isDark: boolean): Promise<string> {
    const h = await this.init();
    const theme = isDark ? 'github-dark' : 'github-light';
    
    // Normalize language
    const supportedLang = this.languages.includes(lang.toLowerCase()) ? lang.toLowerCase() : 'text';
    
    return h.codeToHtml(code, {
      lang: supportedLang,
      theme: theme
    });
  }

  /**
   * Renders code to tokens for PPTX generation.
   */
  async codeToTokens(code: string, lang: string, isDark: boolean): Promise<any> {
    const h = await this.init();
    const theme = isDark ? 'github-dark' : 'github-light';
    const supportedLang = this.languages.includes(lang.toLowerCase()) ? lang.toLowerCase() : 'text';

    try {
      return h.codeToTokens(code, {
        lang: supportedLang as any,
        theme: theme
      });
    } catch (e) {
      console.warn("Shiki codeToTokens failed", e);
      return null;
    }
  }
}

export const highlighterService = new HighlighterService();
