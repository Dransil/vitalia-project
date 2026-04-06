import React, { useState } from 'react';
import { useTheme } from '../../Config/ThemeContext.jsx';
import { defaultConfig } from '../../Config/ConfigStorage.js';

const TestColors = () => {
  const { config, colors, spacing, typography, borderRadius, shadows } = useTheme();
  const [useCustomColors, setUseCustomColors] = useState(true);

  const displayColors = useCustomColors ? config.theme.colors : defaultConfig.theme.colors;

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
      <h2
        style={{
          fontSize: typography.fontSize.lg.size,
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          marginBottom: spacing.lg,
          margin: 0,
          marginBottom: spacing.md,
        }}
      >
        Prueba de Colores
      </h2>

    
    
        

      {/* Información */}
      <div
        style={{
          marginBottom: spacing.lg,
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
            margin: 0,
            marginBottom: spacing.sm,
          }}
        >
          Modo Actual
        </p>
        <p
          style={{
            fontSize: typography.fontSize.sm.size,
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[900],
            margin: 0,
          }}
        >
          {useCustomColors ? 'Mostrando colores guardados por el usuario' : 'Mostrando colores por defecto'}
        </p>
      </div>

      {/* Valores actuales */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {/* Color Primario */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            padding: spacing.md,
            background: colors.neutral[50],
            borderRadius: borderRadius.lg,
            border: `2px solid ${displayColors.primary}`,
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              background: displayColors.primary,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.md,
            }}
          />
          <div>
            <p
              style={{
                fontSize: typography.fontSize.xs.size,
                color: colors.neutral[500],
                margin: 0,
                marginBottom: spacing.xs,
              }}
            >
              Color Primario
            </p>
            <p
              style={{
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
                fontFamily: 'monospace',
              }}
            >
              {displayColors.primary}
            </p>
          </div>
        </div>

        {/* Color Secundario */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            padding: spacing.md,
            background: colors.neutral[50],
            borderRadius: borderRadius.lg,
            border: `2px solid ${displayColors.secondary}`,
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              background: displayColors.secondary,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.md,
            }}
          />
          <div>
            <p
              style={{
                fontSize: typography.fontSize.xs.size,
                color: colors.neutral[500],
                margin: 0,
                marginBottom: spacing.xs,
              }}
            >
              Color Secundario
            </p>
            <p
              style={{
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
                fontFamily: 'monospace',
              }}
            >
              {displayColors.secondary}
            </p>
          </div>
        </div>

        {/* Color Acento */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            padding: spacing.md,
            background: colors.neutral[50],
            borderRadius: borderRadius.lg,
            border: `2px solid ${displayColors.accent}`,
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              background: displayColors.accent,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.md,
            }}
          />
          <div>
            <p
              style={{
                fontSize: typography.fontSize.xs.size,
                color: colors.neutral[500],
                margin: 0,
                marginBottom: spacing.xs,
              }}
            >
              Color de Acento
            </p>
            <p
              style={{
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
                fontFamily: 'monospace',
              }}
            >
              {displayColors.accent}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TestColors;