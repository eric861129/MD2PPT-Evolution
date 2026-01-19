/**
 * MD2PPT-Evolution
 * Caret Position Utility
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 * 
 * Helper to get the (x, y) coordinates of the caret in a textarea.
 * Based on the mirror-div technique.
 */

export interface CaretPosition {
  top: number;
  left: number;
  lineHeight: number;
}

/**
 * Calculates the absolute coordinates of the caret in a textarea.
 * @param element The textarea element
 * @param position The character index of the caret
 */
export function getCaretCoordinates(element: HTMLTextAreaElement, position: number): CaretPosition {
  const div = document.createElement('div');
  const style = window.getComputedStyle(element);

  // Copy textarea styles to the ghost div
  const properties = [
    'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderStyle',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily',
    'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing', 'tabSize', 'MozTabSize'
  ];

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';
  div.style.top = '0';
  div.style.left = '0';

  properties.forEach(prop => {
    // @ts-ignore
    div.style[prop] = style[prop];
  });

  // Ensure same content up to caret
  div.textContent = element.value.substring(0, position);
  
  const span = document.createElement('span');
  // Need some text content for the span to have dimensions
  span.textContent = element.value.substring(position, position + 1) || '.';
  div.appendChild(span);

  document.body.appendChild(div);
  
  const { offsetTop: top, offsetLeft: left } = span;
  const lineHeight = parseInt(style.lineHeight) || parseInt(style.fontSize) * 1.2;
  
  // Account for textarea position on page and its internal scroll
  const elementRect = element.getBoundingClientRect();
  const absoluteTop = elementRect.top + top - element.scrollTop;
  const absoluteLeft = elementRect.left + left - element.scrollLeft;

  document.body.removeChild(div);

  return { 
    top: absoluteTop, 
    left: absoluteLeft, 
    lineHeight 
  };
}
