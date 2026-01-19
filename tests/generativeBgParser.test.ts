
import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../services/markdownParser';
import { splitBlocksToSlides } from '../services/parser/slides';

describe('Generative Background Parsing', () => {
  it('should parse "bg: mesh" from frontmatter', () => {
    const markdown = `
---
bg: mesh
---
# Slide 1
    `.trim();

    const { blocks } = parseMarkdown(markdown);
    const slides = splitBlocksToSlides(blocks);
    const slide1 = slides[0];

    // The logic usually merges metadata into config or metadata
    const bg = slide1.config?.bg || slide1.metadata?.bg;
    expect(bg).toBe('mesh');
  });

  it('should parse mesh params from frontmatter', () => {
    const markdown = `
---
bg: mesh
mesh:
  colors: ["#f00", "#00f"]
  seed: 999
---
# Slide 1
    `.trim();

    const { blocks } = parseMarkdown(markdown);
    const slides = splitBlocksToSlides(blocks);
    const slide1 = slides[0];

    expect(slide1.config?.bg).toBe('mesh');
    expect(slide1.config?.mesh).toBeDefined();
    // @ts-ignore
    expect(slide1.config?.mesh.seed).toBe(999);
    // @ts-ignore
    expect(slide1.config?.mesh.colors).toEqual(["#f00", "#00f"]);
  });
});
