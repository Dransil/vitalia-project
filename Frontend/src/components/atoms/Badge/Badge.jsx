// src/components/atoms/Badge/Badge.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'sm',
  style = {} 
}) => {
  const { colors, spacing, typography, borderRadius, config } = useTheme();

  const variants = {
    primary: {
      background: config?.theme?.colors?.primary || '#3B82F6',
      color: colors?.neutral?.[0] || '#FFFFFF',
    },
    success: {
      background: colors?.success?.light || '#D1FAE5',
      color: colors?.success?.dark || '#065F46',
    },
    error: {
      background: colors?.error?.light || '#FEE2E2',
      color: colors?.error?.dark || '#991B1B',
    },
    warning: {
      background: colors?.warning?.light || '#FFF3E0',
      color: colors?.warning?.dark || '#E65100',
    },
    neutral: {
      background: colors?.neutral?.[200] || '#E5E7EB',
      color: colors?.neutral?.[700] || '#374151',
    },
  };

  const getPadding = () => {
    const smallPadding = spacing?.sm ? `${spacing.sm / 2}px ${spacing.sm}px` : '4px 8px';
    const mediumPadding = spacing?.sm ? `${spacing.sm}px ${spacing.md}px` : '8px 12px';
    
    return size === 'sm' ? smallPadding : mediumPadding;
  };

  const getFontSize = () => {
    if (size === 'sm') {
      return typography?.fontSize?.xs?.size || '12px';
    }
    return typography?.fontSize?.sm?.size || '14px';
  };

  const currentVariant = variants[variant] || variants.primary;

  const badgeStyle = {
    display: 'inline-block',
    padding: getPadding(),
    background: currentVariant.background,
    color: currentVariant.color,
    borderRadius: borderRadius?.sm || '4px',
    fontSize: getFontSize(),
    fontWeight: typography?.fontWeight?.semibold || '600',
    textTransform: 'capitalize',
    ...style,
  };

  return <span style={badgeStyle}>{children}</span>;
};

export default Badge;