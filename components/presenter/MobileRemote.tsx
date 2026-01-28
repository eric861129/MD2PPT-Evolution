/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MonitorOff, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { RemoteControlClient } from '../../services/RemoteControlClient';

export const MobileRemote: React.FC = () => {
  const [status, setStatus] = useState('Initializing...');
  const [peerId, setPeerId] = useState<string | null>(null);
  const clientRef = useRef<RemoteControlClient | null>(null);
  const [currentSlideInfo, setCurrentSlideInfo] = useState({ index: 0, total: 0, note: '' });

  useEffect(() => {
    // Extract peer ID from URL
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const targetPeer = params.get('peer');

    if (targetPeer) {
      setPeerId(targetPeer);
      const client = new RemoteControlClient(targetPeer);
      clientRef.current = client;

      client.onStatus(setStatus);
      client.onData((data) => {
        if (data.type === 'SYNC_STATE') {
          setCurrentSlideInfo(data.payload);
        }
      });

      return () => client.close();
    } else {
      setStatus('Error: Missing Peer ID');
    }
  }, []);

  const sendAction = (action: string) => {
    clientRef.current?.sendAction(action);
  };

  const isConnected = status === 'Connected';

  return (
    <div className="fixed inset-0 bg-stone-950 text-white flex flex-col font-sans select-none">
      {/* Status Bar */}
      <div className="h-14 bg-stone-900 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <Smartphone size={18} className="text-[var(--product-primary)]" />
          <span className="text-xs font-black uppercase tracking-widest">MD2PPT Remote</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {status}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        {/* Navigation Grid */}
        <div className="grid grid-cols-2 flex-1 gap-4">
          <button
            onClick={() => sendAction('PREV')}
            disabled={!isConnected}
            aria-label="Previous Slide"
            className="flex flex-col items-center justify-center bg-stone-900 border border-white/5 rounded-3xl active:bg-[var(--product-glow)] active:scale-95 transition-all disabled:opacity-20"
          >
            <ChevronLeft size={64} className="text-stone-400" />
            <span className="text-xs font-bold text-stone-500 uppercase mt-4">Prev</span>
          </button>
          
          <button
            onClick={() => sendAction('NEXT')}
            disabled={!isConnected}
            aria-label="Next Slide"
            className="flex flex-col items-center justify-center bg-stone-900 border border-white/5 rounded-3xl active:bg-[var(--product-glow)] active:scale-95 transition-all disabled:opacity-20"
          >
            <ChevronRight size={64} className="text-[var(--product-primary)]" />
            <span className="text-xs font-bold text-[var(--product-primary)] uppercase mt-4">Next</span>
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex gap-4 h-24 shrink-0">
          <button
            onClick={() => sendAction('BLACKOUT')}
            disabled={!isConnected}
            className="flex-1 flex items-center justify-center gap-3 bg-stone-900 border border-white/5 rounded-2xl active:bg-red-500/20 transition-all disabled:opacity-20"
          >
            <MonitorOff size={24} className="text-stone-400" />
            <span className="font-bold text-sm uppercase tracking-widest">Blackout</span>
          </button>
        </div>

        {/* Notes Display */}
        <div className="h-48 bg-stone-900/50 rounded-3xl border border-white/5 p-6 overflow-y-auto shrink-0">
          <h2 className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] mb-3">Speaker Notes</h2>
          <div className="text-stone-300 text-base leading-relaxed font-medium">
            {currentSlideInfo.note || (isConnected ? 'No notes available.' : 'Connecting to host...')}
          </div>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="h-12 bg-stone-950 flex items-center justify-center border-t border-white/5 shrink-0">
        <span className="font-mono text-xs font-bold text-stone-600 tracking-tighter">
          SLIDE <span className="text-stone-400">{currentSlideInfo.index + 1}</span> / {currentSlideInfo.total || '?'}
        </span>
      </div>
    </div>
  );
};
