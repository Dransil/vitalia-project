// src/components/organisms/SidebarFooter/SidebarFooter.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const SidebarFooter = () => {
  const theme = useTheme();

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { md: '16px' };
    return fallbacks[space] || '16px';
  };

  return (
    <div
      style={{
        padding: getSpacing('md'),
        borderTop: `1px solid ${theme.colors?.neutral?.[200] || '#E5E7EB'}`,
        background: theme.colors?.neutral?.[50] || '#F9FAFB',
      }}
    >
      <p
        style={{
          fontSize: theme.typography?.fontSize?.xs?.size || '12px',
          color: theme.colors?.neutral?.[500] || '#6B7280',
          textAlign: 'center',
          margin: 0,
        }}
      >
        © 2024 Vitalia. Todos los derechos reservados.
      </p>
    </div>
  );
};

export default SidebarFooter;