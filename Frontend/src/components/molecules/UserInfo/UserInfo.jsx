// src/components/molecules/UserInfo/UserInfo.jsx
import React from 'react';
import { MdDashboard } from 'react-icons/md';
import UserAvatar from '../../atoms/UserAvatar/UserAvatar';
import { useTheme } from '../../../Config/ThemeContext';

const UserInfo = ({ role, roleLabel, onToggle, isOpen }) => {
  const theme = useTheme();

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { xs: '4px', sm: '8px', md: '16px' };
    return fallbacks[space] || '8px';
  };

  return (
    <div style={{ cursor: 'pointer' }} onClick={onToggle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: getSpacing('md'), marginBottom: getSpacing('sm') }}>
        <UserAvatar size={48} />
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
            Persona
          </p>
          <p
            style={{
              fontSize: theme.typography?.fontSize?.sm?.size || '14px',
              fontWeight: theme.typography?.fontWeight?.semibold || 600,
              color: theme.colors?.neutral?.[900] || '#111827',
              margin: 0,
            }}
          >
            {roleLabel}
          </p>
        </div>
        <MdDashboard
          size={20}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            color: theme.colors?.neutral?.[600] || '#4B5563'
          }}
        />
      </div>
    </div>
  );
};

export default UserInfo;