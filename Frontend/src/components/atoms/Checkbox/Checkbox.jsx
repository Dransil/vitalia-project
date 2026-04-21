// src/components/atoms/Checkbox/Checkbox.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const Checkbox = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  const { colors, spacing, typography, config } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { sm: '8px', md: '16px' };
    return fallbacks[space] || '8px';
  };

  const primaryColor = config?.theme?.colors?.primary || '#3B82F6';

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: getSpacing('sm'),
    padding: getSpacing('md'),
    background: checked ? `${primaryColor}10` : (colors?.neutral?.[50] || '#F9FAFB'),
    border: `2px solid ${checked ? primaryColor : (colors?.neutral?.[200] || '#E5E7EB')}`,
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: '0.2s',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <label style={labelStyle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '18px',
          height: '18px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          accentColor: primaryColor,
        }}
      />
      <span
        style={{
          fontSize: typography?.fontSize?.sm?.size || '14px',
          fontWeight: checked ? 600 : 400,
          color: checked ? primaryColor : (colors?.neutral?.[600] || '#4B5563'),
        }}
      >
        {label}
      </span>
    </label>
  );
};

export default Checkbox;