// src/components/molecules/InfoCard/InfoCard.jsx
import React from 'react';
import { MdInfo } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const InfoCard = ({ version, lastSync, storageSize }) => {
  const { colors, spacing, typography, borderRadius, shadows } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', md: '16px', sm: '8px', xs: '4px' };
    return fallbacks[space] || '16px';
  };

  return (
    <div
      style={{
        background: colors?.neutral?.[0] || '#FFFFFF',
        border: `1px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
        borderRadius: borderRadius?.xl || '12px',
        padding: getSpacing('lg'),
        boxShadow: shadows?.md,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: getSpacing('md'), marginBottom: getSpacing('lg') }}>
        <MdInfo size={24} color={colors?.primary?.[600] || '#2563EB'} />
        <h2
          style={{
            fontSize: typography?.fontSize?.lg?.size || '18px',
            fontWeight: typography?.fontWeight?.bold || 700,
            color: colors?.neutral?.[900] || '#111827',
            margin: 0,
          }}
        >
          Informacion
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: getSpacing('md') }}>
        <div>
          <p
            style={{
              fontSize: typography?.fontSize?.xs?.size || '12px',
              color: colors?.neutral?.[500] || '#6B7280',
              marginBottom: getSpacing('xs'),
              margin: 0,
            }}
          >
            Version de la Aplicacion
          </p>
          <p
            style={{
              fontWeight: typography?.fontWeight?.semibold || 600,
              color: colors?.neutral?.[900] || '#111827',
              margin: 0,
            }}
          >
            {version}
          </p>
        </div>

        <div>
          <p
            style={{
              fontSize: typography?.fontSize?.xs?.size || '12px',
              color: colors?.neutral?.[500] || '#6B7280',
              marginBottom: getSpacing('xs'),
              margin: 0,
            }}
          >
            Ultima sincronizacion
          </p>
          <p
            style={{
              fontWeight: typography?.fontWeight?.semibold || 600,
              color: colors?.neutral?.[900] || '#111827',
              margin: 0,
            }}
          >
            {lastSync}
          </p>
        </div>

        <div>
          <p
            style={{
              fontSize: typography?.fontSize?.xs?.size || '12px',
              color: colors?.neutral?.[500] || '#6B7280',
              marginBottom: getSpacing('xs'),
              margin: 0,
            }}
          >
            Almacenamiento local
          </p>
          <p
            style={{
              fontWeight: typography?.fontWeight?.semibold || 600,
              color: colors?.neutral?.[900] || '#111827',
              margin: 0,
            }}
          >
            {storageSize} KB
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;