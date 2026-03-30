import React, { useState } from 'react';
import { useTheme } from '../Config/ThemeContext';
import { resetConfig } from '../Config/configStorage.js';
import { MdColorLens, MdRefresh, MdSave, MdNotifications, MdLanguage, MdInfo } from 'react-icons/md';

const Settings = () => {
  const { config, updateThemeConfig, spacing, colors, typography, shadows, borderRadius } = useTheme();
  const [localConfig, setLocalConfig] = useState(config);
  const [saved, setSaved] = useState(false);

  const handleColorChange = (category, value) => {
    setLocalConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        colors: {
          ...prev.theme.colors,
          [category]: value,
        },
      },
    }));
  };

  const handleBackgroundChange = (value) => {
    setLocalConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        background: value,
      },
    }));
  };

  const handleNotificationChange = (key, value) => {
    setLocalConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleLanguageChange = (lang) => {
    setLocalConfig(prev => ({
      ...prev,
      language: lang,
    }));
  };

  const handleTimeFormatChange = (format) => {
    setLocalConfig(prev => ({
      ...prev,
      timeFormat: format,
    }));
  };

  const handleSave = () => {
    updateThemeConfig(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('¿Restaurar configuración por defecto?')) {
      const defaultConfig = resetConfig();
      setLocalConfig(defaultConfig);
      updateThemeConfig(defaultConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Encabezado */}
      <div style={{ marginBottom: spacing['2xl'] }}>
        <h1
          style={{
            fontSize: typography.fontSize['3xl'].size,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing.md,
          }}
        >
          Configuración
        </h1>
        <p style={{ color: colors.neutral[600] }}>
          Personaliza tu experiencia en Vitalia
        </p>
      </div>

      {/* Mensaje de guardado */}
      {saved && (
        <div
          style={{
            padding: spacing.md,
            marginBottom: spacing.lg,
            backgroundColor: colors.success.light,
            border: `2px solid ${colors.success.main}`,
            color: colors.success.dark,
            borderRadius: borderRadius.lg,
            fontWeight: typography.fontWeight.semibold,
          }}
        >
          Configuración guardada correctamente
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
        {/* Sección Tema */}
        <div
          style={{
            background: colors.neutral[0],
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            boxShadow: shadows.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
            <MdColorLens size={24} color={colors.primary[600]} />
            <h2
              style={{
                fontSize: typography.fontSize.lg.size,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
              }}
            >
              Tema de Color
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
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
                  value={localConfig.theme.colors.primary}
                  onChange={e => handleColorChange('primary', e.target.value)}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: `2px solid ${colors.neutral[300]}`,
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: typography.fontSize.sm.size, color: colors.neutral[600], fontFamily: 'monospace' }}>
                  {localConfig.theme.colors.primary}
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
                  value={localConfig.theme.colors.secondary}
                  onChange={e => handleColorChange('secondary', e.target.value)}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: `2px solid ${colors.neutral[300]}`,
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: typography.fontSize.sm.size, color: colors.neutral[600], fontFamily: 'monospace' }}>
                  {localConfig.theme.colors.secondary}
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
                  value={localConfig.theme.colors.accent}
                  onChange={e => handleColorChange('accent', e.target.value)}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: `2px solid ${colors.neutral[300]}`,
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: typography.fontSize.sm.size, color: colors.neutral[600], fontFamily: 'monospace' }}>
                  {localConfig.theme.colors.accent}
                </span>
              </div>
            </div>

            {/* Color de Fondo */}
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
                Color de Fondo
              </label>
              <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center' }}>
                <input
                  type="color"
                  value={localConfig.theme.background || '#f0f9ff'}
                  onChange={e => handleBackgroundChange(e.target.value)}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: `2px solid ${colors.neutral[300]}`,
                    borderRadius: borderRadius.md,
                    cursor: 'pointer',
                  }}
                />
                <span style={{ fontSize: typography.fontSize.sm.size, color: colors.neutral[600], fontFamily: 'monospace' }}>
                  {localConfig.theme.background || '#f0f9ff'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Notificaciones */}
        <div
          style={{
            background: colors.neutral[0],
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            boxShadow: shadows.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
            <MdNotifications size={24} color={colors.primary[600]} />
            <h2
              style={{
                fontSize: typography.fontSize.lg.size,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
              }}
            >
              Notificaciones
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {/* Habilitar notificaciones */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                fontSize: typography.fontSize.sm.size,
              }}
            >
              <input
                type="checkbox"
                checked={localConfig.notifications.enabled}
                onChange={e => handleNotificationChange('enabled', e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: colors.neutral[900], fontWeight: typography.fontWeight.medium }}>
                Habilitar notificaciones
              </span>
            </label>

            {/* Sonido */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                fontSize: typography.fontSize.sm.size,
                opacity: localConfig.notifications.enabled ? 1 : 0.5,
                pointerEvents: localConfig.notifications.enabled ? 'auto' : 'none',
              }}
            >
              <input
                type="checkbox"
                checked={localConfig.notifications.sound}
                onChange={e => handleNotificationChange('sound', e.target.checked)}
                disabled={!localConfig.notifications.enabled}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: colors.neutral[900], fontWeight: typography.fontWeight.medium }}>
                Sonido en notificaciones
              </span>
            </label>

            {/* Notificaciones del navegador */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                cursor: 'pointer',
                fontSize: typography.fontSize.sm.size,
                opacity: localConfig.notifications.enabled ? 1 : 0.5,
                pointerEvents: localConfig.notifications.enabled ? 'auto' : 'none',
              }}
            >
              <input
                type="checkbox"
                checked={localConfig.notifications.browser}
                onChange={e => handleNotificationChange('browser', e.target.checked)}
                disabled={!localConfig.notifications.enabled}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ color: colors.neutral[900], fontWeight: typography.fontWeight.medium }}>
                Notificaciones del navegador
              </span>
            </label>
          </div>
        </div>

        {/* Sección Idioma y Formato */}
        <div
          style={{
            background: colors.neutral[0],
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            boxShadow: shadows.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
            <MdLanguage size={24} color={colors.primary[600]} />
            <h2
              style={{
                fontSize: typography.fontSize.lg.size,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
              }}
            >
              Idioma y Región
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {/* Idioma */}
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
                Idioma
              </label>
              <select
                value={localConfig.language}
                onChange={e => handleLanguageChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  cursor: 'pointer',
                }}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>

            {/* Zona horaria */}
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
                Zona Horaria
              </label>
              <input
                type="text"
                value={localConfig.timezone}
                disabled
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `2px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  fontSize: typography.fontSize.sm.size,
                  backgroundColor: colors.neutral[100],
                  color: colors.neutral[600],
                }}
              />
            </div>

            {/* Formato de hora */}
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
                Formato de Hora
              </label>
              <div style={{ display: 'flex', gap: spacing.md }}>
                {['12h', '24h'].map(format => (
                  <label
                    key={format}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="timeFormat"
                      value={format}
                      checked={localConfig.timeFormat === format}
                      onChange={e => handleTimeFormatChange(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    {format}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sección Información */}
        <div
          style={{
            background: colors.neutral[0],
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            boxShadow: shadows.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
            <MdInfo size={24} color={colors.primary[600]} />
            <h2
              style={{
                fontSize: typography.fontSize.lg.size,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
              }}
            >
              Información
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <div>
              <p style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[500], marginBottom: spacing.xs, margin: 0, marginBottom: spacing.xs }}>
                Versión de la Aplicación
              </p>
              <p style={{ fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], margin: 0 }}>
                v1.0.0
              </p>
            </div>

            <div>
              <p style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[500], marginBottom: spacing.xs, margin: 0, marginBottom: spacing.xs }}>
                Última sincronización
              </p>
              <p style={{ fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], margin: 0 }}>
                {new Date().toLocaleString('es-ES')}
              </p>
            </div>

            <div>
              <p style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[500], marginBottom: spacing.xs, margin: 0, marginBottom: spacing.xs }}>
                Almacenamiento local
              </p>
              <p style={{ fontWeight: typography.fontWeight.semibold, color: colors.neutral[900], margin: 0 }}>
                {(JSON.stringify(config).length / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div
        style={{
          display: 'flex',
          gap: spacing.md,
          marginTop: spacing['2xl'],
          justifyContent: 'flex-end',
        }}
      >
        <button
          onClick={handleReset}
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            backgroundColor: colors.warning.main,
            color: colors.neutral[0],
            border: 'none',
            borderRadius: borderRadius.lg,
            fontWeight: typography.fontWeight.semibold,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
          onMouseEnter={e => e.target.style.backgroundColor = colors.warning.dark}
          onMouseLeave={e => e.target.style.backgroundColor = colors.warning.main}
        >
          <MdRefresh size={18} />
          Restaurar Predeterminados
        </button>

        <button
          onClick={handleSave}
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            background: `linear-gradient(to right, ${colors.primary[600]}, ${colors.primary[500]})`,
            color: colors.neutral[0],
            border: 'none',
            borderRadius: borderRadius.lg,
            fontWeight: typography.fontWeight.semibold,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
          onMouseEnter={e => e.target.style.boxShadow = shadows.lg}
          onMouseLeave={e => e.target.style.boxShadow = shadows.base}
        >
          <MdSave size={18} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default Settings;