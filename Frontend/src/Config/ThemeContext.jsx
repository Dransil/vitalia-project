import React, { createContext, useContext, useState } from 'react';
import theme from './theme';
import { getStoredConfig, updateConfig } from './ConfigStorage.js';

// Crear contexto
const ThemeContext = createContext();

// Provider
export const ThemeProvider = ({ children }) => {
  const [config, setConfig] = useState(getStoredConfig());

  // Actualizar configuración y guardar
  const updateThemeConfig = (newConfig) => {
    setConfig(newConfig);
    updateConfig(newConfig);
    // Emitir evento para que otros componentes se actualicen
    window.dispatchEvent(new CustomEvent('configChanged', { detail: newConfig }));
  };

  const value = {
    ...theme,
    config,
    updateThemeConfig,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.warn('useTheme usado fuera de ThemeProvider - usando valores por defecto');
    // Retornar valores por defecto completos
    return {
      colors: theme.colors,
      spacing: theme.spacing,
      typography: theme.typography,
      borderRadius: theme.borderRadius,
      shadows: theme.shadows,
      config: { theme: { colors: { primary: '#0ea5e9', secondary: '#14b8a6' } } },
      updateThemeConfig: () => {},
    };
  }
  return context;
};

export default ThemeContext;