// src/components/atoms/NavButton/NavButton.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const NavButton = ({ icon: Icon, label, isActive = false, onClick, variant = 'primary' }) => {
  const theme = useTheme();
  
  const primaryColor = theme.config?.theme?.colors?.primary || '#0ea5e9';
  const secondaryColor = theme.config?.theme?.colors?.secondary || '#14b8a6';
  const buttonGradient = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`;

  const getColorWithOpacity = (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { md: '16px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const baseStyle = {
    width: '100%',
    textAlign: 'left',
    padding: `${getSpacing('md')} ${getSpacing('md')}`,
    borderRadius: theme.borderRadius?.lg || '12px',
    fontWeight: theme.typography?.fontWeight?.semibold || 600,
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: getSpacing('md'),
    fontSize: theme.typography?.fontSize?.sm?.size || '14px',
  };

  const activeStyle = {
    background: buttonGradient,
    color: theme.colors?.neutral?.[0] || '#FFFFFF',
    boxShadow: theme.shadows?.medical || '0 4px 6px -1px rgba(0,0,0,0.1)',
  };

  const inactiveStyle = {
    background: 'transparent',
    color: theme.colors?.neutral?.[600] || '#4B5563',
  };

  const handleMouseEnter = (e) => {
    if (!isActive) {
      e.currentTarget.style.background = getColorWithOpacity(primaryColor, 0.05);
      e.currentTarget.style.color = primaryColor;
    }
  };

  const handleMouseLeave = (e) => {
    if (!isActive) {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = theme.colors?.neutral?.[600] || '#4B5563';
    }
  };

  return (
    <button
      onClick={onClick}
      style={{
        ...baseStyle,
        ...(isActive ? activeStyle : inactiveStyle),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {Icon && <Icon size={20} />}
      <span>{label}</span>
    </button>
  );
};

export default NavButton;