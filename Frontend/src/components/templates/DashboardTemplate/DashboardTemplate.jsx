// src/components/templates/DashboardTemplate/DashboardTemplate.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const DashboardTemplate = ({ title, subtitle, children }) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      <div style={{ marginBottom: spacing['2xl'] }}>
        <h1
          style={{
            fontSize: typography.fontSize['3xl'].size,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            margin: 0,
            marginBottom: spacing.md,
          }}
        >
          {title}
        </h1>
        <p style={{ color: colors.neutral[600], margin: 0 }}>
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
};

export default DashboardTemplate;