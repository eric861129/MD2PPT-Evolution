/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

/**
 * Replaces content in Markdown starting at a specific line index.
 * Handles single lines or whole blocks (like charts or callouts).
 * 
 * @param content Full markdown text
 * @param lineIndex 0-based line index
 * @param newContent The new string to put there
 * @returns Updated markdown
 */
export const replaceContentByLine = (content: string, lineIndex: number, newContent: string): string => {
  const lines = content.split(/\r?\n/);
  if (lineIndex < 0 || lineIndex >= lines.length) return content;

  const targetLine = lines[lineIndex].trim();
  
  // 1. Block Detection: Chart or Custom Containers (:::)
  if (targetLine.startsWith(':::')) {
    let endIndex = lineIndex + 1;
    
    if (targetLine !== ':::') {
      while (endIndex < lines.length) {
        if (lines[endIndex].trim() === ':::') {
          break;
        }
        endIndex++;
      }
      
      if (endIndex < lines.length) {
        const before = lines.slice(0, lineIndex);
        const after = lines.slice(endIndex + 1);
        return [...before, newContent, ...after].join('\n');
      }
    }
  }

  // 2. Block Detection: YAML Frontmatter (---)
  // If the target line is exactly '---', it might be the start of a YAML block
  if (targetLine === '---') {
    let endIndex = lineIndex + 1;
    while (endIndex < lines.length) {
      if (lines[endIndex].trim() === '---') {
        break;
      }
      endIndex++;
    }

    if (endIndex < lines.length) {
      const before = lines.slice(0, lineIndex);
      const after = lines.slice(endIndex + 1);
      return [...before, newContent, ...after].join('\n');
    }
  }

  // 3. Default: Single line replacement
  const before = lines.slice(0, lineIndex);
  const after = lines.slice(lineIndex + 1);
  
  // Trim newContent to ensure we don't have multiple trailing newlines
  const cleanNewContent = newContent.trim();
  
  return [...before, cleanNewContent, ...after].join('\n');
};

/**
 * Updates a specific key in the YAML frontmatter of a specific slide.
 * 
 * @param content The full Markdown content
 * @param slideIndex The 0-based index of the slide to update
 * @param key The YAML key to update (e.g., 'bgImage')
 * @param value The new value
 * @returns The updated Markdown content
 */
export const updateSlideYaml = (content: string, slideIndex: number, key: string, value: string): string => {
  // Use the same splitting logic as the parser to find slide boundaries
  // Note: This must match services/markdownParser.ts logic closely
  const rawSections = content.split(/^(?:---+|===+)$/m);
  
  // Reconstruct sections mapping to slides
  // Parser logic:
  // if (rawSections[0].trim() === "" && rawSections.length > 1) i = 1;
  // then loop...
  
  let i = 0;
  if (rawSections.length > 0 && rawSections[0].trim() === "") {
    i = 1;
  }

  const slides: { startIndex: number; endIndex: number; yamlIndex: number; yamlContent: string }[] = [];
  
  // We need to track the original indices in the split array to reconstruct later
  // Actually, split removes separators. We need to preserve them to reconstruct exactly?
  // Easier approach: Regex with capture groups to keep separators, or just identify WHICH section contains the YAML for slide X.
  
  // Let's iterate and identify logical slides
  let currentSlideIdx = 0;
  
  // To update safely, we might need a more robust parser that keeps offsets.
  // But for now, let's try to reconstruct.
  // We will re-implement a simpler version: Find the Nth slide's YAML block.
  
  // 1. Identify sections
  // Using capture group () in split keeps the separators
  const parts = content.split(/^((?:---+|===+))$/m); 
  // parts will be: [content, separator, content, separator, ...]
  
  // Logic to group parts into slides
  let currentPartIdx = 0;
  if (parts.length > 0 && parts[0].trim() === "") {
    currentPartIdx = 2; // Skip empty start + first separator? No, split keeps text before separator.
    // If content starts with ---, parts[0] is empty, parts[1] is ---.
  }

  // This is getting complicated.
  // Alternative: Regex to find the Nth "Slide Config Block".
  // A slide config block is a `--- ... ---` that is NOT just a separator.
  // But we have `===` separator too.
  
  // Let's rely on the structure:
  // Slide 0: Start of file (Global meta) or content.
  // Slide N: After Nth separator (===).
  
  // We assume slides are separated by `===`.
  const slidesContent = content.split(/^===+$/m);
  
  if (slideIndex >= slidesContent.length) return content;
  
  let targetSlide = slidesContent[slideIndex];
  
  // Check if target slide already has YAML
  const yamlMatch = targetSlide.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  
  if (yamlMatch) {
    // Has YAML, replace or append key
    const yamlBody = yamlMatch[1];
    const keyRegex = new RegExp(`^${key}:.*$`, 'm');
    let newYamlBody = '';
    
    if (keyRegex.test(yamlBody)) {
      newYamlBody = yamlBody.replace(keyRegex, `${key}: "${value}"`);
    } else {
      newYamlBody = `${yamlBody.trim()}\n${key}: "${value}"\n`;
    }
    
    targetSlide = targetSlide.replace(yamlMatch[0], `---\n${newYamlBody}---\n`);
  } else {
    // No YAML, add one
    // Be careful with leading newlines
    const cleanSlide = targetSlide.trim();
    targetSlide = `\n---\n${key}: "${value}"\n---\n\n${cleanSlide}`;
  }
  
  slidesContent[slideIndex] = targetSlide;
  // Join with standard separator, but trim ends to avoid accumulation
  return slidesContent.join('\n\n===\n'); 
};

/**
 * Updates the Global Frontmatter (Slide 0) with a curated design palette.
 * Sets the 'theme' only, following the "Professional Presentation" principle.
 */
export const updateGlobalTheme = (content: string, themeId: string, meshColors?: string[]): string => {
  const slidesContent = content.split(/^===+$/m);
  if (slidesContent.length === 0) return content;

  let globalSlide = slidesContent[0].trim();
  const yamlMatch = globalSlide.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  
  let existingYamlContent = '';
  let restOfContent = globalSlide;

  if (yamlMatch) {
    existingYamlContent = yamlMatch[1];
    restOfContent = globalSlide.replace(yamlMatch[0], '').trim();
  }

  // Filter out theme related keys
  const filteredLines = existingYamlContent.split('\n').filter(line => {
    const l = line.trim().toLowerCase();
    return l && !l.startsWith('theme:');
  });

  const newYamlLines = [
    ...filteredLines,
    `theme: ${themeId}`
  ];

  const finalYaml = `---\n${newYamlLines.join('\n')}\n---`;
  
  // Reconstruct
  slidesContent[0] = restOfContent ? `${finalYaml}\n\n${restOfContent}` : finalYaml;

  return slidesContent.map(s => s.trim()).join('\n\n===\n\n');
};
