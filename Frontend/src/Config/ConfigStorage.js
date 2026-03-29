// Sistema de almacenamiento local para configuraciones

const STORAGE_KEY = 'medicitas_config';

// Configuración por defecto
export const defaultConfig = {
  theme: {
    colors: {
      primary: '#0284c7',
      secondary: '#14b8a6',
      accent: '#0ea5e9',
    },
    mode: 'light', // 'light' o 'dark'
  },
  notifications: {
    enabled: true,
    sound: true,
    browser: true,
  },
  language: 'es',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
};

// Obtener configuración del localStorage
export const getStoredConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultConfig;
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return defaultConfig;
  }
};

// Guardar configuración en localStorage
export const saveConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return false;
  }
};

// Actualizar configuración parcial
export const updateConfig = (updates) => {
  const current = getStoredConfig();
  const merged = {
    ...current,
    ...updates,
  };
  saveConfig(merged);
  return merged;
};

// Resetear a valores por defecto
export const resetConfig = () => {
  localStorage.removeItem(STORAGE_KEY);
  return defaultConfig;
};

// Sincronizar con backend (cuando esté listo)
export const syncConfigWithBackend = async (config, token) => {
  try {
    const response = await fetch('/api/user/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    });
    
    if (!response.ok) {
      throw new Error('Error al sincronizar configuración');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en sincronización:', error);
    return null;
  }
};

// Obtener configuración del backend
export const fetchConfigFromBackend = async (token) => {
  try {
    const response = await fetch('/api/user/config', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener configuración del servidor');
    }
    
    const data = await response.json();
    saveConfig(data); // Guardar en localStorage
    return data;
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return getStoredConfig(); // Fallback a localStorage
  }
};