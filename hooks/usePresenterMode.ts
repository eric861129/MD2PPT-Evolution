/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import { useCallback, useRef } from 'react';
import { PresentationSyncService } from '../services/PresentationSyncService';

export const usePresenterMode = () => {
  const syncServiceRef = useRef<PresentationSyncService | null>(null);

  const startPresentation = useCallback(() => {
    // 1. Initialize Sync Service
    if (!syncServiceRef.current) {
        syncServiceRef.current = new PresentationSyncService();
    }

    // 2. Determine the URL for the audience view
    // In dev: /#/audience or similar. In prod (GitHub Pages): /repo-name/#/audience
    // We'll use a hash-based approach for compatibility.
    const baseUrl = window.location.href.split('#')[0];
    const audienceUrl = `${baseUrl}#/audience`;

    // 3. Open the new window
    window.open(audienceUrl, 'AudienceWindow', 'width=1280,height=720,menubar=no,toolbar=no');
    
    // 4. Navigate the CURRENT window to /presenter
    window.location.hash = '#/presenter';
  }, []);

  return {
    startPresentation
  };
};
