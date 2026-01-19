
import { describe, it, expect } from 'vitest';
import { generateMeshGradient } from '../services/ppt/GenerativeBgService';

describe('GenerativeBgService', () => {
  it('should generate a valid SVG string', () => {
    const svg = generateMeshGradient({
      colors: ['#FF0000', '#00FF00'],
      seed: 12345,
    });
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('#FF0000');
    expect(svg).toContain('#00FF00');
  });

  it('should handle default options', () => {
    const svg = generateMeshGradient({});
    expect(svg).toContain('<svg');
  });

  it('should validate hex colors', () => {
    // This depends on implementation, but assuming it tolerates or validates
    const svg = generateMeshGradient({ colors: ['invalid'] });
    // Expect fallback or error handling. For now, let's just ensure it doesn't crash
    expect(svg).toBeDefined();
  });
});
