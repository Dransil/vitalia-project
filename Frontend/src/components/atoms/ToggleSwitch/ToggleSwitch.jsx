// src/components/atoms/ToggleSwitch/ToggleSwitch.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const ToggleSwitch = ({ checked, onChange, label, description }) => {
  const { colors, spacing, typography, config } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px', sm: '8px', xs: '4px' };
    return fallbacks[space] || '16px';
  };

  const primaryColor = config?.theme?.colors?.primary || '#3B82F6';

  return (
    <div
      onClick={onChange}
      style={{
        padding: getSpacing('md'),
        background: checked ? `${primaryColor}08` : (colors?.neutral?.[50] || '#F9FAFB'),
        border: `2px solid ${checked ? primaryColor : (colors?.neutral?.[200] || '#E5E7EB')}`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: '0.2s',
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontWeight: typography?.fontWeight?.semibold || 600,
            fontSize: typography?.fontSize?.sm?.size || '14px',
            color: checked ? primaryColor : (colors?.neutral?.[700] || '#374151'),
          }}
        >
          {label}
        </p>
        {description && (
          <p
            style={{
              margin: 0,
              fontSize: typography?.fontSize?.xs?.size || '12px',
              color: colors?.neutral?.[500] || '#6B7280',
              marginTop: '2px',
            }}
          >
            {description}
          </p>
        )}
      </div>
      <div
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: checked ? primaryColor : (colors?.neutral?.[300] || '#D1D5DB'),
          position: 'relative',
          transition: '0.3s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: checked ? '23px' : '3px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#FFFFFF',
            transition: '0.3s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;