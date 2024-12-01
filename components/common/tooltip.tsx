"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  maxWidth?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = '',
  position = 'top',
  delay = 200,
  maxWidth = '300px'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    maxWidth,
    zIndex: 9999,
    visibility: 'hidden',
  });
  const [isMounted, setIsMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updatePosition = () => {
    if (!containerRef.current || !tooltipRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
        y = containerRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
        y = containerRect.bottom + 8;
        break;
      case 'left':
        x = containerRect.left - tooltipRect.width - 8;
        y = containerRect.top + (containerRect.height - tooltipRect.height) / 2;
        break;
      case 'right':
        x = containerRect.right + 8;
        y = containerRect.top + (containerRect.height - tooltipRect.height) / 2;
        break;
    }

    // 防止tooltip超出视窗
    const padding = 10;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

    setTooltipStyle(prev => ({
      ...prev,
      visibility: 'visible',
      left: `${x}px`,
      top: `${y}px`,
    }));
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // 先设置为可见但透明，让浏览器完成布局计算
      setTooltipStyle(prev => ({
        ...prev,
        visibility: 'visible',
        opacity: 0,
      }));
      // 使用 RAF 确保 DOM 已更新
      requestAnimationFrame(() => {
        updatePosition();
        // 设置不透明
        setTooltipStyle(prev => ({
          ...prev,
          opacity: 1,
        }));
      });
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
    setTooltipStyle(prev => ({
      ...prev,
      visibility: 'hidden',
      opacity: 0,
    }));
  };

  useEffect(() => {
    if (isVisible) {
      const handleUpdate = () => {
        requestAnimationFrame(updatePosition);
      };

      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);

      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isVisible]);

  const tooltipContent = isVisible && content && (
    <div
      ref={tooltipRef}
      style={tooltipStyle}
      className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none transition-opacity duration-200"
    >
      {content}
    </div>
  );

  return (
    <>
      <div
        ref={containerRef}
        className={`${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isMounted && tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;
