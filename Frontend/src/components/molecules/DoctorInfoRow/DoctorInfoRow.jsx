// src/components/molecules/DoctorInfoRow/DoctorInfoRow.jsx
import React from 'react';
import { MdEmail, MdCall } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const DoctorInfoRow = ({ email, phone }) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing.md,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        <MdEmail size={16} style={{ color: colors.neutral[500] }} />
        <span style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>
          {email}
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        <MdCall size={16} style={{ color: colors.neutral[500] }} />
        <span style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>
          {phone}
        </span>
      </div>
    </div>
  );
};

export default DoctorInfoRow;