// src/components/organisms/ThemePreview/ThemePreview.jsx
import React from 'react';
import { MdCheck, MdRefresh, MdSave, MdPerson, MdSearch } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const ThemePreview = ({ primaryColor, secondaryColor, accentColor, backgroundColor }) => {
  const { colors, spacing, typography, borderRadius, shadows } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { sm: '8px', md: '16px', lg: '24px', xs: '4px' };
    return fallbacks[space] || '16px';
  };

  // Estilos que usan los colores personalizados
  const primaryGradient = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`;

  return (
    <div
      style={{
        background: backgroundColor || '#F9FAFB',
        borderRadius: borderRadius?.lg || '12px',
        padding: getSpacing('lg'),
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
        Vista previa en tiempo real:
      </p>

      {/* Botones de ejemplo */}
      <div
        style={{
          display: 'flex',
          gap: getSpacing('md'),
          flexWrap: 'wrap',
          marginBottom: getSpacing('lg'),
        }}
      >
        <button
          style={{
            padding: `${getSpacing('sm')} ${getSpacing('md')}`,
            background: primaryGradient,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: borderRadius?.md || '6px',
            fontWeight: typography?.fontWeight?.semibold || 600,
            fontSize: typography?.fontSize?.sm?.size || '14px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: getSpacing('sm'),
            transition: '0.3s',
          }}
        >
          <MdCheck size={16} />
          Botón Primario
        </button>

        <button
          style={{
            padding: `${getSpacing('sm')} ${getSpacing('md')}`,
            background: colors?.neutral?.[200] || '#E5E7EB',
            color: colors?.neutral?.[900] || '#111827',
            border: 'none',
            borderRadius: borderRadius?.md || '6px',
            fontWeight: typography?.fontWeight?.semibold || 600,
            fontSize: typography?.fontSize?.sm?.size || '14px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: getSpacing('sm'),
          }}
        >
          <MdRefresh size={16} />
          Botón Secundario
        </button>

        <button
          style={{
            padding: `${getSpacing('sm')} ${getSpacing('md')}`,
            background: primaryColor,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: borderRadius?.md || '6px',
            fontWeight: typography?.fontWeight?.semibold || 600,
            fontSize: typography?.fontSize?.sm?.size || '14px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: getSpacing('sm'),
          }}
        >
          <MdSave size={16} />
          Botón Sólido
        </button>
      </div>

      {/* Input de ejemplo */}
      <div style={{ marginBottom: getSpacing('lg') }}>
        <label
          style={{
            display: 'block',
            fontSize: typography?.fontSize?.sm?.size || '14px',
            fontWeight: typography?.fontWeight?.semibold || 600,
            color: colors?.neutral?.[700] || '#374151',
            marginBottom: getSpacing('xs'),
          }}
        >
          Campo de texto
        </label>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: colors?.neutral?.[50] || '#F9FAFB',
            border: `2px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
            borderRadius: borderRadius?.md || '6px',
          }}
        >
          <MdSearch
            size={18}
            style={{
              position: 'absolute',
              left: getSpacing('md'),
              color: colors?.neutral?.[400] || '#9CA3AF',
            }}
          />
          <input
            type="text"
            placeholder="Buscar..."
            style={{
              flex: 1,
              padding: `${getSpacing('md')} ${getSpacing('md')} ${getSpacing('md')} ${getSpacing('xl')}`,
              border: 'none',
              background: 'transparent',
              fontSize: typography?.fontSize?.sm?.size || '14px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Tarjeta de ejemplo */}
      <div
        style={{
          background: colors?.neutral?.[0] || '#FFFFFF',
          border: `1px solid ${primaryColor}`,
          borderRadius: borderRadius?.lg || '8px',
          padding: getSpacing('md'),
          boxShadow: shadows?.sm,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: getSpacing('md'), marginBottom: getSpacing('sm') }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: borderRadius?.full || '9999px',
              background: primaryGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MdPerson size={16} color="#FFFFFF" />
          </div>
          <div>
            <h4
              style={{
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.bold || 700,
                color: colors?.neutral?.[900] || '#111827',
                margin: 0,
              }}
            >
              Doctor Ejemplo
            </h4>
            <p
              style={{
                fontSize: typography?.fontSize?.xs?.size || '12px',
                color: colors?.neutral?.[500] || '#6B7280',
                margin: 0,
              }}
            >
              Especialidad: Cardiología
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: getSpacing('sm'),
            marginTop: getSpacing('md'),
          }}
        >
          <span
            style={{
              fontSize: typography?.fontSize?.xs?.size || '12px',
              padding: `${getSpacing('xs')} ${getSpacing('sm')}`,
              background: primaryColor,
              color: '#FFFFFF',
              borderRadius: borderRadius?.sm || '4px',
            }}
          >
            Activo
          </span>
          <span
            style={{
              fontSize: typography?.fontSize?.xs?.size || '12px',
              padding: `${getSpacing('xs')} ${getSpacing('sm')}`,
              background: accentColor,
              color: '#FFFFFF',
              borderRadius: borderRadius?.sm || '4px',
            }}
          >
            Urgencias
          </span>
        </div>
      </div>

      {/* Badge de ejemplo */}
      <div
        style={{
          display: 'flex',
          gap: getSpacing('sm'),
          marginTop: getSpacing('lg'),
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontSize: typography?.fontSize?.xs?.size || '12px',
            padding: `${getSpacing('xs')} ${getSpacing('sm')}`,
            background: `${primaryColor}20`,
            color: primaryColor,
            borderRadius: borderRadius?.full || '9999px',
          }}
        >
          Badge con color primario
        </span>
        <span
          style={{
            fontSize: typography?.fontSize?.xs?.size || '12px',
            padding: `${getSpacing('xs')} ${getSpacing('sm')}`,
            background: `${secondaryColor}20`,
            color: secondaryColor,
            borderRadius: borderRadius?.full || '9999px',
          }}
        >
          Badge con color secundario
        </span>
      </div>
    </div>
  );
};

export default ThemePreview;