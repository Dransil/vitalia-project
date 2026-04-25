// src/components/templates/SettingsTemplate/SettingsTemplate.jsx
import React from 'react';
import { MdRefresh, MdSave } from 'react-icons/md';
import Button from '../../atoms/Button/Button';
import { useTheme } from '../../../Config/ThemeContext';

const SettingsTemplate = ({ title, subtitle, children, savedMessage, onReset, onSave }) => {
  const { colors, spacing, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px', lg: '24px', '2xl': '48px' };
    return fallbacks[space] || '16px';
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      {/* Header */}
      <div style={{ marginBottom: getSpacing('2xl') }}>
        <h1
          style={{
            fontSize: typography?.fontSize?.['3xl']?.size || '32px',
            fontWeight: typography?.fontWeight?.bold || 700,
            color: colors?.neutral?.[900] || '#111827',
            marginBottom: getSpacing('md'),
          }}
        >
          {title}
        </h1>
        <p style={{ color: colors?.neutral?.[600] || '#4B5563' }}>{subtitle}</p>
      </div>

      {/* Saved message */}
      {savedMessage && (
        <div
          style={{
            padding: getSpacing('md'),
            marginBottom: getSpacing('lg'),
            backgroundColor: colors?.success?.light || '#D1FAE5',
            border: `2px solid ${colors?.success?.main || '#10B981'}`,
            color: colors?.success?.dark || '#065F46',
            borderRadius: '8px',
            fontWeight: typography?.fontWeight?.semibold || 600,
          }}
        >
          Configuracion guardada correctamente
        </div>
      )}

      {/* Content */}
      {children}

      {/* Action buttons */}
      <div
        style={{
          display: 'flex',
          gap: getSpacing('md'),
          marginTop: getSpacing('2xl'),
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="secondary" onClick={onReset} icon={MdRefresh}>
          Restaurar Predeterminados
        </Button>

        <Button variant="primary" onClick={onSave} icon={MdSave}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};

export default SettingsTemplate;