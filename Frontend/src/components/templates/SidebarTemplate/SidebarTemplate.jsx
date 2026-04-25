// src/components/templates/SidebarTemplate/SidebarTemplate.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const SidebarTemplate = ({ children }) => {
  const theme = useTheme();

  return (
    <aside
      style={{
        width: '256px',
        background: theme.colors?.neutral?.[0] || '#FFFFFF',
        boxShadow: theme.shadows?.lg || '0 10px 15px -3px rgba(0,0,0,0.1)',
        borderRight: `1px solid ${theme.colors?.neutral?.[200] || '#E5E7EB'}`,
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.5s ease-in-out',
      }}
    >
      {children}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </aside>
  );
};

export default SidebarTemplate;