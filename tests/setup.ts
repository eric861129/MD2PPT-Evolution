import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock scrollIntoView as it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = function() {};

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock as any;
window.ResizeObserver = ResizeObserverMock as any;
