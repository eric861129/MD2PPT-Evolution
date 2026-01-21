import { describe, it, expect, vi } from 'vitest';
import { ImageExportService } from '../services/imageExportService';

// Mock html2canvas and jszip
vi.mock('html2canvas', () => {
  const mockCanvas = {
    toBlob: (cb: any) => cb(new Blob())
  };
  return {
    default: vi.fn().mockResolvedValue(mockCanvas)
  };
});

vi.mock('jszip', () => {
  const MockZip = function(this: any) {
    this.folder = vi.fn().mockReturnThis();
    this.file = vi.fn();
    this.generateAsync = vi.fn().mockResolvedValue(new Blob());
  };
  return {
    default: MockZip
  };
});

vi.mock('file-saver', () => ({
  saveAs: vi.fn()
}));

describe('ImageExportService', () => {
  it('should attempt to capture elements and save a zip', async () => {
    const mockElement = document.createElement('div');
    const elements = [mockElement, mockElement];
    
    await expect(ImageExportService.exportSlidesToZip(elements)).resolves.not.toThrow();
  });
});
