// src/components/molecules/NotificationSettings/NotificationSettings.jsx
import React from 'react';
import { MdNotifications } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const NotificationSettings = ({ config, onChange }) => {
  const { colors, spacing, typography, borderRadius, shadows } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', md: '16px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const handleChange = (key, value) => {
    onChange({
      ...config,
      [key]: value,
    });
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
        <MdNotifications size={24} color={colors?.primary?.[600] || '#2563EB'} />
        <h2
          style={{
            fontSize: typography?.fontSize?.lg?.size || '18px',
            fontWeight: typography?.fontWeight?.bold || 700,
            color: colors?.neutral?.[900] || '#111827',
            margin: 0,
          }}
        >
          Notificaciones
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: getSpacing('md') }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: getSpacing('md'),
            cursor: 'pointer',
            fontSize: typography?.fontSize?.sm?.size || '14px',
          }}
        >
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span style={{ color: colors?.neutral?.[900] || '#111827', fontWeight: typography?.fontWeight?.medium || 500 }}>
            Habilitar notificaciones
          </span>
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: getSpacing('md'),
            cursor: config.enabled ? 'pointer' : 'not-allowed',
            fontSize: typography?.fontSize?.sm?.size || '14px',
            opacity: config.enabled ? 1 : 0.5,
          }}
        >
          <input
            type="checkbox"
            checked={config.sound}
            onChange={(e) => handleChange('sound', e.target.checked)}
            disabled={!config.enabled}
            style={{ width: '18px', height: '18px', cursor: config.enabled ? 'pointer' : 'not-allowed' }}
          />
          <span style={{ color: colors?.neutral?.[900] || '#111827', fontWeight: typography?.fontWeight?.medium || 500 }}>
            Sonido en notificaciones
          </span>
        </label>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: getSpacing('md'),
            cursor: config.enabled ? 'pointer' : 'not-allowed',
            fontSize: typography?.fontSize?.sm?.size || '14px',
            opacity: config.enabled ? 1 : 0.5,
          }}
        >
          <input
            type="checkbox"
            checked={config.browser}
            onChange={(e) => handleChange('browser', e.target.checked)}
            disabled={!config.enabled}
            style={{ width: '18px', height: '18px', cursor: config.enabled ? 'pointer' : 'not-allowed' }}
          />
          <span style={{ color: colors?.neutral?.[900] || '#111827', fontWeight: typography?.fontWeight?.medium || 500 }}>
            Notificaciones del navegador
          </span>
        </label>
      </div>
    </div>
  );
};

export default NotificationSettings;