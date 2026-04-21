// src/components/atoms/Select/Select.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const Select = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccione una opcion',
  error = false,
  disabled = false,
  fullWidth = true,
  style = {},
  ...props
}) => {
  const { colors, spacing, typography, borderRadius, config } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px' };
    return fallbacks[space] || '16px';
  };

  const selectStyle = {
    width: fullWidth ? '100%' : 'auto',
    padding: getSpacing('md'),
    border: `2px solid ${error ? (colors?.error?.main || '#EF4444') : (colors?.neutral?.[200] || '#E5E7EB')}`,
    borderRadius: borderRadius?.md || '6px',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    outline: 'none',
    boxSizing: 'border-box',
    background: disabled ? (colors?.neutral?.[100] || '#F3F4F6') : (colors?.neutral?.[0] || '#FFFFFF'),
    color: disabled ? (colors?.neutral?.[500] || '#6B7280') : (colors?.neutral?.[900] || '#111827'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  const handleFocus = (e) => {
    if (!disabled) {
      e.target.style.borderColor = config?.theme?.colors?.primary || '#3B82F6';
    }
  };

  const handleBlur = (e) => {
    if (!disabled) {
      e.target.style.borderColor = error ? (colors?.error?.main || '#EF4444') : (colors?.neutral?.[200] || '#E5E7EB');
    }
  };

  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={selectStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;