// src/components/organisms/SidebarHeader/SidebarHeader.jsx
import React from 'react';
import Logo from '../../atoms/Logo/Logo';
import { useTheme } from '../../../Config/ThemeContext';

const SidebarHeader = () => {
  const theme = useTheme();

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { lg: '24px', xl: '32px' };
    return fallbacks[space] || '24px';
  };

  return (
    <a href='/' style={{ textDecoration: 'none' }}>
      <div
        style={{
          padding: `${getSpacing('lg')} ${getSpacing('xl')}`,
          borderBottom: `1px solid ${theme.colors?.neutral?.[200] || '#E5E7EB'}`,
        }}
      >
        <Logo />
      </div>
    </a>
  );
};

export default SidebarHeader;