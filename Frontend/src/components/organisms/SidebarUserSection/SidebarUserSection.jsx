// src/components/organisms/SidebarUserSection/SidebarUserSection.jsx
import React from 'react';
import UserInfo from '../../molecules/UserInfo/UserInfo';
import NavDropdown from '../../molecules/NavDropdown/NavDropdown';
import { useTheme } from '../../../Config/ThemeContext';

const SidebarUserSection = ({ role, roleLabel, dropdownItems, isOpen, onToggle, onNavigate }) => {
  const theme = useTheme();
  
  const primaryColor = theme.config?.theme?.colors?.primary || '#0ea5e9';
  const secondaryColor = theme.config?.theme?.colors?.secondary || '#14b8a6';

  const getColorWithOpacity = (color, opacity) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { lg: '24px', sm: '8px', md: '16px' };
    return fallbacks[space] || '16px';
  };

  const getRoleSpecificLabel = () => {
    const labels = {
      doctor: 'Medicina',
      dentist: 'Odontología',
      psychologist: 'Psicología'
    };
    return labels[role] || role;
  };

  return (
    <div
      style={{
        padding: getSpacing('lg'),
        borderBottom: `1px solid ${theme.colors?.neutral?.[200] || '#E5E7EB'}`,
        background: `linear-gradient(to right, ${getColorWithOpacity(primaryColor, 0.05)}, ${getColorWithOpacity(secondaryColor, 0.05)})`,
      }}
    >
      <UserInfo
        role={role}
        roleLabel={roleLabel}
        onToggle={onToggle}
        isOpen={isOpen}
      />

      <div
        style={{
          display: 'inline-block',
          padding: `${getSpacing('sm')} ${getSpacing('md')}`,
          background: getColorWithOpacity(primaryColor, 0.1),
          color: primaryColor,
          borderRadius: theme.borderRadius?.full || '9999px',
          fontSize: theme.typography?.fontSize?.xs?.size || '12px',
          fontWeight: theme.typography?.fontWeight?.semibold || 600,
          marginTop: getSpacing('sm'),
        }}
      >
        {getRoleSpecificLabel()}
      </div>

      <NavDropdown
        items={dropdownItems}
        onItemClick={onNavigate}
        isOpen={isOpen}
        hoverColor="primary"
      />
    </div>
  );
};

export default SidebarUserSection;