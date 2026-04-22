// src/components/molecules/LanguageSettings/LanguageSettings.jsx
import React from 'react';
import { MdLanguage } from 'react-icons/md';
import RadioGroup from '../../atoms/RadioGroup/RadioGroup';
import { useTheme } from '../../../Config/ThemeContext';

const LanguageSettings = ({ language, timeFormat, onLanguageChange, onTimeFormatChange }) => {
  const { colors, spacing, typography, borderRadius, shadows } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', md: '16px', sm: '8px' };
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
        <MdLanguage size={24} color={colors?.primary?.[600] || '#2563EB'} />
        <h2
          style={{
            fontSize: typography?.fontSize?.lg?.size || '18px',
            fontWeight: typography?.fontWeight?.bold || 700,
            color: colors?.neutral?.[900] || '#111827',
            margin: 0,
          }}
        >
          Idioma y Region
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: getSpacing('md') }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: typography?.fontSize?.sm?.size || '14px',
              fontWeight: typography?.fontWeight?.semibold || 600,
              color: colors?.neutral?.[900] || '#111827',
              marginBottom: getSpacing('sm'),
            }}
          >
            Idioma
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            style={{
              width: '100%',
              padding: getSpacing('md'),
              border: `2px solid ${colors?.neutral?.[300] || '#D1D5DB'}`,
              borderRadius: borderRadius?.md || '6px',
              fontSize: typography?.fontSize?.sm?.size || '14px',
              cursor: 'pointer',
            }}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <RadioGroup
          label="Formato de Hora"
          name="timeFormat"
          options={[
            { value: '12h', label: '12 horas' },
            { value: '24h', label: '24 horas' },
          ]}
          value={timeFormat}
          onChange={(e) => onTimeFormatChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default LanguageSettings;