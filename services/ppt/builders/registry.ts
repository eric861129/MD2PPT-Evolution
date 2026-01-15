import { BlockType } from "../../types";
import { BlockRenderer } from "./types";
import * as Renderers from "./index";

export class RendererRegistry {
  private renderers: Map<BlockType, BlockRenderer> = new Map();

  constructor() {
    this.registerAllManual();
  }

  register(renderer: BlockRenderer): void {
    this.renderers.set(renderer.type, renderer);
  }

  getRenderer(type: BlockType): BlockRenderer | undefined {
    return this.renderers.get(type);
  }

  /**
   * Registers all renderers from the index file.
   */
  private registerAllManual(): void {
    Object.values(Renderers).forEach(renderer => {
      if (renderer && (renderer as any).type && typeof (renderer as any).render === 'function') {
        this.register(renderer as BlockRenderer);
      }
    });
  }
}

export const rendererRegistry = new RendererRegistry();
