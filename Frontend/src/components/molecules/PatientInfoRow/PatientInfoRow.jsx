// src/components/molecules/PatientInfoRow/PatientInfoRow.jsx
import React from 'react';
import { MdEmail, MdCall, MdCake } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const PatientInfoRow = ({ email, phone, age }) => {
  const { colors, spacing, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) {
      return spacing[space];
    }
    const fallbacks = {
      sm: '8px',
      md: '12px',
    };
    return fallbacks[space] || '8px';
  };

  const getFontSize = () => {
    if (typography?.fontSize?.xs?.size) {
      return typography.fontSize.xs.size;
    }
    return '12px';
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: getSpacing('md'),
        marginBottom: getSpacing('sm'),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: getSpacing('sm') }}>
        <MdEmail size={16} style={{ color: colors?.neutral?.[500] || '#6B7280' }} />
        <span style={{ fontSize: getFontSize(), color: colors?.neutral?.[600] || '#4B5563' }}>
          {email}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: getSpacing('sm') }}>
        <MdCall size={16} style={{ color: colors?.neutral?.[500] || '#6B7280' }} />
        <span style={{ fontSize: getFontSize(), color: colors?.neutral?.[600] || '#4B5563' }}>
          {phone}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: getSpacing('sm') }}>
        <MdCake size={16} style={{ color: colors?.neutral?.[500] || '#6B7280' }} />
        <span style={{ fontSize: getFontSize(), color: colors?.neutral?.[600] || '#4B5563' }}>
          {age} años
        </span>
      </div>
    </div>
  );
};

export default PatientInfoRow;