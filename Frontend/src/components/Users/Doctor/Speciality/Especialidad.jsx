import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../Config/ThemeContext';
import { MdSearch, MdClose, MdAdd, MdErrorOutline, MdEdit, MdCheckCircle, MdCancel, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import especialidadesService from '../../../../services/especialidadesService.js';

// VALORES POR DEFECTO - para evitar cualquier error
const DEFAULT_COLORS = {
  neutral: { 0: '#fff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
  success: { light: '#d1fae5', main: '#10b981', dark: '#059669' },
  error: { light: '#fee2e2', main: '#dc2626', dark: '#991b1b' },
  warning: { light: '#fef3c7', main: '#f59e0b', dark: '#d97706' },
  primary: { 500: '#0ea5e9', 600: '#0284c7' },
  secondary: { 500: '#14b8a6' }
};

const DEFAULT_SPACING = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px', '3xl': '64px' };

const DEFAULT_TYPOGRAPHY = {
  fontSize: {
    xs: { size: '12px', lineHeight: '16px' },
    sm: { size: '14px', lineHeight: '20px' },
    md: { size: '16px', lineHeight: '24px' },
    lg: { size: '18px', lineHeight: '28px' },
    xl: { size: '20px', lineHeight: '28px' },
    '2xl': { size: '24px', lineHeight: '32px' },
    '3xl': { size: '30px', lineHeight: '36px' }
  },
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 }
};

const DEFAULT_BORDER_RADIUS = { sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px' };
const DEFAULT_SHADOWS = { sm: '0 1px 2px 0 rgba(0,0,0,0.05)', md: '0 4px 6px -1px rgba(0,0,0,0.1)', lg: '0 10px 15px -3px rgba(0,0,0,0.1)' };

const DEFAULT_CONFIG = {
  theme: {
    colors: {
      primary: DEFAULT_COLORS.primary[500],
      secondary: DEFAULT_COLORS.secondary[500]
    }
  }
};

const Specialty_Dashboard = () => {
  const navigate = useNavigate();
  
  // Intentar obtener el tema, si falla usar defaults
  let themeContext = {};
  try {
    themeContext = useTheme() || {};
  } catch (e) {
    console.warn('ThemeContext no disponible, usando valores por defecto');
  }

  // USAR VALORES DEL CONTEXTO O DEFAULTS
  const config = themeContext.config || DEFAULT_CONFIG;
  const colors = themeContext.colors || DEFAULT_COLORS;
  const spacing = themeContext.spacing || DEFAULT_SPACING;
  const typography = themeContext.typography || DEFAULT_TYPOGRAPHY;
  const borderRadius = themeContext.borderRadius || DEFAULT_BORDER_RADIUS;
  const shadows = themeContext.shadows || DEFAULT_SHADOWS;

  const [searchName, setSearchName] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadEspecialidades();
  }, []);

  const loadEspecialidades = async () => {
    setIsLoading(true);
    setHasError(false);
    const result = await especialidadesService.getEspecialidades();
    
    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      console.log('Especialidades cargadas:', datosValidos);
      setEspecialidades(datosValidos);
    } else {
      setEspecialidades([]);
      setHasError(true);
      setErrorMsg(result.msg || 'Error al cargar las especialidades');
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchName) {
      loadEspecialidades();
      return;
    }

    setIsLoading(true);
    const result = await especialidadesService.searchEspecialidades(searchName);
    
    if (result.ok) {
      setEspecialidades(Array.isArray(result.data) ? result.data : []);
    } else {
      setHasError(true);
      setErrorMsg(result.msg || 'Error en la búsqueda');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(), 500);
    return () => clearTimeout(timer);
  }, [searchName]);

  const handleClearFilter = () => setSearchName('');
  const handleCreateEspecialidad = () => navigate('/Speciality_create');
  const handleEditEspecialidad = (id) => navigate(`/especialidad/edit/${id}`);

  const handleToggleEstado = async (id, nombre, estadoActual) => {
    const accion = estadoActual === 'activa' ? 'desactivar' : 'activar';
    
    if (window.confirm(`¿Estás seguro de que deseas ${accion} la especialidad "${nombre}"?`)) {
      const result = await especialidadesService.cambiarEstadoEspecialidad(id);
      if (result.ok) {
        alert(result.msg || `Especialidad ${result.estado === 'activa' ? 'activada' : 'desactivada'} exitosamente`);
        loadEspecialidades();
      } else {
        alert(result.msg || `Error al ${accion} la especialidad`);
      }
    }
  };

  const sanitizeEspecialidad = (especialidad) => {
    if (!especialidad || typeof especialidad !== 'object') {
      console.warn('Datos inválidos para especialidad:', especialidad);
      return null;
    }

    return {
      id: especialidad.id_especialidad || especialidad.id || 0,
      nombre: especialidad.nombre || 'Sin nombre',
      descripcion: especialidad.descripcion || 'Sin descripción',
      estado: especialidad.estado || 'inactiva',
    };
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Encabezado */}
      <div style={{ marginBottom: spacing['2xl'] }}>
        <h1
          style={{
            fontSize: typography?.fontSize?.['3xl']?.size || '30px',
            fontWeight: typography?.fontWeight?.bold || 700,
            color: colors?.neutral?.[900] || '#111827',
            margin: 0,
            marginBottom: spacing?.md || '16px',
          }}
        >
          Especialidades Médicas
        </h1>
        <p style={{ 
          color: colors?.neutral?.[600] || '#4b5563', 
          margin: 0,
          fontSize: typography?.fontSize?.sm?.size || '14px'
        }}>
          Gestiona todas las especialidades médicas del sistema
        </p>
      </div>

      {/* Sección de Búsqueda */}
      <div
        style={{
          background: colors?.neutral?.[0] || '#fff',
          border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
          borderRadius: borderRadius?.xl || '12px',
          padding: spacing?.lg || '24px',
          boxShadow: shadows?.md || '0 4px 6px -1px rgba(0,0,0,0.1)',
          marginBottom: spacing?.lg || '24px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: spacing?.lg || '24px',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[900] || '#111827',
                marginBottom: spacing?.sm || '8px',
              }}
            >
              Buscar Especialidad
            </label>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: colors?.neutral?.[50] || '#f9fafb',
                border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                borderRadius: borderRadius?.md || '6px',
              }}
            >
              <MdSearch
                size={20}
                style={{
                  position: 'absolute',
                  left: spacing?.md || '16px',
                  color: colors?.neutral?.[400] || '#9ca3af',
                }}
              />
              <input
                type="text"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                placeholder="Buscar por nombre..."
                style={{
                  flex: 1,
                  padding: `${spacing?.md || '16px'} ${spacing?.md || '16px'} ${spacing?.md || '16px'} ${spacing?.['2xl'] || '48px'}`,
                  border: 'none',
                  background: 'transparent',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  color: colors?.neutral?.[900] || '#111827',
                  outline: 'none',
                }}
                onFocus={e => e.target.parentElement.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary}
                onBlur={e => e.target.parentElement.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
              />
            </div>
          </div>

          <button
            onClick={handleClearFilter}
            style={{
              padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`,
              background: colors?.neutral?.[200] || '#e5e7eb',
              color: colors?.neutral?.[900] || '#111827',
              border: 'none',
              borderRadius: borderRadius?.md || '6px',
              fontWeight: typography?.fontWeight?.semibold || 600,
              fontSize: typography?.fontSize?.sm?.size || '14px',
              cursor: 'pointer',
              transition: '0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: spacing?.sm || '8px',
              justifyContent: 'center',
            }}
            onMouseEnter={e => e.target.style.background = colors?.neutral?.[300] || '#d1d5db'}
            onMouseLeave={e => e.target.style.background = colors?.neutral?.[200] || '#e5e7eb'}
          >
            <MdClose size={18} />
            Limpiar
          </button>
        </div>
      </div>

      {/* Botón Crear */}
      <div style={{ marginBottom: spacing?.lg || '24px' }}>
        <button
          onClick={handleCreateEspecialidad}
          style={{
            padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`,
            background: `linear-gradient(to right, ${config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary}, ${config?.theme?.colors?.secondary || DEFAULT_CONFIG.theme.colors.secondary})`,
            color: colors?.neutral?.[0] || '#fff',
            border: 'none',
            borderRadius: borderRadius?.md || '6px',
            fontWeight: typography?.fontWeight?.semibold || 600,
            fontSize: typography?.fontSize?.sm?.size || '14px',
            cursor: 'pointer',
            transition: '0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: spacing?.sm || '8px',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.9'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          <MdAdd size={20} />
          Crear Nueva Especialidad
        </button>
      </div>

      {/* Contenedor de Especialidades */}
      <div
        style={{
          background: colors?.neutral?.[0] || '#fff',
          border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
          borderRadius: borderRadius?.xl || '12px',
          boxShadow: shadows?.md || '0 4px 6px -1px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '600px',
        }}
      >
        {/* Contenido Scrollable */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: spacing?.lg || '24px',
          }}
        >
          {hasError ? (
            // Error State
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: spacing?.['2xl'] || '48px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: colors?.error?.light || '#fee2e2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing?.lg || '24px',
                }}
              >
                <MdErrorOutline
                  size={40}
                  style={{ color: colors?.error?.main || '#dc2626' }}
                />
              </div>

              <h3
                style={{
                  fontSize: typography?.fontSize?.lg?.size || '18px',
                  fontWeight: typography?.fontWeight?.bold || 700,
                  color: colors?.neutral?.[900] || '#111827',
                  margin: 0,
                  marginBottom: spacing?.md || '16px',
                  textAlign: 'center',
                }}
              >
                No se pudo cargar los datos
              </h3>

              <p
                style={{
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  color: colors?.neutral?.[600] || '#4b5563',
                  margin: 0,
                  marginBottom: spacing?.lg || '24px',
                  textAlign: 'center',
                  maxWidth: '300px',
                }}
              >
                {errorMsg || 'Parece que ocurrió un problema al intentar cargar la lista de especialidades. Por favor, intenta más tarde.'}
              </p>

              <button
                onClick={loadEspecialidades}
                style={{
                  padding: `${spacing?.sm || '8px'} ${spacing?.lg || '24px'}`,
                  background: colors?.error?.main || '#dc2626',
                  color: colors?.neutral?.[0] || '#fff',
                  border: 'none',
                  borderRadius: borderRadius?.md || '6px',
                  fontWeight: typography?.fontWeight?.semibold || 600,
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  cursor: 'pointer',
                  transition: '0.3s',
                }}
                onMouseEnter={e => e.target.style.background = colors?.error?.dark || '#991b1b'}
                onMouseLeave={e => e.target.style.background = colors?.error?.main || '#dc2626'}
              >
                Reintentar
              </button>
            </div>
          ) : isLoading ? (
            // Loading State
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: `4px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderTop: `4px solid ${config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p
                style={{
                  marginTop: spacing?.lg || '24px',
                  color: colors?.neutral?.[600] || '#4b5563',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                }}
              >
                Cargando especialidades...
              </p>
            </div>
          ) : especialidades && especialidades.length > 0 ? (
            // Data State - Lista de especialidades
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing?.md || '16px',
              }}
            >
              {especialidades.map((especialidad) => {
                // SANITIZAR TODOS LOS DATOS
                const sanitized = sanitizeEspecialidad(especialidad);
                if (!sanitized) return null;

                return (
                  <div
                    key={sanitized.id}
                    style={{
                      background: colors?.neutral?.[50] || '#f9fafb',
                      border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                      borderRadius: borderRadius?.lg || '8px',
                      padding: spacing?.lg || '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: '0.3s all',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = colors?.neutral?.[100] || '#f3f4f6';
                      e.currentTarget.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary;
                      e.currentTarget.style.boxShadow = shadows?.md || '0 4px 6px -1px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = colors?.neutral?.[50] || '#f9fafb';
                      e.currentTarget.style.borderColor = colors?.neutral?.[200] || '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Información de la Especialidad */}
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: typography?.fontSize?.md?.size || '16px',
                          fontWeight: typography?.fontWeight?.bold || 700,
                          color: colors?.neutral?.[900] || '#111827',
                          margin: 0,
                          marginBottom: spacing?.sm || '8px',
                        }}
                      >
                        {sanitized.nombre}
                      </h4>

                      <p
                        style={{
                          fontSize: typography?.fontSize?.sm?.size || '14px',
                          color: colors?.neutral?.[600] || '#4b5563',
                          margin: 0,
                          marginBottom: spacing?.md || '16px',
                        }}
                      >
                        {sanitized.descripcion}
                      </p>

                      {/* Estado */}
                      <span
                        style={{
                          fontSize: typography?.fontSize?.xs?.size || '12px',
                          padding: `${(spacing?.sm || '8px') / 2} ${spacing?.sm || '8px'}`,
                          background: sanitized.estado === 'activa' ? colors?.success?.light || '#d1fae5' : colors?.error?.light || '#fee2e2',
                          color: sanitized.estado === 'activa' ? colors?.success?.dark || '#059669' : colors?.error?.dark || '#991b1b',
                          borderRadius: borderRadius?.sm || '4px',
                          textTransform: 'capitalize',
                          display: 'inline-block',
                        }}
                      >
                        {sanitized.estado}
                      </span>
                    </div>

                    {/* Botones de Acciones */}
                    <div
                      style={{
                        display: 'flex',
                        gap: spacing?.md || '16px',
                        marginLeft: spacing?.lg || '24px',
                      }}
                    >
                      <button
                        onClick={() => handleEditEspecialidad(sanitized.id)}
                        style={{
                          padding: `${spacing?.sm || '8px'} ${spacing?.md || '16px'}`,
                          background: config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary,
                          color: colors?.neutral?.[0] || '#fff',
                          border: 'none',
                          borderRadius: borderRadius?.md || '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing?.sm || '8px',
                          fontSize: typography?.fontSize?.xs?.size || '12px',
                          transition: '0.3s',
                          fontWeight: typography?.fontWeight?.semibold || 600,
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.8'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        <MdEdit size={16} />
                        Editar
                      </button>

                      <button
                        onClick={() => handleToggleEstado(sanitized.id, sanitized.nombre, sanitized.estado)}
                        style={{
                          padding: `${spacing?.sm || '8px'} ${spacing?.md || '16px'}`,
                          background: sanitized.estado === 'activa' ? colors?.error?.main || '#dc2626' : colors?.success?.main || '#10b981',
                          color: colors?.neutral?.[0] || '#fff',
                          border: 'none',
                          borderRadius: borderRadius?.md || '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing?.sm || '8px',
                          fontSize: typography?.fontSize?.xs?.size || '12px',
                          transition: '0.3s',
                          fontWeight: typography?.fontWeight?.semibold || 600,
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.8'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        {sanitized.estado === 'activa' ? (
                          <>
                            <MdCancel size={16} />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <MdCheckCircle size={16} />
                            Activar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty State
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: spacing?.['2xl'] || '48px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: spacing?.lg || '24px' }}>
                🏥
              </div>

              <h3
                style={{
                  fontSize: typography?.fontSize?.lg?.size || '18px',
                  fontWeight: typography?.fontWeight?.bold || 700,
                  color: colors?.neutral?.[900] || '#111827',
                  margin: 0,
                  marginBottom: spacing?.md || '16px',
                  textAlign: 'center',
                }}
              >
                Sin especialidades
              </h3>

              <p
                style={{
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  color: colors?.neutral?.[600] || '#4b5563',
                  margin: 0,
                  textAlign: 'center',
                  maxWidth: '300px',
                }}
              >
                No hay especialidades registradas. Crea una para comenzar.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Specialty_Dashboard;