import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../Config/ThemeContext';
import { MdSearch, MdClose, MdAdd, MdErrorOutline, MdEdit, MdDelete, MdCheckCircle, MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import * as consultoriosService from '../../../../Services/Consultorioservice';

const Consultorios_Dashboard = () => {
  const { config, colors, spacing, typography, borderRadius, shadows } = useTheme();
  const navigate = useNavigate();

  // Estados de búsqueda
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');

  // Estados de datos
  const [consultorios, setConsultorios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cargar consultorios al montar
  useEffect(() => {
    loadConsultorios();
  }, []);

  // Función para cargar consultorios
  const loadConsultorios = async () => {
    setIsLoading(true);
    setHasError(false);
    const result = await consultoriosService.getConsultorios();
    
    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      console.log('Consultorios cargados:', datosValidos);
      setConsultorios(datosValidos);
      setHasError(false);
    } else {
      setConsultorios([]);
      setHasError(true);
      setErrorMsg(result.msg || 'Error al cargar los consultorios');
      console.error('Error:', result.msg);
    }
    setIsLoading(false);
  };

  // Función para manejar búsqueda
  const handleSearch = async () => {
    if (!searchName && !searchCity) {
      loadConsultorios();
      return;
    }

    setIsLoading(true);
    setHasError(false);
    const result = await consultoriosService.searchConsultorios(searchName, searchCity);
    
    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      setConsultorios(datosValidos);
      setHasError(false);
    } else {
      setConsultorios([]);
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
  }, [searchName, searchCity]);

  const handleClearFilter = () => {
    setSearchName('');
    setSearchCity('');
  };

  const handleCreateConsultorio = () => {
    navigate('/consultorio/crear');
  };

  const handleEditConsultorio = (id) => {
    navigate(`/consultorio/edit/${id}`);
  };

  const handleDeleteConsultorio = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este consultorio?')) {
      const result = await consultoriosService.deleteConsultorio(id);
      if (result.ok) {
        alert(result.msg || 'Consultorio eliminado');
        loadConsultorios();
      } else {
        alert(result.msg || 'Error al eliminar el consultorio');
      }
    }
  };

  // Sanitizar datos
  const sanitizeConsultorio = (consultorio) => {
    if (!consultorio) return null;

    return {
      id: consultorio.id_consultorio || consultorio.id || 0,
      nombre: consultorio.nombre || 'Sin nombre',
      direccion: consultorio.direccion || 'Sin dirección',
      ciudad: consultorio.ciudad || 'Sin ciudad',
      telefono: consultorio.telefono || 'N/A',
      email: consultorio.email || 'Sin email',
      horario_apertura: consultorio.horario_apertura || '00:00:00',
      horario_cierre: consultorio.horario_cierre || '00:00:00',
      dias_atencion: consultorio.dias_atencion || 'No especificado',
      estado: consultorio.estado || 'inactivo',
      fecha_creacion: consultorio.fecha_creacion || null,
    };
  };

  // Formatear hora
  const formatearHora = (hora) => {
    if (!hora) return 'N/A';
    return hora.substring(0, 5);
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
          Consultorios
        </h1>
        <p style={{ color: colors.neutral[600], margin: 0 }}>
          Total: {consultorios.length} consultorios disponibles
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
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: spacing.lg,
          alignItems: 'flex-end',
        }}
      >
        {/* Campo Nombre */}
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
            Buscar por Nombre
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
              placeholder="Ej: Consultorio Central..."
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

        {/* Campo Ciudad */}
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
            Buscar por Ciudad
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
            <MdLocationOn
              size={20}
              style={{
                position: 'absolute',
                left: spacing.md,
                color: colors.neutral[400],
              }}
            />
            <input
              type="text"
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
              placeholder="Ej: Cochabamba..."
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
          onClick={handleCreateConsultorio}
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
          Crear Nuevo Consultorio
        </button>
      </div>

      {/* Contenedor Principal - TABLA SCROLLABLE */}
      <div
        style={{
          background: colors.neutral[0],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.md,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Contenido Scrollable */}
        <div style={{ flex: 1, overflow: 'auto', maxHeight: '600px' }}>
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
              <MdErrorOutline size={40} style={{ color: colors.error.main, marginBottom: spacing.lg }} />
              <h3 style={{ color: colors.neutral[900], margin: 0, marginBottom: spacing.md }}>
                No se pudo cargar los datos
              </h3>
              <p style={{ color: colors.neutral[600], textAlign: 'center', maxWidth: '300px' }}>
                {errorMsg || 'Parece que ocurrió un problema. Por favor, intenta más tarde.'}
              </p>
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
              <p style={{ marginTop: spacing.lg, color: colors.neutral[600], fontSize: typography.fontSize.sm.size }}>
                Cargando consultorios...
              </p>
            </div>
          ) : consultorios && consultorios.length > 0 ? (
            // Data State - Tarjetas
            <div style={{ padding: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              {consultorios.map((consultorio, index) => {
                const sanitized = sanitizeConsultorio(consultorio);
                if (!sanitized) return null;

                return (
                  <div
                    key={sanitized.id}
                    style={{
                      background: colors.neutral[50],
                      border: `1px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.lg,
                      padding: spacing.lg,
                      transition: '0.3s',
                      cursor: 'pointer',
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
                    {/* Fila 1: Nombre y Estado */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: spacing.md,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: colors.neutral[900],
                          fontSize: typography.fontSize.lg.size,
                          fontWeight: 'bold',
                        }}
                      >
                        {sanitized.nombre}
                      </h3>
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
                            color: sanitized.estado === 'activo' ? colors.success.main : colors.error.main,
                          }}
                        />
                        <span
                          style={{
                            fontSize: typography.fontSize.xs.size,
                            padding: `${spacing.sm/2} ${spacing.sm}`,
                            background: sanitized.estado === 'activo' ? colors.success.light : colors.error.light,
                            color: sanitized.estado === 'activo' ? colors.success.dark : colors.error.dark,
                            borderRadius: borderRadius.sm,
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                          }}
                        >
                          {sanitized.estado}
                        </span>
                      </div>
                    </div>

                    {/* Fila 2: Ubicación */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: spacing.md,
                        marginBottom: spacing.md,
                        padding: spacing.md,
                        background: colors.neutral[0],
                        borderRadius: borderRadius.md,
                      }}
                    >
                      <MdLocationOn size={20} style={{ color: config.theme.colors.primary, marginTop: '2px' }} />
                      <div>
                        <div style={{ color: colors.neutral[900], fontWeight: 'bold', fontSize: typography.fontSize.sm.size }}>
                          {sanitized.ciudad}
                        </div>
                        <div style={{ color: colors.neutral[600], fontSize: typography.fontSize.xs.size }}>
                          {sanitized.direccion}
                        </div>
                      </div>
                    </div>

                    {/* Fila 3: Contacto */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: spacing.md,
                        marginBottom: spacing.md,
                      }}
                    >
                      {/* Teléfono */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          padding: spacing.md,
                          background: colors.neutral[0],
                          borderRadius: borderRadius.md,
                        }}
                      >
                        <MdPhone size={16} style={{ color: config.theme.colors.primary }} />
                        <div>
                          <div style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>Teléfono</div>
                          <div style={{ color: colors.neutral[900], fontWeight: 'bold', fontSize: typography.fontSize.sm.size }}>
                            {sanitized.telefono}
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          padding: spacing.md,
                          background: colors.neutral[0],
                          borderRadius: borderRadius.md,
                        }}
                      >
                        <MdEmail size={16} style={{ color: config.theme.colors.primary }} />
                        <div>
                          <div style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>Email</div>
                          <div style={{ color: colors.neutral[900], fontWeight: 'bold', fontSize: typography.fontSize.sm.size }}>
                            {sanitized.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fila 4: Horarios y Días */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: spacing.md,
                        marginBottom: spacing.md,
                      }}
                    >
                      {/* Apertura */}
                      <div
                        style={{
                          padding: spacing.md,
                          background: colors.neutral[0],
                          borderRadius: borderRadius.md,
                          borderLeft: `3px solid ${config.theme.colors.primary}`,
                        }}
                      >
                        <div style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>Abre</div>
                        <div style={{ color: colors.neutral[900], fontWeight: 'bold', fontSize: typography.fontSize.sm.size }}>
                          {formatearHora(sanitized.horario_apertura)}
                        </div>
                      </div>

                      {/* Cierre */}
                      <div
                        style={{
                          padding: spacing.md,
                          background: colors.neutral[0],
                          borderRadius: borderRadius.md,
                          borderLeft: `3px solid ${config.theme.colors.secondary}`,
                        }}
                      >
                        <div style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>Cierra</div>
                        <div style={{ color: colors.neutral[900], fontWeight: 'bold', fontSize: typography.fontSize.sm.size }}>
                          {formatearHora(sanitized.horario_cierre)}
                        </div>
                      </div>

                      {/* Días */}
                      <div
                        style={{
                          padding: spacing.md,
                          background: colors.neutral[0],
                          borderRadius: borderRadius.md,
                          borderLeft: `3px solid ${colors.success.main}`,
                        }}
                      >
                        <div style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>Días</div>
                        <div style={{ color: colors.neutral[900], fontWeight: 'bold', fontSize: typography.fontSize.xs.size }}>
                          {sanitized.dias_atencion}
                        </div>
                      </div>
                    </div>

                    {/* Fila 5: Acciones */}
                    <div
                      style={{
                        display: 'flex',
                        gap: spacing.md,
                        paddingTop: spacing.md,
                        borderTop: `1px solid ${colors.neutral[200]}`,
                      }}
                    >
                      <button
                        onClick={() => handleEditConsultorio(sanitized.id)}
                        style={{
                          padding: `${spacing.sm} ${spacing.lg}`,
                          background: config.theme.colors.primary,
                          color: colors.neutral[0],
                          border: 'none',
                          borderRadius: borderRadius.md,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          fontSize: typography.fontSize.sm.size,
                          fontWeight: 'bold',
                          transition: '0.3s',
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.8'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        <MdEdit size={16} />
                        Editar
                      </button>

                      <button
                        onClick={() => handleDeleteConsultorio(sanitized.id)}
                        style={{
                          padding: `${spacing.sm} ${spacing.lg}`,
                          background: colors.error.main,
                          color: colors.neutral[0],
                          border: 'none',
                          borderRadius: borderRadius.md,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          fontSize: typography.fontSize.sm.size,
                          fontWeight: 'bold',
                          transition: '0.3s',
                        }}
                        onMouseEnter={e => e.target.style.opacity = '0.8'}
                        onMouseLeave={e => e.target.style.opacity = '1'}
                      >
                        <MdDelete size={16} />
                        Eliminar
                      </button>
                    </div>

                    {/* Fecha Creación */}
                    <div
                      style={{
                        marginTop: spacing.md,
                        paddingTop: spacing.md,
                        borderTop: `1px solid ${colors.neutral[200]}`,
                        fontSize: typography.fontSize.xs.size,
                        color: colors.neutral[500],
                      }}
                    >
                      Creado: {sanitized.fecha_creacion ? new Date(sanitized.fecha_creacion).toLocaleDateString('es-ES') : 'N/A'}
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
              <div style={{ fontSize: '48px', marginBottom: spacing.lg }}>🏥</div>
              <h3 style={{ color: colors.neutral[900], margin: 0, marginBottom: spacing.md }}>
                Sin consultorios
              </h3>
              <p style={{ color: colors.neutral[600], textAlign: 'center', maxWidth: '300px' }}>
                No hay consultorios registrados. Crea uno para comenzar.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS */}
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

export default Consultorios_Dashboard;