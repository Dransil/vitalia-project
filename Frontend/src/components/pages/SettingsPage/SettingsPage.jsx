// src/components/pages/SettingsPage/SettingsPage.jsx
import React, { useState } from 'react';
import { MdRefresh, MdSave } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';
import { resetConfig, defaultConfig } from '../../../Config/ConfigStorage';
import SettingsTemplate from '../../templates/SettingsTemplate/SettingsTemplate';
import ThemeCustomizer from '../../organisms/ThemeCustomizer/ThemeCustomizer';
import NotificationSettings from '../../molecules/NotificationSettings/NotificationSettings';
import LanguageSettings from '../../molecules/LanguageSettings/LanguageSettings';
import InfoCard from '../../molecules/InfoCard/InfoCard';
import Button from '../../atoms/Button/Button';

const SettingsPage = () => {
  const { config, updateThemeConfig, colors, spacing } = useTheme();

  const [localConfig, setLocalConfig] = useState(config);
  const [customizeEnabled, setCustomizeEnabled] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px', '2xl': '48px', lg: '24px' };
    return fallbacks[space] || '16px';
  };

  const handleColorChange = (category) => (value) => {
    setLocalConfig((prev) => ({
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
    setLocalConfig((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        background: value,
      },
    }));
  };

  const handleNotificationChange = (newNotifications) => {
    setLocalConfig((prev) => ({
      ...prev,
      notifications: newNotifications,
    }));
  };

  const handleLanguageChange = (lang) => {
    setLocalConfig((prev) => ({
      ...prev,
      language: lang,
    }));
  };

  const handleTimeFormatChange = (format) => {
    setLocalConfig((prev) => ({
      ...prev,
      timeFormat: format,
    }));
  };

  const handleToggleCustomize = () => {
    if (customizeEnabled) {
      setLocalConfig((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          colors: defaultConfig.theme.colors,
          background: defaultConfig.theme.background,
        },
      }));
    }
    setCustomizeEnabled(!customizeEnabled);
  };

  const handleSave = () => {
    updateThemeConfig(localConfig);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('¿Restaurar configuracion por defecto?')) {
      const newDefaultConfig = resetConfig();
      setLocalConfig(newDefaultConfig);
      updateThemeConfig(newDefaultConfig);
      setCustomizeEnabled(false);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    }
  };

  const displayColors = customizeEnabled
    ? localConfig.theme.colors
    : defaultConfig.theme.colors;
  const displayBackground = customizeEnabled
    ? localConfig.theme.background
    : defaultConfig.theme.background;

  return (
    <SettingsTemplate
      title="Configuracion"
      subtitle="Personaliza tu experiencia en Vitalia"
      savedMessage={savedMessage}
      onReset={handleReset}
      onSave={handleSave}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: getSpacing('lg'),
        }}
      >
        {/* ThemeCustomizer ocupa todo el ancho con grid interno de 2 columnas */}
        <ThemeCustomizer
          customizeEnabled={customizeEnabled}
          onToggleCustomize={handleToggleCustomize}
          colors={displayColors}
          onColorChange={handleColorChange}
          background={displayBackground}
          onBackgroundChange={handleBackgroundChange}
        />

        {/* Los demás en grid de 2 columnas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: getSpacing('lg'),
          }}
        >
          <NotificationSettings
            config={localConfig.notifications}
            onChange={handleNotificationChange}
          />
          {/* componente por el momento no implementado su funcionalidad}
          <LanguageSettings
            language={localConfig.language}
            timeFormat={localConfig.timeFormat}
            onLanguageChange={handleLanguageChange}
            onTimeFormatChange={handleTimeFormatChange}
          />*/}

          <InfoCard
            version="v1.0.0"
            lastSync={new Date().toLocaleString('es-ES')}
            storageSize={(JSON.stringify(config).length / 1024).toFixed(2)}
          />
        </div>
      </div>
    </SettingsTemplate>
  );
};

export default SettingsPage;