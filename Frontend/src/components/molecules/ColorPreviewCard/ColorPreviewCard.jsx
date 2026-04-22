// src/components/molecules/ColorPreviewCard/ColorPreviewCard.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const ColorPreviewCard = ({ primaryColor, secondaryColor, accentColor, backgroundColor }) => {
  const { colors, spacing, typography, borderRadius, shadows } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px', sm: '8px', lg: '24px' };
    return fallbacks[space] || '16px';
  };

  return (
    <div
      style={{
        background: backgroundColor || '#F9FAFB',
        borderRadius: borderRadius?.lg || '12px',
        padding: getSpacing('lg'),
        marginTop: getSpacing('lg'),
        border: `1px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
      }}
    >
      <p
        style={{
          fontSize: typography?.fontSize?.sm?.size || '14px',
          fontWeight: typography?.fontWeight?.medium || 500,
          color: colors?.neutral?.[600] || '#4B5563',
          marginBottom: getSpacing('md'),
        }}
      >
        Vista previa:
      </p>

      <div
        style={{
          display: 'flex',
          gap: getSpacing('md'),
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            background: primaryColor,
            padding: `${getSpacing('sm')} ${getSpacing('md')}`,
            borderRadius: borderRadius?.md || '6px',
            color: '#FFFFFF',
            fontSize: typography?.fontSize?.sm?.size || '14px',
          }}
        >
          Botón Primario
        </div>

        <div
          style={{
            background: secondaryColor,
            padding: `${getSpacing('sm')} ${getSpacing('md')}`,
            borderRadius: borderRadius?.md || '6px',
            color: '#FFFFFF',
            fontSize: typography?.fontSize?.sm?.size || '14px',
          }}
        >
          Botón Secundario
        </div>

        <div
          style={{
            background: accentColor,
            padding: `${getSpacing('sm')} ${getSpacing('md')}`,
            borderRadius: borderRadius?.md || '6px',
            color: '#FFFFFF',
            fontSize: typography?.fontSize?.sm?.size || '14px',
          }}
        >
          Elemento de Acento
        </div>
      </div>

      <div
        style={{
          marginTop: getSpacing('md'),
          padding: getSpacing('md'),
          background: '#FFFFFF',
          borderRadius: borderRadius?.md || '6px',
          border: `1px solid ${primaryColor}`,
        }}
      >
        <p
          style={{
            color: primaryColor,
            fontWeight: typography?.fontWeight?.bold || 'bold',
            margin: 0,
          }}
        >
          Tarjeta con borde de color primario
        </p>
      </div>
    </div>
  );
};

export default ColorPreviewCard;