// src/components/molecules/FormSection/FormSection.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const FormSection = ({ title, icon: Icon, children }) => {
  const { colors, spacing, typography, config } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', md: '16px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const primaryColor = config?.theme?.colors?.primary || '#3B82F6';

  return (
    <div>
      <h3
        style={{
          fontSize: typography?.fontSize?.lg?.size || '18px',
          fontWeight: typography?.fontWeight?.bold || 700,
          color: colors?.neutral?.[900] || '#111827',
          margin: 0,
          marginBottom: getSpacing('lg'),
          paddingBottom: getSpacing('md'),
          borderBottom: `2px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
          display: 'flex',
          alignItems: 'center',
          gap: getSpacing('sm'),
        }}
      >
        {Icon && <Icon size={22} style={{ color: primaryColor }} />}
        {title}
      </h3>
      {children}
    </div>
  );
};

export default FormSection;