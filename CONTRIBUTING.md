# Contributing to MD2PPT-Evolution

We're excited that you're interested in contributing! This guide will help you understand the architecture and how to add new features.

## Project Structure

- `components/`: React UI components.
- `services/`: Core logic.
    - `parser/`: Markdown to Slide Object Model (SOM) transformation.
    - `ppt/`: PowerPoint generation logic.
        - `builders/`: Individual block renderers (e.g., Table, Chart).
- `contexts/`: React Contexts for state management.
- `hooks/`: Custom React hooks.

---

## How to add a new PPT Block Renderer

If you want to support a new Markdown element in the exported PowerPoint file:

1.  **Define the Block Type**: Add a new entry to the `BlockType` enum in `services/types.ts`.
2.  **Create the Renderer**: Create a new file in `services/ppt/builders/` (e.g., `MyNewRenderer.ts`).
    ```typescript
    import { BlockRenderer } from "./types";
    import { BlockType } from "../../types";

    export const myNewRenderer: BlockRenderer = {
      type: BlockType.MY_NEW_TYPE,
      render: (block, ctx) => {
        const { slide, x, y, w } = ctx;
        // Use pptxgenjs API to add elements to 'slide'
        slide.addText(block.content, { x, y, w, ... });
        return y + 0.5; // Return the new Y position
      }
    };
    ```
3.  **Register the Renderer**: Export your new renderer in `services/ppt/builders/index.ts`. The `RendererRegistry` will automatically pick it up.

---

## How to add a new Slide Layout

1.  **Define the Layout Name**: Add your layout name to the `LayoutType` in `services/ppt/LayoutEngine.ts`.
2.  **Update SOM Transformation**: In `services/parser/som.ts`, update `transformToSOM` to handle your layout if it requires specific region mapping (e.g., 3-column layout).
3.  **Update Preview**: Add the rendering logic for your layout in `components/common/SlideContent.tsx`.
4.  **Update PPTX Generation**: Add the corresponding layout logic in `services/pptGenerator.ts` within the `generatePpt` loop.

---

## Development Workflow

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Running Tests
We use Vitest for testing. Please ensure all tests pass before submitting a PR.
```bash
npm run test
```

### Code Style
- Use TypeScript for all new code.
- Avoid using `any`; define proper interfaces.
- Follow the existing folder structure and naming conventions.
