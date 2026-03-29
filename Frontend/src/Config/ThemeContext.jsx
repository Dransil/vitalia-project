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
    throw new Error('useTheme debe ser usado dentro de ThemeProvider');
  }
  return context;
};

export default ThemeContext;