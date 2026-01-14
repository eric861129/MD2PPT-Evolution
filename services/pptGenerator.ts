import PptxGenJS from "pptxgenjs";
import { ParsedBlock } from "./parser/ast";

export const generatePpt = async (blocks: ParsedBlock[]): Promise<void> => {
  const pptx = new PptxGenJS();
  
  // Set Layout (Wide 16:9)
  pptx.layout = "LAYOUT_16x9";

  // Title Slide
  let slide = pptx.addSlide();
  slide.addText("MD2PPT Generated Presentation", { 
    x: 0, y: 1, w: "100%", h: 2, 
    fontSize: 36, align: "center", color: "363636" 
  });

  // TODO: Iterate blocks and generate slides
  // This is where the core logic will live
  
  await pptx.writeFile({ fileName: "Presentation.pptx" });
};
