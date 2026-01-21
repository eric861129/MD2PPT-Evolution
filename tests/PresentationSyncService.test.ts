import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PresentationSyncService, SyncMessage, SyncAction } from '../services/PresentationSyncService';

// Mock BroadcastChannel
const broadcastChannelMock = {
  postMessage: vi.fn(),
  close: vi.fn(),
  onmessage: null as any,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Use a class-like mock structure
const MockBroadcastChannel = vi.fn(function() {
  return broadcastChannelMock;
});
global.BroadcastChannel = MockBroadcastChannel as any;


describe('PresentationSyncService', () => {
  let service: PresentationSyncService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PresentationSyncService('test-channel');
  });

  afterEach(() => {
    service.close();
  });

  it('should initialize BroadcastChannel with the correct name', () => {
    expect(global.BroadcastChannel).toHaveBeenCalledWith('test-channel');
  });

  it('should send a sync message via postMessage', () => {
    const message: SyncMessage = {
      type: SyncAction.GOTO_SLIDE,
      payload: { index: 5 }
    };
    service.sendMessage(message);
    expect(broadcastChannelMock.postMessage).toHaveBeenCalledWith(message);
  });

  it('should register a message handler and trigger it when a message is received', () => {
    const handler = vi.fn();
    service.onMessage(handler);

    // Simulate receiving a message
    const messageEvent = new MessageEvent('message', {
      data: { type: SyncAction.NEXT_SLIDE }
    });
    
    // Trigger the onmessage handler if it was assigned directly
    if (broadcastChannelMock.onmessage) {
      broadcastChannelMock.onmessage(messageEvent);
    } 
    // Or if listeners were used (depending on implementation, we'll assume direct property for simplicity first, or mimic event listener)
    
    expect(handler).toHaveBeenCalledWith({ type: SyncAction.NEXT_SLIDE });
  });

  it('should close the channel when requested', () => {
    service.close();
    expect(broadcastChannelMock.close).toHaveBeenCalled();
  });
});
