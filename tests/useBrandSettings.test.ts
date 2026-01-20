import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBrandSettings } from '../hooks/useBrandSettings';

describe('useBrandSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default settings', () => {
    const { result } = renderHook(() => useBrandSettings());
    // Assuming these are the defaults we'll set
    expect(result.current.brandConfig.primaryColor).toBe('#3b82f6');
    expect(result.current.brandConfig.font).toBe('微軟正黑體');
  });

  it('should update primary color', () => {
    const { result } = renderHook(() => useBrandSettings());
    act(() => {
      result.current.updateBrandConfig({ primaryColor: '#ff0000' });
    });
    expect(result.current.brandConfig.primaryColor).toBe('#ff0000');
  });

  it('should persist settings to localStorage', () => {
    const { result } = renderHook(() => useBrandSettings());
    act(() => {
      result.current.updateBrandConfig({ primaryColor: '#00ff00' });
    });
    
    const saved = JSON.parse(localStorage.getItem('brand_config') || '{}');
    expect(saved.primaryColor).toBe('#00ff00');
  });

  it('should load settings from localStorage', () => {
    const config = {
      primaryColor: '#123456',
      secondaryColor: '#654321',
      accentColor: '#abcdef',
      font: '標楷體',
      logoPosition: 'bottom-right'
    };
    localStorage.setItem('brand_config', JSON.stringify(config));
    
    const { result } = renderHook(() => useBrandSettings());
    expect(result.current.brandConfig.primaryColor).toBe('#123456');
    expect(result.current.brandConfig.font).toBe('標楷體');
  });

  it('should export config as JSON string', () => {
    const { result } = renderHook(() => useBrandSettings());
    const json = result.current.exportConfig();
    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty('primaryColor');
  });

  it('should import config from JSON string', () => {
    const { result } = renderHook(() => useBrandSettings());
    const newConfig = {
      primaryColor: '#999999',
      secondaryColor: '#888888',
      accentColor: '#777777',
      font: '新細明體',
      logoPosition: 'top-left'
    };
    
    act(() => {
      result.current.importConfig(JSON.stringify(newConfig));
    });
    
    expect(result.current.brandConfig.primaryColor).toBe('#999999');
    expect(result.current.brandConfig.font).toBe('新細明體');
  });

  it('should load config from a File object', async () => {
    const { result } = renderHook(() => useBrandSettings());
    const newConfig = {
      primaryColor: '#111111',
      secondaryColor: '#222222',
      accentColor: '#333333',
      font: 'Arial',
      logoPosition: 'bottom-left'
    };
    const blob = new Blob([JSON.stringify(newConfig)], { type: 'application/json' });
    const file = new File([blob], 'brand.json', { type: 'application/json' });
    
    await act(async () => {
      await result.current.loadConfigFromFile(file);
    });
    
    expect(result.current.brandConfig.primaryColor).toBe('#111111');
  });
});
