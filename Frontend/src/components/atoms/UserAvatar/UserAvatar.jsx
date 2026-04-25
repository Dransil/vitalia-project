// src/components/atoms/UserAvatar/UserAvatar.jsx
import React from 'react';
import { MdPerson } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const UserAvatar = ({ size = 48 }) => {
  const theme = useTheme();
  
  const primaryColor = theme.config?.theme?.colors?.primary || '#0ea5e9';
  const secondaryColor = theme.config?.theme?.colors?.secondary || '#14b8a6';
  const primaryGradient = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: primaryGradient,
        borderRadius: theme.borderRadius?.full || '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors?.neutral?.[0] || '#FFFFFF',
      }}
    >
      <MdPerson size={size * 0.6} />
    </div>
  );
};

export default UserAvatar;