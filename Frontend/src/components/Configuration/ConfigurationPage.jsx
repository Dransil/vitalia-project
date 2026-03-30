import React, { useState } from 'react';
import { useTheme } from '../../Config/ThemeContext';
import { MdColorLens, MdRefresh, MdSave } from 'react-icons/md';

const ConfigProject = () => {
  const { config, updateThemeConfig, colors, spacing, typography, borderRadius, shadows } = useTheme();
  const [customizeEnabled, setCustomizeEnabled] = useState(false);
  const [localColors, setLocalColors] = useState({
    primary: config.theme.colors.primary,
    secondary: config.theme.colors.secondary,
    accent: config.theme.colors.accent,
  });
  const [saved, setSaved] = useState(false);

  const handleColorChange = (colorKey, value) => {
    setLocalColors(prev => ({
      ...prev,
      [colorKey]: value,
    }));
  };

  const handleSave = () => {
    updateThemeConfig({
      ...config,
      theme: {
        ...config.theme,
        colors: localColors,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocalColors({
      primary: '#0284c7',
      secondary: '#14b8a6',
      accent: '#0ea5e9',
    });
  };

  const handleToggleCustomize = () => {
    setCustomizeEnabled(!customizeEnabled);
    if (customizeEnabled) {
      // Si se desactiva, cargar los colores actuales del sistema
      setLocalColors({
        primary: config.theme.colors.primary,
        secondary: config.theme.colors.secondary,
        accent: config.theme.colors.accent,
      });
    }
  };

  return (
    <div
      style={{
        background: colors.neutral[0],
        border: `1px solid ${colors.neutral[200]}`,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        boxShadow: shadows.md,
        maxWidth: '500px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          marginBottom: spacing.lg,
        }}
      >
        <MdColorLens size={24} color={colors.primary[600]} />
        <h2
          style={{
            fontSize: typography.fontSize.lg.size,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            margin: 0,
          }}
        >
          Configuración de Colores
        </h2>
      </div>

      {saved && (
        <div
          style={{
            padding: spacing.md,
            marginBottom: spacing.lg,
            backgroundColor: '#d1fae5',
            border: `2px solid #10b981`,
            color: '#059669',
            borderRadius: borderRadius.lg,
            fontWeight: typography.fontWeight.semibold,
            fontSize: typography.fontSize.sm.size,
          }}
        >
          Configuración guardada correctamente
        </div>
      )}

      {/* Switch de personalización */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.md,
          marginBottom: spacing.lg,
          padding: spacing.md,
          background: colors.neutral[50],
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.neutral[200]}`,
        }}
      >
        <div
          onClick={handleToggleCustomize}
          style={{
            position: 'relative',
            width: '50px',
            height: '28px',
            background: customizeEnabled ? colors.primary[600] : colors.neutral[300],
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: customizeEnabled ? '26px' : '2px',
              width: '24px',
              height: '24px',
              background: colors.neutral[0],
              borderRadius: '50%',
              transition: 'left 0.3s',
              boxShadow: shadows.sm,
            }}
          />
        </div>
        <span
          style={{
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[900],
            fontSize: typography.fontSize.sm.size,
            userSelect: 'none',
          }}
        >
          {customizeEnabled ? 'Personalización Habilitada' : 'Usar Colores del Sistema'}
        </span>
      </div>

      {/* Sección de colores - deshabilitada si switch está off */}
      <div
        style={{
          opacity: customizeEnabled ? 1 : 0.5,
          pointerEvents: customizeEnabled ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          {/* Color Primario */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                marginBottom: spacing.sm,
              }}
            >
              Color Primario
            </label>
            <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
              <input
                type="color"
                value={localColors.primary}
                onChange={e => handleColorChange('primary', e.target.value)}
                style={{
                  width: '60px',
                  height: '40px',
                  border: `2px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  cursor: 'pointer',
                }}
              />
              <span
                style={{
                  fontSize: typography.fontSize.sm.size,
                  color: colors.neutral[600],
                  fontFamily: 'monospace',
                }}
              >
                {localColors.primary}
              </span>
            </div>
          </div>

          {/* Color Secundario */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                marginBottom: spacing.sm,
              }}
            >
              Color Secundario
            </label>
            <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
              <input
                type="color"
                value={localColors.secondary}
                onChange={e => handleColorChange('secondary', e.target.value)}
                style={{
                  width: '60px',
                  height: '40px',
                  border: `2px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  cursor: 'pointer',
                }}
              />
              <span
                style={{
                  fontSize: typography.fontSize.sm.size,
                  color: colors.neutral[600],
                  fontFamily: 'monospace',
                }}
              >
                {localColors.secondary}
              </span>
            </div>
          </div>

          {/* Color Acento */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
                marginBottom: spacing.sm,
              }}
            >
              Color de Acento
            </label>
            <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
              <input
                type="color"
                value={localColors.accent}
                onChange={e => handleColorChange('accent', e.target.value)}
                style={{
                  width: '60px',
                  height: '40px',
                  border: `2px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  cursor: 'pointer',
                }}
              />
              <span
                style={{
                  fontSize: typography.fontSize.sm.size,
                  color: colors.neutral[600],
                  fontFamily: 'monospace',
                }}
              >
                {localColors.accent}
              </span>
            </div>
          </div>

          {/* Preview */}
          <div
            style={{
              padding: spacing.md,
              background: colors.neutral[50],
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.neutral[200]}`,
            }}
          >
            <p
              style={{
                fontSize: typography.fontSize.xs.size,
                color: colors.neutral[500],
                marginBottom: spacing.sm,
                margin: 0,
                marginBottom: spacing.sm,
              }}
            >
              Vista Previa
            </p>
            <div style={{ display: 'flex', gap: spacing.md }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: localColors.primary,
                  borderRadius: borderRadius.md,
                }}
              />
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: localColors.secondary,
                  borderRadius: borderRadius.md,
                }}
              />
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: localColors.accent,
                  borderRadius: borderRadius.md,
                }}
              />
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: spacing.md }}>
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                padding: spacing.md,
                background: colors.neutral[200],
                color: colors.neutral[900],
                border: 'none',
                borderRadius: borderRadius.lg,
                fontWeight: typography.fontWeight.semibold,
                cursor: 'pointer',
                transition: '0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
              }}
              onMouseEnter={e => e.target.style.background = colors.neutral[300]}
              onMouseLeave={e => e.target.style.background = colors.neutral[200]}
            >
              <MdRefresh size={18} />
              Restaurar
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: spacing.md,
                background: `linear-gradient(to right, ${colors.primary[600]}, ${colors.primary[500]})`,
                color: colors.neutral[0],
                border: 'none',
                borderRadius: borderRadius.lg,
                fontWeight: typography.fontWeight.semibold,
                cursor: 'pointer',
                transition: '0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
              }}
              onMouseEnter={e => e.target.style.opacity = '0.9'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              <MdSave size={18} />
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigProject;