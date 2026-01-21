import { describe, it, expect } from 'vitest';
import { replaceContentByLine } from '../services/markdownUpdater';

describe('replaceContentByLine', () => {
  const markdown = `---
title: Global
---

# Slide 1
Content here.

===

# Slide 2
::: chart-bar
| Year | Value |
|------|-------|
| 2021 | 100   |
:::
More content.`;

  it('should replace a single line (heading)', () => {
    // # Slide 1 is on line 5 (0-indexed)
    // --- (0)
    // title: Global (1)
    // --- (2)
    // (3)
    // # Slide 1 (4) -> Wait, line counting: 
    // 1: ---
    // 2: title: Global
    // 3: ---
    // 4: 
    // 5: # Slide 1
    
    const updated = replaceContentByLine(markdown, 4, "# New Title");
    expect(updated).toContain("# New Title");
    expect(updated).not.toContain("# Slide 1");
    expect(updated).toContain("Content here.");
  });

  it('should replace a block (chart)', () => {
    // ::: chart-bar starts on line 11 (10-indexed)
    const newChart = `::: chart-bar
| Year | Value |
|------|-------|
| 2021 | 500   |
:::`;
        const updated = replaceContentByLine(markdown, 10, newChart);
        expect(updated).toContain("2021 | 500");
        expect(updated).not.toContain("2021 | 100");
        expect(updated).toContain("# Slide 2");
      });
    
      it('should replace a YAML block', () => {
        const newYaml = `---
    title: Updated Global
    theme: academic
    ---`;
        // YAML starts on line 0
        const updated = replaceContentByLine(markdown, 0, newYaml);
        expect(updated).toContain("title: Updated Global");
        expect(updated).not.toContain("title: Global");
        expect(updated).toContain("# Slide 1");
      });
    });
    