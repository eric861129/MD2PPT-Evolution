/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

export interface MeshGradientOptions {
  colors?: string[];
  seed?: number;
  width?: number;
  height?: number;
  blur?: number;
}

// Simple deterministic PRNG
const mulberry32 = (a: number) => {
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const generateMeshGradient = (options: MeshGradientOptions = {}): string => {
  const width = options.width || 1920;
  const height = options.height || 1080;
  const seed = options.seed || Date.now();
  const colors = options.colors || ['#4158D0', '#C850C0', '#FFCC70', '#ffffff'];
  const blur = options.blur || 100;

  const rand = mulberry32(seed);

  // Generate 6-8 gradient blobs
  const numBlobs = Math.floor(rand() * 3) + 6;
  let circles = '';

  for (let i = 0; i < numBlobs; i++) {
    const color = colors[Math.floor(rand() * colors.length)];
    const x = Math.floor(rand() * width);
    const y = Math.floor(rand() * height);
    const r = Math.floor(rand() * (width / 1.5)) + (width / 4);
    
    // SVG Radial Gradient
    // We use direct circles with fill for simplicity in stacking, or definitions.
    // To make it look "mesh-like", we often use large overlapping circles with opacity.
    
    // Using simple circle elements with blur filter is easier for SVG export 
    // than complex defs referencing.
    
    circles += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.8" />`;
  }

  // Base background rect
  const baseColor = colors[0];

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="meshBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="${baseColor}" />
  <g filter="url(#meshBlur)">
    ${circles}
  </g>
</svg>
  `.trim();
};
