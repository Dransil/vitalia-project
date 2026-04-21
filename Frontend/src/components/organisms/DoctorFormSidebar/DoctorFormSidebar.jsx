// src/components/organisms/DoctorFormSidebar/DoctorFormSidebar.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const DoctorFormSidebar = ({ sections, activeSection, onSectionChange }) => {
  const { colors, spacing, typography, borderRadius, shadows, config } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px', lg: '24px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const primaryColor = config?.theme?.colors?.primary || '#3B82F6';

  return (
    <div
      style={{
        background: colors?.neutral?.[0] || '#FFFFFF',
        border: `1px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
        borderRadius: borderRadius?.xl || '12px',
        overflow: 'hidden',
        boxShadow: shadows?.sm,
        position: 'sticky',
        top: '90px',
      }}
    >
      {sections.map((sec, idx) => {
        const Icon = sec.icono;
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => onSectionChange(sec.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: getSpacing('md'),
              padding: `${getSpacing('md')} ${getSpacing('lg')}`,
              background: isActive ? `${primaryColor}12` : 'transparent',
              border: 'none',
              borderLeft: isActive ? `3px solid ${primaryColor}` : '3px solid transparent',
              borderBottom: idx < sections.length - 1 ? `1px solid ${colors?.neutral?.[100] || '#F3F4F6'}` : 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: '0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = colors?.neutral?.[50] || '#F9FAFB';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon
              size={20}
              style={{
                color: isActive ? primaryColor : (colors?.neutral?.[400] || '#9CA3AF'),
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: isActive ? (typography?.fontWeight?.semibold || 600) : (typography?.fontWeight?.normal || 400),
                color: isActive ? primaryColor : (colors?.neutral?.[600] || '#4B5563'),
              }}
            >
              {sec.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DoctorFormSidebar;