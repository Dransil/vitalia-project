// src/components/atoms/ColorPicker/ColorPicker.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const ColorPicker = ({ label, value, onChange, disabled = false }) => {
  const { colors, spacing, typography, borderRadius } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { sm: '8px', md: '16px' };
    return fallbacks[space] || '8px';
  };

  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: typography?.fontSize?.sm?.size || '14px',
          fontWeight: typography?.fontWeight?.semibold || 600,
          color: colors?.neutral?.[900] || '#111827',
          marginBottom: getSpacing('sm'),
        }}
      >
        {label}
      </label>
      <div style={{ display: 'flex', gap: getSpacing('md'), alignItems: 'center' }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: '60px',
            height: '40px',
            border: `2px solid ${colors?.neutral?.[300] || '#D1D5DB'}`,
            borderRadius: borderRadius?.md || '6px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
        />
        <span
          style={{
            fontSize: typography?.fontSize?.sm?.size || '14px',
            color: colors?.neutral?.[600] || '#4B5563',
            fontFamily: 'monospace',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

export default ColorPicker;