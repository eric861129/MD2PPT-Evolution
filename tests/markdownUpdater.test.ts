import { describe, it, expect } from 'vitest';
import { replaceContentByLine, updateElementAttribute } from '../services/markdownUpdater';

describe('updateElementAttribute', () => {
  it('should append a new size attribute when none exists', () => {
    const input = '# Heading';
    const output = updateElementAttribute(input, 'size', 48);
    expect(output).toBe('# Heading {size=48}');
  });

  it('should update an existing size attribute', () => {
    const input = '### Subtitle {size=24}';
    const output = updateElementAttribute(input, 'size', 32);
    expect(output).toBe('### Subtitle {size=32}');
  });

  it('should preserve other attributes when updating size', () => {
    const input = 'Some text {color=red size=20}';
    const output = updateElementAttribute(input, 'size', 25);
    expect(output).toBe('Some text {color=red size=25}');
  });

  it('should add size to existing tags without it', () => {
    const input = 'ListItem {bold=true}';
    const output = updateElementAttribute(input, 'size', 18);
    expect(output).toBe('ListItem {bold=true size=18}');
  });
});

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
    