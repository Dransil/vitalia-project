// src/components/atoms/RadioCard/RadioCard.jsx
import React from 'react';
import { MdAccessTime } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const RadioCard = ({
  name,
  value,
  checked,
  onChange,
  title,
  subtitle,
  icon: Icon,
  disabled = false,
}) => {
  const { colors, spacing, typography, borderRadius, config } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const primaryColor = config?.theme?.colors?.primary || '#3B82F6';

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: getSpacing('md'),
    padding: getSpacing('md'),
    background: checked ? `${primaryColor}10` : (colors?.neutral?.[50] || '#F9FAFB'),
    border: `2px solid ${checked ? primaryColor : (colors?.neutral?.[200] || '#E5E7EB')}`,
    borderRadius: borderRadius?.lg || '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: '0.2s',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <label style={cardStyle}>
      <input
        type="radio"
        name={name}
        value={value}
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
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: typography?.fontSize?.md?.size || '16px',
            color: checked ? primaryColor : (colors?.neutral?.[800] || '#1F2937'),
            marginBottom: '4px',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: typography?.fontSize?.sm?.size || '14px',
              color: colors?.neutral?.[600] || '#4B5563',
            }}
          >
            {Icon && <Icon size={15} />}
            <span>{subtitle}</span>
          </div>
        )}
      </div>
    </label>
  );
};

export default RadioCard;