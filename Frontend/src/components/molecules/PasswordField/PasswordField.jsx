// src/components/molecules/PasswordField/PasswordField.jsx
import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  placeholder = '••••••••',
  error = false,
  errorMessage = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { colors, spacing, typography, borderRadius, config } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px', xs: '4px' };
    return fallbacks[space] || '16px';
  };

  const primaryColor = config?.theme?.colors?.primary || '#3B82F6';

  const inputStyle = {
    width: '100%',
    padding: `${getSpacing('md')} 40px ${getSpacing('md')} ${getSpacing('md')}`,
    border: `2px solid ${error ? (colors?.error?.main || '#EF4444') : (colors?.neutral?.[200] || '#E5E7EB')}`,
    borderRadius: borderRadius?.md || '6px',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    outline: 'none',
    boxSizing: 'border-box',
    background: colors?.neutral?.[0] || '#FFFFFF',
    color: colors?.neutral?.[900] || '#111827',
  };

  const labelStyle = {
    display: 'block',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    fontWeight: typography?.fontWeight?.semibold || 600,
    color: colors?.neutral?.[700] || '#374151',
    marginBottom: getSpacing('xs'),
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = primaryColor;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = error ? (colors?.error?.main || '#EF4444') : (colors?.neutral?.[200] || '#E5E7EB');
  };

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors?.neutral?.[500] || '#6B7280',
          }}
        >
          {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
        </button>
      </div>
      {error && errorMessage && (
        <p
          style={{
            color: colors?.error?.main || '#EF4444',
            fontSize: typography?.fontSize?.xs?.size || '12px',
            marginTop: getSpacing('xs'),
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PasswordField;