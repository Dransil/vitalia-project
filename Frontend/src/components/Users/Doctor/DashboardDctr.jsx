import React, { useState } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import { MdSearch, MdClose, MdAdd, MdErrorOutline } from 'react-icons/md';

const Doctor_Dashboard = () => {
  const { config, colors, spacing, typography, borderRadius, shadows } = useTheme();
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(true);

  const handleClearFilters = () => {
    setSearchName('');
    setSearchEmail('');
    setSearchPhone('');
  };

  const handleCreateUser = () => {
    console.log('Crear nuevo usuario');
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
            margin: 0,
            marginBottom: spacing.md,
          }}
        >
          Registro General de Doctor_Dashboard
        </h1>
        <p style={{ color: colors.neutral[600], margin: 0 }}>
          Gestiona todos los profesionales médicos del sistema
        </p>
      </div>

      {/* Sección de Filtros */}
      <div
        style={{
          background: colors.neutral[0],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.xl,
          padding: spacing.lg,
          boxShadow: shadows.md,
          marginBottom: spacing.lg,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: spacing.lg,
            alignItems: 'flex-end',
          }}
        >
          {/* Campo Nombre/Apellido */}
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
              Nombre o Apellido
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
                placeholder="Buscar por nombre o apellido..."
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

          {/* Campo Email */}
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
              Email
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
                type="email"
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
                placeholder="Buscar por email..."
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

          {/* Campo Teléfono - NUEVO */}
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
              Teléfono
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
                type="tel"
                value={searchPhone}
                onChange={e => setSearchPhone(e.target.value)}
                placeholder="Buscar por teléfono..."
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

          {/* Botón Quitar Filtros */}
          <button
            onClick={handleClearFilters}
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
              justifyContent: 'center',
            }}
            onMouseEnter={e => e.target.style.background = colors.neutral[300]}
            onMouseLeave={e => e.target.style.background = colors.neutral[200]}
          >
            <MdClose size={18} />
            Quitar Filtros
          </button>
        </div>
      </div>

      {/* Botón Crear Usuario */}
      <div style={{ marginBottom: spacing.lg }}>
        <button
          onClick={handleCreateUser}
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
          Crear Nuevo Usuario
        </button>
      </div>

      {/* Contenedor de Usuarios */}
      <div
        style={{
          background: colors.neutral[0],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.md,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '600px',
        }}
      >
        {/* Contenido Scrollable */}
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
                  marginBottom: spacing.md,
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
                  marginBottom: spacing.lg,
                  margin: 0,
                  marginBottom: spacing.lg,
                  textAlign: 'center',
                  maxWidth: '300px',
                }}
              >
                Parece que ocurrió un problema al intentar cargar la lista de Doctor_Dashboard. Por favor, intenta más tarde.
              </p>

              <button
                onClick={() => window.location.reload()}
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
                Cargando Doctor_Dashboard...
              </p>
            </div>
          ) : (
            // Data State (cuando esté conectada la BD)
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.md,
              }}
            >
              <p
                style={{
                  color: colors.neutral[500],
                  fontSize: typography.fontSize.sm.size,
                  textAlign: 'center',
                }}
              >
                Los usuarios aparecerán aquí cuando se conecte la base de datos
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS para animación de carga */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Doctor_Dashboard;