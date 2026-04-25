// src/components/molecules/NavSection/NavSection.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const NavSection = ({ icon: Icon, title, subtitle, onToggle, isOpen, children }) => {
  const theme = useTheme();
  
  const primaryColor = theme.config?.theme?.colors?.primary || '#0ea5e9';
  const secondaryColor = theme.config?.theme?.colors?.secondary || '#14b8a6';
  const primaryGradient = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { xs: '4px', sm: '8px', md: '16px', lg: '24px' };
    return fallbacks[space] || '16px';
  };

  return (
    <div>
      <div style={{ cursor: 'pointer' }} onClick={onToggle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: getSpacing('md'), marginBottom: getSpacing('sm') }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: primaryGradient,
              borderRadius: theme.borderRadius?.full || '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors?.neutral?.[0] || '#FFFFFF',
            }}
          >
            <Icon size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: theme.typography?.fontSize?.xs?.size || '12px',
                color: theme.colors?.neutral?.[500] || '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: getSpacing('xs'),
                margin: 0,
              }}
            >
              {title}
            </p>
            <p
              style={{
                fontSize: theme.typography?.fontSize?.sm?.size || '14px',
                fontWeight: theme.typography?.fontWeight?.semibold || 600,
                color: theme.colors?.neutral?.[900] || '#111827',
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>
          {Icon && (
            <Icon
              size={20}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                color: theme.colors?.neutral?.[600] || '#4B5563'
              }}
            />
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default NavSection;