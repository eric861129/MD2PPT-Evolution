/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Smartphone, Check } from 'lucide-react';

interface RemoteQRCodeModalProps {
  peerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const RemoteQRCodeModal: React.FC<RemoteQRCodeModalProps> = ({ peerId, isOpen, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate the remote control URL
  // Base URL (without hash) + #/remote?peer=PEER_ID
  const baseUrl = window.location.href.split('#')[0];
  const remoteUrl = `${baseUrl}#/remote?peer=${peerId}`;

  useEffect(() => {
    if (isOpen && peerId) {
      QRCode.toDataURL(remoteUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#E05D44', // MD2PPT Product Color (Coral)
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl)
        .catch(err => console.error('Failed to generate QR Code:', err));
    }
  }, [isOpen, peerId, remoteUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(remoteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-stone-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[var(--product-primary)]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[var(--product-primary)]">
            <Smartphone size={32} />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Mobile Remote</h2>
          <p className="text-stone-400 text-sm mt-2">Scan the code below to control your presentation from your phone.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl mb-6 flex justify-center">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="Remote Control QR Code" className="w-64 h-64" />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center text-stone-300">
              Generating...
            </div>
          )}
        </div>

        <button
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${copied ? 'bg-green-600 text-white' : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/10'}`}
        >
          {copied ? <Check size={18} /> : null}
          {copied ? 'Link Copied!' : 'Copy Remote Link'}
        </button>
        
        <p className="text-[10px] text-stone-600 text-center mt-4 uppercase font-bold tracking-widest">
          No Server Required | P2P Connection
        </p>
      </div>
    </div>
  );
};
