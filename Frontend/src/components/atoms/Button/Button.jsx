// src/components/atoms/Button/Button.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  onClick, 
  icon: Icon,
  disabled = false,
  fullWidth = false,
  style = {},
  ...props 
}) => {
  const { colors, spacing, typography, borderRadius, config } = useTheme();

  const variants = {
    primary: {
      background: `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`,
      color: colors.neutral[0],
      hoverOpacity: 0.9,
    },
    secondary: {
      background: colors.neutral[200],
      color: colors.neutral[900],
      hoverBackground: colors.neutral[300],
    },
    error: {
      background: colors.error.main,
      color: colors.neutral[0],
      hoverBackground: colors.error.dark,
    },
    success: {
      background: colors.success.main,
      color: colors.neutral[0],
      hoverBackground: colors.success.dark,
    },
  };

  // Funcion para obtener el tamaño de fuente de forma segura
  const getFontSize = () => {
    switch(size) {
      case 'sm':
        return typography.fontSize?.xs?.size || '12px';
      case 'md':
        return typography.fontSize?.sm?.size || '14px';
      case 'lg':
        return typography.fontSize?.md?.size || '16px';
      default:
        return '14px';
    }
  };

  // Funcion para obtener el padding de forma segura
  const getPadding = () => {
    const baseSpacing = spacing?.sm || '8px';
    const mediumSpacing = spacing?.md || '12px';
    const largeSpacing = spacing?.lg || '16px';
    const extraLargeSpacing = spacing?.['2xl'] || '24px';

    switch(size) {
      case 'sm':
        return `${baseSpacing} ${mediumSpacing}`;
      case 'md':
        return `${mediumSpacing} ${largeSpacing}`;
      case 'lg':
        return `${largeSpacing} ${extraLargeSpacing}`;
      default:
        return `${mediumSpacing} ${largeSpacing}`;
    }
  };

  const currentVariant = variants[variant];

  const buttonStyle = {
    padding: getPadding(),
    background: currentVariant.background,
    color: currentVariant.color,
    border: 'none',
    borderRadius: borderRadius?.md || '8px',
    fontWeight: typography?.fontWeight?.semibold || '600',
    fontSize: getFontSize(),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: '0.3s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing?.sm || '8px',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  const handleMouseEnter = (e) => {
    if (!disabled && currentVariant.hoverBackground) {
      e.target.style.background = currentVariant.hoverBackground;
    } else if (!disabled && currentVariant.hoverOpacity) {
      e.target.style.opacity = currentVariant.hoverOpacity;
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && currentVariant.hoverBackground) {
      e.target.style.background = currentVariant.background;
    } else if (!disabled && currentVariant.hoverOpacity) {
      e.target.style.opacity = 1;
    }
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />}
      {children}
    </button>
  );
};

export default Button;