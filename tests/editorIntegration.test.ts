import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../services/markdownParser';
import { splitBlocksToSlides } from '../services/parser/slides';

describe('Editor Integration (Parser + SOM)', () => {
  it('should parse Markdown and produce slides with correct config from YAML', () => {
    const md = `---
title: Presentation
---
# Slide 1
===
---
layout: grid
background: "#00ff00"
---
# Slide 2`;

    const { blocks } = parseMarkdown(md);
    const slides = splitBlocksToSlides(blocks);

    expect(slides).toHaveLength(2);
    expect(slides[0].blocks[0].content).toBe('Slide 1');
    expect(slides[1].config?.layout).toBe('grid');
    expect(slides[1].config?.background).toBe('#00ff00');
    expect(slides[1].blocks[0].content).toBe('Slide 2');
  });
});
