// src/components/atoms/LoadingSpinner/LoadingSpinner.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const LoadingSpinner = ({ 
  size = 'md',
  text = 'Cargando...',
  showText = true 
}) => {
  const { colors, spacing, typography, config } = useTheme();

  const getSizeStyles = () => {
    switch(size) {
      case 'sm':
        return { width: '24px', height: '24px', borderWidth: '3px' };
      case 'md':
        return { width: '40px', height: '40px', borderWidth: '4px' };
      case 'lg':
        return { width: '56px', height: '56px', borderWidth: '5px' };
      default:
        return { width: '40px', height: '40px', borderWidth: '4px' };
    }
  };

  const currentSize = getSizeStyles();

  const spinnerStyle = {
    width: currentSize.width,
    height: currentSize.height,
    border: `${currentSize.borderWidth} solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
    borderTop: `${currentSize.borderWidth} solid ${config?.theme?.colors?.primary || '#3B82F6'}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing?.md || '12px',
      }}
    >
      <div style={spinnerStyle} />
      {showText && (
        <p
          style={{
            color: colors?.neutral?.[600] || '#4B5563',
            fontSize: typography?.fontSize?.sm?.size || '14px',
            margin: 0,
          }}
        >
          {text}
        </p>
      )}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;