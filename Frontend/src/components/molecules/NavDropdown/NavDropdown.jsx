// src/components/molecules/NavDropdown/NavDropdown.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const NavDropdown = ({ items, onItemClick, isOpen, hoverColor = 'primary' }) => {
  const theme = useTheme();
  
  const primaryColor = theme.config?.theme?.colors?.primary || '#0ea5e9';
  const secondaryColor = theme.config?.theme?.colors?.secondary || '#14b8a6';
  const hoverColorValue = hoverColor === 'primary' ? primaryColor : secondaryColor;

  const getColorWithOpacity = (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { md: '16px', lg: '24px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        marginTop: getSpacing('md'),
        background: theme.colors?.neutral?.[0] || '#FFFFFF',
        borderRadius: theme.borderRadius?.lg || '12px',
        overflow: 'hidden',
        animation: 'slideDown 0.3s ease-out',
        border: `1px solid ${theme.colors?.neutral?.[200] || '#E5E7EB'}`,
        boxShadow: theme.shadows?.sm || '0 1px 2px 0 rgba(0,0,0,0.05)',
      }}
    >
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.path)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: `${getSpacing('md')} ${getSpacing('lg')}`,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: getSpacing('md'),
              color: theme.colors?.neutral?.[700] || '#374151',
              transition: 'all 0.2s',
              fontSize: theme.typography?.fontSize?.sm?.size || '14px',
              fontWeight: theme.typography?.fontWeight?.medium || 500,
              borderBottom: `1px solid ${theme.colors?.neutral?.[100] || '#F3F4F6'}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = getColorWithOpacity(hoverColorValue, 0.05);
              e.currentTarget.style.color = hoverColorValue;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = theme.colors?.neutral?.[700] || '#374151';
            }}
          >
            <IconComponent size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default NavDropdown;