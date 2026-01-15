import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../services/markdownParser';

describe('Markdown YAML Parsing', () => {
  it('should parse global frontmatter and separate slides by ---', () => {
    const md = `---
title: My Presentation
---
# Slide 1
Content 1
---
---
layout: grid
background: "#ff0"
---
# Slide 2
Content 2`;

    const result = parseMarkdown(md);
    
    expect(result.meta.title).toBe('My Presentation');
    // We expect 2 slides. Each slide starts with a HORIZONTAL_RULE carrying metadata.
    // In the current implementation, it uses splitBlocksToSlides later.
    // parseMarkdown returns blocks.
    
    const hrBlocks = result.blocks.filter(b => b.type === 'HORIZONTAL_RULE');
    expect(hrBlocks).toHaveLength(2);
    expect(hrBlocks[1].metadata?.layout).toBe('grid');
    expect(hrBlocks[1].metadata?.background).toBe('#ff0');
  });

  it('should handle slides without YAML blocks', () => {
    const md = `# Slide 1
---
# Slide 2`;

    const result = parseMarkdown(md);
    const hrBlocks = result.blocks.filter(b => b.type === 'HORIZONTAL_RULE');
    expect(hrBlocks).toHaveLength(2); // Initial slide + 1 separator
  });
});
