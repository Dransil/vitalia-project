import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import { MdSearch, MdClose, MdAdd, MdErrorOutline, MdEdit, MdDelete, MdCall, MdEmail, MdCake } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { IoPersonOutline } from "react-icons/io5";
import * as pacientesService from '../../../Services/Pacienteservice';

const Pacientes_Dashboard = () => {
  const { config, colors, spacing, typography, borderRadius, shadows } = useTheme();
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  const [pacientes, setPacientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    setIsLoading(true);
    setHasError(false);
    const result = await pacientesService.getPacientes();

    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      console.log('✅ Pacientes cargados:', datosValidos);
      setPacientes(datosValidos);
      setHasError(false);
    } else {
      setPacientes([]);
      setHasError(true);
      setErrorMsg(result.msg || 'Error al cargar los pacientes');
      console.error('❌ Error:', result.msg);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchName && !searchEmail && !searchPhone) {
      loadPacientes();
      return;
    }

    setIsLoading(true);
    setHasError(false);
    const result = await pacientesService.searchPacientes(searchName, searchEmail, searchPhone);

    if (result.ok) {
      const datosValidos = Array.isArray(result.data) ? result.data : [];
      setPacientes(datosValidos);
      setHasError(false);
    } else {
      setPacientes([]);
      setHasError(true);
      setErrorMsg(result.msg || 'Error en la búsqueda');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName, searchEmail, searchPhone]);

  const handleClearFilters = () => {
    setSearchName('');
    setSearchEmail('');
    setSearchPhone('');
  };

  const handleCreatePaciente = () => {
    navigate('/Patient_Register');
  };

  const handleEditPaciente = (id) => {
    navigate(`/paciente/edit/${id}`);
  };

  const handleDeletePaciente = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      const result = await pacientesService.cambiarEstadoPaciente(id);
      if (result.ok) {
        alert(result.msg || 'Paciente desactivado');
        loadPacientes();
      } else {
        alert(result.msg || 'Error al desactivar el paciente');
      }
    }
  };

  const sanitizePaciente = (paciente) => {
    if (!paciente || typeof paciente !== 'object') {
      console.warn('Datos inválidos para paciente:', paciente);
      return null;
    }

    return {
      id: paciente.id_paciente || paciente.id || 0,
      nombre: paciente.nombre || 'Sin nombre',
      apellido: paciente.apellido || 'Sin apellido',
      email: paciente.email || 'Sin email',
      telefono: paciente.telefono || 'N/A',
      cedula: paciente.cedula || 'N/A',
      estado: paciente.estado || 'desconocido',
      fecha_nacimiento: paciente.fecha_nacimiento || 'No especificado',
      genero: paciente.genero || 'No especificado',
      direccion: paciente.direccion || 'No especificada',
      ciudad: paciente.ciudad || 'No especificada',
      grupo_sanguineo: paciente.grupo_sanguineo || 'No especificado',
      alergias: paciente.alergias || 'Sin alergias registradas',
      condiciones_medicas: paciente.condiciones_medicas || 'Sin condiciones',
      registrado_por: paciente.registrado_por || null,
      fecha_creacion: paciente.fecha_creacion || null,
    };
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento || fechaNacimiento === 'No especificado') return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
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
          Registro de Pacientes
        </h1>
        <p style={{ color: colors.neutral[600], margin: 0 }}>
          Gestiona todos los pacientes del consultorio
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
              <MdSearch size={20} style={{ position: 'absolute', left: spacing.md, color: colors.neutral[400] }} />
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
              <MdSearch size={20} style={{ position: 'absolute', left: spacing.md, color: colors.neutral[400] }} />
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

          {/* Campo Teléfono */}
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
              <MdSearch size={20} style={{ position: 'absolute', left: spacing.md, color: colors.neutral[400] }} />
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

      {/* Botón Crear Paciente */}
      <div style={{ marginBottom: spacing.lg }}>
        <button
          onClick={handleCreatePaciente}
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
          Crear Nuevo Paciente
        </button>
      </div>

      {/* Contenedor de Pacientes */}
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
        <div style={{ flex: 1, overflow: 'auto', padding: spacing.lg }}>
          {hasError ? (
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
                <MdErrorOutline size={40} style={{ color: colors.error.main }} />
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
                {errorMsg || 'Parece que ocurrió un problema al intentar cargar la lista de pacientes. Por favor, intenta más tarde.'}
              </p>
              <button
                onClick={loadPacientes}
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
                Cargando pacientes...
              </p>
            </div>
          ) : pacientes && pacientes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {pacientes.map((paciente) => {
                const sanitized = sanitizePaciente(paciente);
                if (!sanitized) return null;

                const edad = calcularEdad(sanitized.fecha_nacimiento);

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
                    {/* Información del Paciente */}
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                         
                          fontSize: typography?.fontSize?.md?.size || '16px',
                          fontWeight: typography?.fontWeight?.bold || 'bold',
                          color: colors.neutral[900],
                          margin: 0,
                          marginBottom: spacing.sm,
                        }}
                      >
                        {sanitized.nombre} {sanitized.apellido}
                      </h4>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: spacing.md,
                          marginBottom: spacing.sm,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                          <MdEmail size={16} style={{ color: colors.neutral[500] }} />
                          <span style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>
                            {sanitized.email}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                          <MdCall size={16} style={{ color: colors.neutral[500] }} />
                          <span style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>
                            {sanitized.telefono}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                          <MdCake size={16} style={{ color: colors.neutral[500] }} />
                          <span style={{ fontSize: typography.fontSize.xs.size, color: colors.neutral[600] }}>
                            {edad} años
                          </span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap', marginTop: spacing.md }}>
                        <span
                          style={{
                            fontSize: typography.fontSize.xs.size,
                            padding: `${spacing.sm / 2}px ${spacing.sm}`,
                            background: colors.neutral[200],
                            color: colors.neutral[800],
                            borderRadius: borderRadius.sm,
                          }}
                        >
                          Cédula: {sanitized.cedula}
                        </span>

                        {sanitized.grupo_sanguineo !== 'No especificado' && (
                          <span
                            style={{
                              fontSize: typography.fontSize.xs.size,
                              padding: `${spacing.sm / 2}px ${spacing.sm}`,
                              background: colors.error.light,
                              color: colors.error.dark,
                              borderRadius: borderRadius.sm,
                              fontWeight: 'bold',
                            }}
                          >
                            {sanitized.grupo_sanguineo}
                          </span>
                        )}

                        <span
                          style={{
                            fontSize: typography.fontSize.xs.size,
                            padding: `${spacing.sm / 2}px ${spacing.sm}`,
                            background: sanitized.estado === 'activo' ? colors.success.light : colors.error.light,
                            color: sanitized.estado === 'activo' ? colors.success.dark : colors.error.dark,
                            borderRadius: borderRadius.sm,
                            textTransform: 'capitalize',
                          }}
                        >
                          {sanitized.estado}
                        </span>
                      </div>
                    </div>

                    {/* Botones de Acciones */}
                    <div style={{ display: 'flex', gap: spacing.md, marginLeft: spacing.lg }}>
                      <button
                        onClick={() => handleEditPaciente(sanitized.id)}
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
                        onClick={() => handleDeletePaciente(sanitized.id)}
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
                <IoPersonOutline />
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
                Sin pacientes
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
                No hay pacientes registrados. Crea uno para comenzar.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Pacientes_Dashboard;