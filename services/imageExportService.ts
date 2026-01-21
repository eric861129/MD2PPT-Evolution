/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { SlideObject } from './parser/som';

export interface ExportOptions {
  fileName?: string;
  scale?: number;
  quality?: number;
}

/**
 * Service to export slides as a collection of images in a ZIP file.
 * This runs entirely in the browser.
 */
export class ImageExportService {
  /**
   * Captures multiple elements and packages them into a ZIP file.
   * @param elements Array of HTML elements to capture.
   * @param options Export configuration.
   */
  static async exportSlidesToZip(elements: HTMLElement[], options: ExportOptions = {}): Promise<void> {
    const { 
      fileName = 'presentation_images', 
      scale = 2, // 2x scale for high quality (LinkedIn ready)
    } = options;

    const zip = new JSZip();
    const folder = zip.folder(fileName);

    if (!folder) throw new Error("Failed to create ZIP folder");

    // Process each element
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      // Use html2canvas to capture the element
      // logging: false to keep console clean
      // useCORS: true to handle external images if possible
      // scale: for higher resolution
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: false,
        backgroundColor: null, // Transparent if element has no bg
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png', 1.0);
      });

      if (blob) {
        const index = (i + 1).toString().padStart(2, '0');
        folder.file(`slide_${index}.png`, blob);
      }
    }

    // Generate and save ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${fileName}.zip`);
  }
}
