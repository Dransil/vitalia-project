import React, { useState, useEffect } from 'react';
import { useTheme } from '../../Config/ThemeContext';
import { MdSearch, MdClose, MdAdd, MdErrorOutline, MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import * as especialidadesService from '../../Services/Especialidadesservice';

const Especialidades_Dashboard = () => {
  const { config, colors, spacing, typography, borderRadius, shadows } = useTheme();
  const navigate = useNavigate();

  // Estados de búsqueda
  const [searchName, setSearchName] = useState('');

  // Estados de datos
  const [especialidades, setEspecialidades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cargar especialidades al montar
  useEffect(() => {
    loadEspecialidades();
  }, []);

  // Función para cargar especialidades
  const loadEspecialidades = async () => {
    setIsLoading(true);
    setHasError(false);
    const result = await especialidadesService.getEspecialidades();
    
    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      console.log('✅ Especialidades cargadas:', datosValidos);
      setEspecialidades(datosValidos);
      setHasError(false);
    } else {
      setEspecialidades([]);
      setHasError(true);
      setErrorMsg(result.msg || 'Error al cargar las especialidades');
      console.error('❌ Error:', result.msg);
    }
    setIsLoading(false);
  };

  // Función para manejar búsqueda
  const handleSearch = async () => {
    if (!searchName) {
      loadEspecialidades();
      return;
    }

    setIsLoading(true);
    setHasError(false);
    const result = await especialidadesService.searchEspecialidades(searchName);
    
    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      setEspecialidades(datosValidos);
      setHasError(false);
    } else {
      setEspecialidades([]);
      setHasError(true);
      setErrorMsg(result.msg || 'Error en la búsqueda');
    }
    setIsLoading(false);
  };

  // Ejecutar búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName]);

  const handleClearFilter = () => {
    setSearchName('');
  };

  const handleCreateEspecialidad = () => {
    navigate('/especialidad/crear');
  };

  const handleEditEspecialidad = (id) => {
    navigate(`/especialidad/edit/${id}`);
  };

  const handleToggleEstado = async (id) => {
    const result = await especialidadesService.cambiarEstadoEspecialidad(id);
    if (result.ok) {
      loadEspecialidades();
    } else {
      alert(result.msg || 'Error al cambiar el estado');
    }
  };

  const handleDeleteEspecialidad = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta especialidad?')) {
      const result = await especialidadesService.cambiarEstadoEspecialidad(id);
      if (result.ok) {
        alert(result.msg || 'Especialidad desactivada');
        loadEspecialidades();
      } else {
        alert(result.msg || 'Error al desactivar la especialidad');
      }
    }
  };

  // Sanitizar datos
  const sanitizeEspecialidad = (especialidad) => {
    if (!especialidad) return null;

    return {
      id: especialidad.id_especialidad || especialidad.id || 0,
      nombre: especialidad.nombre || 'Sin nombre',
      descripcion: especialidad.descripcion || 'Sin descripción',
      estado: especialidad.estado || 'inactiva',
      fecha_creacion: especialidad.fecha_creacion || null,
    };
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
            margin: 0,
            marginBottom: spacing.md,
          }}
        >
          Especialidades Médicas
        </h1>
        <p style={{ color: colors.neutral[600], margin: 0 }}>
          Total: {especialidades.length} especialidades disponibles
        </p>
      </div>

      {/* Sección de Búsqueda */}
      <div
        style={{
          background: colors.neutral[0],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.xl,
          padding: spacing.lg,
          boxShadow: shadows.md,
          marginBottom: spacing.lg,
          display: 'flex',
          gap: spacing.lg,
          alignItems: 'flex-end',
        }}
      >
        {/* Campo Búsqueda */}
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: 'block',
              fontSize: typography.fontSize.sm.size,
              fontWeight: typography.fontWeight.semibold,
              color: colors.neutral[900],
              marginBottom: spacing.sm,
            }}
          >
            Buscar Especialidad
          </label>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: colors.neutral[50],
              border: `2px solid ${colors.neutral[200]}`,
              borderRadius: borderRadius.md,
            }}
          >
            <MdSearch
              size={20}
              style={{
                position: 'absolute',
                left: spacing.md,
                color: colors.neutral[400],
              }}
            />
            <input
              type="text"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              placeholder="Buscar por nombre..."
              style={{
                flex: 1,
                padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing['2xl']}`,
                border: 'none',
                background: 'transparent',
                fontSize: typography.fontSize.sm.size,
                color: colors.neutral[900],
                outline: 'none',
              }}
              onFocus={e => e.target.parentElement.style.borderColor = config.theme.colors.primary}
              onBlur={e => e.target.parentElement.style.borderColor = colors.neutral[200]}
            />
          </div>
        </div>

        {/* Botón Limpiar */}
        <button
          onClick={handleClearFilter}
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            background: colors.neutral[200],
            color: colors.neutral[900],
            border: 'none',
            borderRadius: borderRadius.md,
            fontWeight: typography.fontWeight.semibold,
            fontSize: typography.fontSize.sm.size,
            cursor: 'pointer',
            transition: '0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
          onMouseEnter={e => e.target.style.background = colors.neutral[300]}
          onMouseLeave={e => e.target.style.background = colors.neutral[200]}
        >
          <MdClose size={18} />
          Limpiar
        </button>
      </div>

      {/* Botón Crear */}
      <div style={{ marginBottom: spacing.lg }}>
        <button
          onClick={handleCreateEspecialidad}
          style={{
            padding: `${spacing.md} ${spacing.lg}`,
            background: `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`,
            color: colors.neutral[0],
            border: 'none',
            borderRadius: borderRadius.md,
            fontWeight: typography.fontWeight.semibold,
            fontSize: typography.fontSize.sm.size,
            cursor: 'pointer',
            transition: '0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
          }}
          onMouseEnter={e => e.target.style.opacity = '0.9'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          <MdAdd size={20} />
          Crear Nueva Especialidad
        </button>
      </div>

      {/* Contenedor Principal */}
      <div
        style={{
          background: colors.neutral[0],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.md,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px',
        }}
      >
        {/* Contenido */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: spacing.lg,
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
                padding: spacing['2xl'],
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: colors.error.light,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.lg,
                }}
              >
                <MdErrorOutline
                  size={40}
                  style={{ color: colors.error.main }}
                />
              </div>

              <h3
                style={{
                  fontSize: typography.fontSize.lg.size,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  margin: 0,
                  marginBottom: spacing.md,
                  textAlign: 'center',
                }}
              >
                No se pudo cargar los datos
              </h3>

              <p
                style={{
                  fontSize: typography.fontSize.sm.size,
                  color: colors.neutral[600],
                  margin: 0,
                  marginBottom: spacing.lg,
                  textAlign: 'center',
                  maxWidth: '300px',
                }}
              >
                {errorMsg || 'Parece que ocurrió un problema. Por favor, intenta más tarde.'}
              </p>

              <button
                onClick={loadEspecialidades}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  background: colors.error.main,
                  color: colors.neutral[0],
                  border: 'none',
                  borderRadius: borderRadius.md,
                  fontWeight: typography.fontWeight.semibold,
                  fontSize: typography.fontSize.sm.size,
                  cursor: 'pointer',
                  transition: '0.3s',
                }}
                onMouseEnter={e => e.target.style.background = colors.error.dark}
                onMouseLeave={e => e.target.style.background = colors.error.main}
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
                  border: `4px solid ${colors.neutral[200]}`,
                  borderTop: `4px solid ${config.theme.colors.primary}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p
                style={{
                  marginTop: spacing.lg,
                  color: colors.neutral[600],
                  fontSize: typography.fontSize.sm.size,
                }}
              >
                Cargando especialidades...
              </p>
            </div>
          ) : especialidades && especialidades.length > 0 ? (
            // Data State - Lista Compacta
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.md,
              }}
            >
              {especialidades.map((especialidad) => {
                const sanitized = sanitizeEspecialidad(especialidad);
                if (!sanitized) return null;

                return (
                  <div
                    key={sanitized.id}
                    style={{
                      background: colors.neutral[50],
                      border: `1px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.lg,
                      padding: spacing.lg,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: '0.3s all',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = colors.neutral[100];
                      e.currentTarget.style.borderColor = config.theme.colors.primary;
                      e.currentTarget.style.boxShadow = shadows.md;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = colors.neutral[50];
                      e.currentTarget.style.borderColor = colors.neutral[200];
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Información de la Especialidad */}
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: typography.fontSize.md.size,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.neutral[900],
                          margin: 0,
                          marginBottom: spacing.sm,
                        }}
                      >
                        {sanitized.nombre}
                      </h4>

                      <p
                        style={{
                          fontSize: typography.fontSize.sm.size,
                          color: colors.neutral[600],
                          margin: 0,
                          marginBottom: spacing.sm,
                        }}
                      >
                        {sanitized.descripcion}
                      </p>

                      {/* Estado */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                        }}
                      >
                        <MdCheckCircle
                          size={16}
                          style={{
                            color: sanitized.estado === 'activa' ? colors.success.main : colors.error.main,
                          }}
                        />
                        <span
                          style={{
                            fontSize: typography.fontSize.xs.size,
                            padding: `${spacing.sm/2} ${spacing.sm}`,
                            background: sanitized.estado === 'activa' ? colors.success.light : colors.error.light,
                            color: sanitized.estado === 'activa' ? colors.success.dark : colors.error.dark,
                            borderRadius: borderRadius.sm,
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                          }}
                        >
                          {sanitized.estado}
                        </span>
                      </div>
                    </div>

                    {/* Botones de Acciones */}
                    <div
                      style={{
                        display: 'flex',
                        gap: spacing.md,
                        marginLeft: spacing.lg,
                      }}
                    >
                      <button
                        onClick={() => handleEditEspecialidad(sanitized.id)}
                        style={{
                          padding: `${spacing.sm} ${spacing.md}`,
                          background: config.theme.colors.primary,
                          color: colors.neutral[0],
                          border: 'none',
                          borderRadius: borderRadius.md,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          fontSize: typography.fontSize.xs.size,
                          transition: '0.3s',
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.8'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        <MdEdit size={16} />
                        Editar
                      </button>

                      <button
                        onClick={() => handleDeleteEspecialidad(sanitized.id)}
                        style={{
                          padding: `${spacing.sm} ${spacing.md}`,
                          background: colors.error.main,
                          color: colors.neutral[0],
                          border: 'none',
                          borderRadius: borderRadius.md,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          fontSize: typography.fontSize.xs.size,
                          transition: '0.3s',
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.8'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        <MdDelete size={16} />
                        Eliminar
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
                padding: spacing['2xl'],
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: spacing.lg }}>
                🏥
              </div>

              <h3
                style={{
                  fontSize: typography.fontSize.lg.size,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  margin: 0,
                  marginBottom: spacing.md,
                  textAlign: 'center',
                }}
              >
                Sin especialidades
              </h3>

              <p
                style={{
                  fontSize: typography.fontSize.sm.size,
                  color: colors.neutral[600],
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

      {/* CSS para animación */}
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

export default Especialidades_Dashboard;