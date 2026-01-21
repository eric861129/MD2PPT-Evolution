import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../services/markdownParser';
import { BlockType } from '../services/types';

describe('Boundary Cases - Markdown Parsing', () => {
  
  it('should handle multiple :: right :: separators by creating multiple column breaks', () => {
    const markdown = `
# Multi-column Slide

Left

:: right ::

Middle

:: right ::

Right
`;
    const { blocks } = parseMarkdown(markdown);
    const columnBreaks = blocks.filter(b => b.type === BlockType.COLUMN_BREAK);
    expect(columnBreaks).toHaveLength(2);
    
    const paragraphs = blocks.filter(b => b.type === BlockType.PARAGRAPH);
    expect(paragraphs[0].content).toContain('Left');
    expect(paragraphs[1].content).toContain('Middle');
    expect(paragraphs[2].content).toContain('Right');
  });

  it('should handle invalid JSON in chart containers gracefully', () => {
    const markdown = `
::: chart-bar { "invalid": json }

| A | B |
|---|---|
| 1 | 2 |

:::
`;
    // Should not crash and should still identify it as a chart (or at least preserve content)
    const { blocks } = parseMarkdown(markdown);
    const chartBlock = blocks.find(b => b.type === BlockType.CHART);
    expect(chartBlock).toBeDefined();
    // Default config should be empty object or handle error
    expect(chartBlock?.metadata?.chartType).toBe('bar');
  });

  it('should parse extremely long content without crashing', () => {
    const longText = 'Word '.repeat(10000).trim();
    const markdown = `# Title\n\n${longText}`;
    
    const { blocks } = parseMarkdown(markdown);
    // blocks[0] = HR, blocks[1] = Heading, blocks[2] = Paragraph
    expect(blocks.length).toBeGreaterThan(2);
    expect(blocks[2].content).toBe(longText);
  });

  it('should handle empty slides (multiple separators)', () => {
    const markdown = `
Slide 1
===
===
Slide 3
`;
    const { blocks } = parseMarkdown(markdown);
    // Should have 3 HORIZONTAL_RULE blocks (Slide 1, Slide 2 (empty), Slide 3)
    const hrs = blocks.filter(b => b.type === BlockType.HORIZONTAL_RULE);
    expect(hrs).toHaveLength(3);
  });

  it('should handle missing closing ::: for charts by not merging', () => {
    const markdown = `
::: chart-bar
| A | B |
|---|---|
| 1 | 2 |

Next Paragraph
`;
    const { blocks } = parseMarkdown(markdown);
    // Should NOT be a CHART block because it's missing the end marker
    const chartBlock = blocks.find(b => b.type === BlockType.CHART);
    expect(chartBlock).toBeUndefined();
    
    // Should be paragraphs and a table
    expect(blocks.some(b => b.type === BlockType.TABLE)).toBe(true);
  });
});
