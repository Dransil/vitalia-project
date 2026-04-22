// src/components/organisms/ThemeCustomizer/ThemeCustomizer.jsx
import React from 'react';
import { MdColorLens } from 'react-icons/md';
import ColorPicker from '../../atoms/ColorPicker/ColorPicker';
import ToggleSwitch from '../../atoms/ToggleSwitch/ToggleSwitch';
import ThemePreview from '../ThemePreview/ThemePreview';
import { useTheme } from '../../../Config/ThemeContext';

const ThemeCustomizer = ({
  customizeEnabled,
  onToggleCustomize,
  colors: themeColors,
  onColorChange,
  background,
  onBackgroundChange,
}) => {
  const { colors, spacing, typography, borderRadius, shadows } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', md: '16px', sm: '8px', xl: '32px' };
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
        gridColumn: 'span 2',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: getSpacing('lg'),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: getSpacing('md') }}>
          <MdColorLens size={24} color={colors?.primary?.[600] || '#2563EB'} />
          <h2
            style={{
              fontSize: typography?.fontSize?.lg?.size || '18px',
              fontWeight: typography?.fontWeight?.bold || 700,
              color: colors?.neutral?.[900] || '#111827',
              margin: 0,
            }}
          >
            Personalizar Colores
          </h2>
        </div>

        <ToggleSwitch
          checked={customizeEnabled}
          onChange={onToggleCustomize}
          label=""
        />
      </div>

      <div
        style={{
          opacity: customizeEnabled ? 1 : 0.5,
          pointerEvents: customizeEnabled ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: getSpacing('xl'),
          }}
        >
          {/* Panel de selección de colores - lado izquierdo */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: getSpacing('md') }}>
              <ColorPicker
                label="Color Primario"
                value={themeColors.primary}
                onChange={onColorChange('primary')}
                disabled={!customizeEnabled}
              />

              <ColorPicker
                label="Color Secundario"
                value={themeColors.secondary}
                onChange={onColorChange('secondary')}
                disabled={!customizeEnabled}
              />

              <ColorPicker
                label="Color de Acento"
                value={themeColors.accent}
                onChange={onColorChange('accent')}
                disabled={!customizeEnabled}
              />

              <ColorPicker
                label="Color de Fondo"
                value={background}
                onChange={onBackgroundChange}
                disabled={!customizeEnabled}
              />
            </div>
          </div>

          {/* Panel de previsualización - lado derecho */}
          <div>
            <ThemePreview
              primaryColor={themeColors.primary}
              secondaryColor={themeColors.secondary}
              accentColor={themeColors.accent}
              backgroundColor={background}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: getSpacing('lg'),
          padding: getSpacing('md'),
          background: colors?.neutral?.[50] || '#F9FAFB',
          borderRadius: borderRadius?.lg || '8px',
          fontSize: typography?.fontSize?.xs?.size || '12px',
          color: colors?.neutral?.[600] || '#4B5563',
        }}
      >
        {customizeEnabled
          ? '✓ Personalizando colores. Los cambios se aplicarán al guardar.'
          : 'Usando colores predeterminados. Activa el interruptor para personalizar.'}
      </div>
    </div>
  );
};

export default ThemeCustomizer;