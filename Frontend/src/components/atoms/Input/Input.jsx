// src/components/atoms/Input/Input.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  error = false,
  disabled = false,
  fullWidth = true,
  style = {},
  ...props
}) => {
  const { colors, spacing, typography, borderRadius, config } = useTheme();

  const getPadding = () => {
    const mediumSpacing = spacing?.md || '12px';
    const extraLargeSpacing = spacing?.['2xl'] || '24px';
    
    if (Icon) {
      return `${mediumSpacing} ${mediumSpacing} ${mediumSpacing} ${extraLargeSpacing}`;
    }
    return `${mediumSpacing} ${mediumSpacing}`;
  };

  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: disabled ? (colors?.neutral?.[100] || '#F3F4F6') : (colors?.neutral?.[50] || '#F9FAFB'),
    border: `2px solid ${error ? (colors?.error?.main || '#EF4444') : (colors?.neutral?.[200] || '#E5E7EB')}`,
    borderRadius: borderRadius?.md || '8px',
    width: fullWidth ? '100%' : 'auto',
    transition: '0.2s',
    ...style,
  };

  const inputStyle = {
    flex: 1,
    padding: getPadding(),
    border: 'none',
    background: 'transparent',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    color: disabled ? (colors?.neutral?.[500] || '#6B7280') : (colors?.neutral?.[900] || '#111827'),
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const iconStyle = {
    position: 'absolute',
    left: spacing?.md || '12px',
    color: error ? (colors?.error?.main || '#EF4444') : (colors?.neutral?.[400] || '#9CA3AF'),
    pointerEvents: 'none',
  };

  const handleFocus = (e) => {
    if (!disabled) {
      e.target.parentElement.style.borderColor = config?.theme?.colors?.primary || '#3B82F6';
    }
  };

  const handleBlur = (e) => {
    if (!disabled) {
      e.target.parentElement.style.borderColor = error ? (colors?.error?.main || '#EF4444') : (colors?.neutral?.[200] || '#E5E7EB');
    }
  };

  return (
    <div style={inputContainerStyle}>
      {Icon && <Icon size={20} style={iconStyle} />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    </div>
  );
};

export default Input;