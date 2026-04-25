// src/components/organisms/SidebarNavSection/SidebarNavSection.jsx
import React from 'react';
import NavSection from '../../molecules/NavSection/NavSection';
import NavDropdown from '../../molecules/NavDropdown/NavDropdown';
import { useTheme } from '../../../Config/ThemeContext';

const SidebarNavSection = ({
  icon,
  title,
  subtitle,
  items,
  isOpen,
  onToggle,
  onNavigate,
  hoverColor = 'secondary',
  sectionStyle = 'default'
}) => {
  const theme = useTheme();

  const getSpacing = (space) => {
    if (theme.spacing?.[space]) return theme.spacing[space];
    const fallbacks = { lg: '24px' };
    return fallbacks[space] || '24px';
  };

  const sectionBackground = sectionStyle === 'gradient'
    ? `linear-gradient(to right, ${theme.colors?.primary?.[50] || '#F0F9FF'}, ${theme.colors?.secondary?.[50] || '#F0FDFA'})`
    : (theme.colors?.neutral?.[50] || '#F9FAFB');

  return (
    <div
      style={{
        padding: getSpacing('lg'),
        borderBottom: `1px solid ${theme.colors?.neutral?.[200] || '#E5E7EB'}`,
        background: sectionBackground,
      }}
    >
      <NavSection
        icon={icon}
        title={title}
        subtitle={subtitle}
        onToggle={onToggle}
        isOpen={isOpen}
      />
      <NavDropdown
        items={items}
        onItemClick={onNavigate}
        isOpen={isOpen}
        hoverColor={hoverColor}
      />
    </div>
  );
};

export default SidebarNavSection;