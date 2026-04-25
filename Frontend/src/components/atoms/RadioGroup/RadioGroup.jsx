// src/components/atoms/RadioGroup/RadioGroup.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const RadioGroup = ({ label, name, options, value, onChange }) => {
  const { colors, spacing, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { sm: '8px', md: '16px' };
    return fallbacks[space] || '8px';
  };

  return (
    <div>
      {label && (
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
      )}
      <div style={{ display: 'flex', gap: getSpacing('md') }}>
        {options.map((option) => (
          <label
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: getSpacing('sm'),
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              style={{ cursor: 'pointer' }}
            />
            <span
              style={{
                fontSize: typography?.fontSize?.sm?.size || '14px',
                color: colors?.neutral?.[700] || '#374151',
              }}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;