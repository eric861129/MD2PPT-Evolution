/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

export enum SyncAction {
  NEXT_SLIDE = 'NEXT_SLIDE',
  PREV_SLIDE = 'PREV_SLIDE',
  GOTO_SLIDE = 'GOTO_SLIDE',
  UPDATE_NOTES = 'UPDATE_NOTES',
  REQUEST_SYNC = 'REQUEST_SYNC',
  SYNC_STATE = 'SYNC_STATE',
  BLACK_SCREEN = 'BLACK_SCREEN'
}

export interface SyncMessage {
  type: SyncAction;
  payload?: any;
}

export type MessageHandler = (message: SyncMessage) => void;

export class PresentationSyncService {
  private channel: BroadcastChannel;
  private messageHandlers: MessageHandler[] = [];

  constructor(channelName: string = 'md2ppt_presentation_sync') {
    this.channel = new BroadcastChannel(channelName);
    
    this.channel.onmessage = (event) => {
      if (event.data) {
        this.notifyHandlers(event.data);
      }
    };
  }

  public sendMessage(message: SyncMessage): void {
    this.channel.postMessage(message);
  }

  public onMessage(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  public offMessage(handler: MessageHandler): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  public close(): void {
    this.channel.close();
    this.messageHandlers = [];
  }

  private notifyHandlers(message: SyncMessage): void {
    this.messageHandlers.forEach(handler => handler(message));
  }
}
