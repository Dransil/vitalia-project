// src/components/atoms/Logo/Logo.jsx
import React from 'react';
import { MdMedicalServices } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const Logo = () => {
  const theme = useTheme();
  
  const primaryColor = theme.config?.theme?.colors?.primary || '#0ea5e9';
  const secondaryColor = theme.config?.theme?.colors?.secondary || '#14b8a6';
  const primaryGradient = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { md: '16px', lg: '24px', xl: '32px' };
    return fallbacks[space] || '16px';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: getSpacing('md'), marginBottom: getSpacing('md') }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          background: primaryGradient,
          borderRadius: theme.borderRadius?.lg || '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors?.neutral?.[0] || '#FFFFFF',
          fontSize: '24px',
          fontWeight: theme.typography?.fontWeight?.bold || 700,
          boxShadow: theme.shadows?.medical || '0 4px 6px -1px rgba(0,0,0,0.1)',
        }}
      >
        <MdMedicalServices size={24} />
      </div>
      <div>
        <h1
          style={{
            fontSize: theme.typography?.fontSize?.lg?.size || '18px',
            fontWeight: theme.typography?.fontWeight?.bold || 700,
            color: theme.colors?.neutral?.[900] || '#111827',
            margin: 0,
          }}
        >
          Vitalia
        </h1>
        <p
          style={{
            fontSize: theme.typography?.fontSize?.xs?.size || '12px',
            color: theme.colors?.neutral?.[500] || '#6B7280',
            margin: 0,
          }}
        >
          v1.0
        </p>
      </div>
    </div>
  );
};

export default Logo;