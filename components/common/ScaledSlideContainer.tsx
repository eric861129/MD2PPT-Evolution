/**
 * MD2PPT-Evolution
 * Copyright (c) 2026 EricHuang
 * Licensed under the MIT License.
 */

import React, { useRef, useLayoutEffect, useState } from 'react';

interface ScaledSlideContainerProps {
  children: React.ReactNode;
  designWidth?: number;
  designHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ScaledSlideContainer: React.FC<ScaledSlideContainerProps> = ({ 
  children, 
  designWidth = 1200, 
  designHeight = 675,
  className = "",
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (parent) {
          const availableWidth = parent.clientWidth;
          const availableHeight = parent.clientHeight;
          
          const scaleX = availableWidth / designWidth;
          const scaleY = availableHeight / designHeight;
          
          // Use the smaller scale to ensure containment
          // Subtract a small margin (e.g., 0.95 factor) to avoid edge touching if desired, 
          // or strictly match containment.
          setScale(Math.min(scaleX, scaleY));
        }
      }
    };

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }
    
    updateScale();
    window.addEventListener('resize', updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [designWidth, designHeight]);

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <div 
        style={{
          width: designWidth,
          height: designHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative', // Ensure absolute children are contained
          // We don't set overflow hidden here strictly, relying on SlideContent's internal structure 
          // or global hidden if needed. But usually slides are fixed size canvas.
          overflow: 'hidden' 
        }}
      >
        {children}
      </div>
    </div>
  );
};
