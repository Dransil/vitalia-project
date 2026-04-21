import React, { useState, useEffect } from 'react';
import { useTheme } from '../../Config/ThemeContext';
import { 
  MdAdd, MdErrorOutline, MdAccessTime, 
  MdPerson, MdSchedule, MdEdit, MdDelete, MdLocalHospital
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import * as horariosService from '../../Services/Horariosservice';
import * as usuariosService from '../../Services/Doctoresservice';
import * as consultoriosService from '../../Services/Consultorioservice'; // <-- NUEVO

const Schedule_Dashboard = () => {
  const themeContext = useTheme();
  
  const config = themeContext?.config || { theme: { colors: { primary: '#2563eb', secondary: '#7c3aed' } } };
  const colors = themeContext?.colors || {
    neutral: { 0: '#fff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 
               300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 
               700: '#374151', 800: '#1f2937', 900: '#111827' },
    error: { main: '#ef4444', light: '#fee2e2', dark: '#b91c1c' },
    success: { main: '#10b981', light: '#d1fae5', dark: '#065f46' }
  };
  const spacing = themeContext?.spacing || { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px' };
  const typography = themeContext?.typography || {
    fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '18px', xl: '20px', '2xl': '24px', '3xl': '30px' },
    fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700 }
  };
  const borderRadius = themeContext?.borderRadius || { sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px' };
  const shadows = themeContext?.shadows || { sm: '0 1px 2px 0 rgba(0,0,0,0.05)', md: '0 4px 6px -1px rgba(0,0,0,0.1)' };

  const navigate = useNavigate();

  const [horarios, setHorarios] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [consultorios, setConsultorios] = useState([]); // <-- NUEVO
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [viewMode, setViewMode] = useState('doctores'); // <-- NUEVO: 'doctores' | 'consultorios'

  const DIAS_SEMANA = [
    { id: 'Lun', nombre: 'Lunes' },
    { id: 'Mar', nombre: 'Martes' },
    { id: 'Mié', nombre: 'Miércoles' },
    { id: 'Jue', nombre: 'Jueves' },
    { id: 'Vie', nombre: 'Viernes' },
    { id: 'Sáb', nombre: 'Sábado' },
    { id: 'Dom', nombre: 'Domingo' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const resultHorarios = await horariosService.getHorarios();
      const resultDoctores = await usuariosService.getDoctores();
      const resultConsultorios = await consultoriosService.getConsultorios(); // <-- NUEVO
      
      const horariosValidos = resultHorarios.ok && Array.isArray(resultHorarios.data) 
        ? resultHorarios.data : [];
      const doctoresValidos = resultDoctores.ok && Array.isArray(resultDoctores.data) 
        ? resultDoctores.data : [];
      const consultoriosValidos = resultConsultorios.ok && Array.isArray(resultConsultorios.data) // <-- NUEVO
        ? resultConsultorios.data : [];
      
      setHorarios(horariosValidos);
      setDoctores(doctoresValidos);
      setConsultorios(consultoriosValidos); // <-- NUEVO
      
      if (horariosValidos.length > 0 && !selectedHorario) {
        setSelectedHorario(horariosValidos[0]);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setHasError(true);
      setErrorMsg('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const getDoctoresPorDia = (diaId) => {
    if (!doctores.length) return [];
    return doctores.filter(doctor => {
      const diasArray = (doctor.dias_atencion || '').split(',');
      return diasArray.includes(diaId);
    });
  };

  // NUEVO: igual lógica que doctores, usando la tabla consultorio
  const getConsultoriosPorDia = (diaId) => {
    if (!consultorios.length) return [];
    return consultorios.filter(consultorio => {
      const diasArray = (consultorio.dias_atencion || '').split(',');
      return diasArray.includes(diaId);
    });
  };

  const formatearHora = (hora) => {
    if (!hora) return 'N/A';
    return hora.substring(0, 5);
  };

  const handleCreateHorario = () => navigate('/horario/crear');
  const handleEditHorario = (id) => navigate(`/horario/edit/${id}`);
  const handleDeleteHorario = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este horario?')) {
      const result = await horariosService.deleteHorario(id);
      if (result.ok) {
        alert(result.msg || 'Horario eliminado');
        loadData();
      } else {
        alert(result.msg || 'Error al eliminar el horario');
      }
    }
  };
  const handleDoctorClick = (doctorId) => navigate(`/doctor/perfil/${doctorId}`);
  const handleConsultorioClick = (consultorioId) => navigate(`/consultorio/detalle/${consultorioId}`);

  const getSpacing = (key) => spacing[key] || spacing.md || '12px';

  return (
    <div style={{ padding: getSpacing('xl'), animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Header */}
      <div style={{ marginBottom: getSpacing('xl') }}>
        <h1 style={{ 
          fontSize: typography.fontSize['3xl'], 
          fontWeight: typography.fontWeight.bold, 
          color: colors.neutral[900], 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: getSpacing('sm')
        }}>
          <MdSchedule size={32} />
          Gestion de Horarios
        </h1>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div style={{
            width: '40px', height: '40px',
            border: `4px solid ${colors.neutral[200]}`,
            borderTop: `4px solid ${config.theme.colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      ) : hasError ? (
        <div style={{ textAlign: 'center', padding: getSpacing('xl') }}>
          <MdErrorOutline size={48} style={{ color: colors.error.main, marginBottom: getSpacing('lg') }} />
          <p style={{ color: colors.neutral[600] }}>{errorMsg}</p>
          <button onClick={loadData} style={{
            marginTop: getSpacing('lg'),
            padding: `${getSpacing('sm')} ${getSpacing('lg')}`,
            background: config.theme.colors.primary,
            color: colors.neutral[0],
            border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>Reintentar</button>
        </div>
      ) : (
        <>
          {/* Grid de Horarios */}
          <div style={{ position: 'relative', marginBottom: getSpacing('xl') }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: getSpacing('md') }}>
              <button
                onClick={handleCreateHorario}
                style={{
                  padding: `${getSpacing('sm')} ${getSpacing('lg')}`,
                  background: `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`,
                  color: colors.neutral[0], border: 'none', borderRadius: '12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: getSpacing('sm'),
                  fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, transition: '0.3s',
                }}
                onMouseEnter={e => e.target.style.opacity = '0.9'}
                onMouseLeave={e => e.target.style.opacity = '1'}
              >
                <MdAdd size={20} />
                Nuevo Horario
              </button>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              flexWrap: 'wrap', gap: getSpacing('lg')
            }}>
              {horarios.map((horario) => (
                <div
                  key={horario.id_horario}
                  onClick={() => setSelectedHorario(horario)}
                  style={{
                    minWidth: '160px',
                    padding: `${getSpacing('lg')} ${getSpacing('xl')}`,
                    background: selectedHorario?.id_horario === horario.id_horario
                      ? `linear-gradient(135deg, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`
                      : colors.neutral[0],
                    border: `2px solid ${selectedHorario?.id_horario === horario.id_horario ? 'transparent' : colors.neutral[200]}`,
                    borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
                    transition: '0.3s',
                    boxShadow: selectedHorario?.id_horario === horario.id_horario ? shadows.md : 'none',
                  }}
                  onMouseEnter={e => {
                    if (selectedHorario?.id_horario !== horario.id_horario) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = shadows.md;
                      e.currentTarget.style.borderColor = config.theme.colors.primary;
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedHorario?.id_horario !== horario.id_horario) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = colors.neutral[200];
                    }
                  }}
                >
                  <div style={{
                    fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold,
                    color: selectedHorario?.id_horario === horario.id_horario ? colors.neutral[0] : colors.neutral[900],
                    marginBottom: getSpacing('sm')
                  }}>
                    {horario.nombre}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: getSpacing('sm'), fontSize: typography.fontSize.sm,
                    color: selectedHorario?.id_horario === horario.id_horario ? colors.neutral[100] : colors.neutral[500],
                    marginBottom: getSpacing('md')
                  }}>
                    <MdAccessTime size={14} />
                    {formatearHora(horario.horario_inicio)} - {formatearHora(horario.horario_fin)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: getSpacing('sm') }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditHorario(horario.id_horario); }}
                      style={{
                        padding: `${getSpacing('xs')} ${getSpacing('sm')}`,
                        background: selectedHorario?.id_horario === horario.id_horario ? 'rgba(255,255,255,0.2)' : colors.neutral[100],
                        color: selectedHorario?.id_horario === horario.id_horario ? colors.neutral[0] : colors.neutral[600],
                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: getSpacing('xs'),
                        fontSize: typography.fontSize.xs, transition: '0.3s',
                      }}
                      onMouseEnter={e => e.target.style.opacity = '0.8'}
                      onMouseLeave={e => e.target.style.opacity = '1'}
                    >
                      <MdEdit size={14} /> Editar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteHorario(horario.id_horario); }}
                      style={{
                        padding: `${getSpacing('xs')} ${getSpacing('sm')}`,
                        background: selectedHorario?.id_horario === horario.id_horario ? 'rgba(255,255,255,0.2)' : colors.error.light,
                        color: selectedHorario?.id_horario === horario.id_horario ? colors.neutral[0] : colors.error.main,
                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: getSpacing('xs'),
                        fontSize: typography.fontSize.xs, transition: '0.3s',
                      }}
                      onMouseEnter={e => e.target.style.opacity = '0.8'}
                      onMouseLeave={e => e.target.style.opacity = '1'}
                    >
                      <MdDelete size={14} /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== SECCIÓN DÍAS ===== */}
          <div>
            {/* Título + Switch */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: getSpacing('lg'),
              marginTop: getSpacing('xl'),
              flexWrap: 'wrap',
              gap: getSpacing('md'),
            }}>
              <h2 style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
              }}>
                {viewMode === 'doctores' ? 'Doctores por Día de la Semana' : 'Consultorios por Día de la Semana'}
              </h2>

              {/* Switch toggle */}
              <div style={{
                display: 'inline-flex',
                background: colors.neutral[100],
                borderRadius: '12px',
                padding: '4px',
                gap: '4px',
              }}>
                {['doctores', 'consultorios'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      padding: `${getSpacing('sm')} ${getSpacing('lg')}`,
                      background: viewMode === mode
                        ? `linear-gradient(135deg, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`
                        : 'transparent',
                      color: viewMode === mode ? colors.neutral[0] : colors.neutral[600],
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: getSpacing('xs'),
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.semibold,
                      transition: '0.25s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {mode === 'doctores' ? <MdPerson size={16} /> : <MdLocalHospital size={16} />}
                    {mode === 'doctores' ? 'Doctores' : 'Consultorios'}
                  </button>
                ))}
              </div>
            </div>

            {/* Grilla de días */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: getSpacing('md'),
            }}>
              {DIAS_SEMANA.map((dia) => {
                const items = viewMode === 'doctores'
                  ? getDoctoresPorDia(dia.id)
                  : getConsultoriosPorDia(dia.id);

                return (
                  <div
                    key={dia.id}
                    style={{
                      background: colors.neutral[0],
                      border: `2px solid ${items.length > 0 ? config.theme.colors.primary : colors.neutral[200]}`,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '400px',
                      maxHeight: '500px',
                    }}
                  >
                    {/* Cabecera del día */}
                    <div style={{
                      background: items.length > 0
                        ? `linear-gradient(135deg, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`
                        : colors.neutral[200],
                      color: items.length > 0 ? colors.neutral[0] : colors.neutral[600],
                      padding: getSpacing('md'),
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold }}>
                        {dia.nombre}
                      </div>
                      <div style={{ fontSize: typography.fontSize.xs, opacity: 0.9, marginTop: getSpacing('xs') }}>
                        {items.length} {viewMode === 'doctores'
                          ? (items.length === 1 ? 'doctor' : 'doctores')
                          : (items.length === 1 ? 'consultorio' : 'consultorios')}
                      </div>
                    </div>

                    {/* Lista de items */}
                    <div style={{ padding: getSpacing('sm'), overflowY: 'auto', flex: 1 }}>
                      {items.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: getSpacing('sm') }}>
                          {viewMode === 'doctores' ? (
                            items.map((doctor) => (
                              <div
                                key={doctor.id_usuario}
                                onClick={() => handleDoctorClick(doctor.id_usuario)}
                                style={{
                                  background: colors.neutral[50], borderRadius: '10px',
                                  padding: `${getSpacing('sm')} ${getSpacing('md')}`,
                                  cursor: 'pointer', transition: '0.3s',
                                  border: `1px solid ${colors.neutral[200]}`,
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = `${config.theme.colors.primary}10`;
                                  e.currentTarget.style.borderColor = config.theme.colors.primary;
                                  e.currentTarget.style.transform = 'translateX(2px)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = colors.neutral[50];
                                  e.currentTarget.style.borderColor = colors.neutral[200];
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                                title={`Dr(a). ${doctor.nombre} ${doctor.apellido}`}
                              >
                                <div style={{
                                  fontWeight: typography.fontWeight.semibold,
                                  fontSize: typography.fontSize.xs, color: colors.neutral[800],
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                }}>
                                  Dr(a). {doctor.nombre} {doctor.apellido}
                                </div>
                                {doctor.asignaciones?.length > 0 && (
                                  <div style={{
                                    fontSize: typography.fontSize.xs, color: config.theme.colors.primary,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px'
                                  }}>
                                    {doctor.asignaciones[0]?.Especialidad?.nombre || 'Sin especialidad'}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            items.map((consultorio) => (
                              <div
                                key={consultorio.id_consultorio}
                                onClick={() => handleConsultorioClick(consultorio.id_consultorio)}
                                style={{
                                  background: colors.neutral[50], borderRadius: '10px',
                                  padding: `${getSpacing('sm')} ${getSpacing('md')}`,
                                  cursor: 'pointer', transition: '0.3s',
                                  border: `1px solid ${colors.neutral[200]}`,
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.background = `${config.theme.colors.primary}10`;
                                  e.currentTarget.style.borderColor = config.theme.colors.primary;
                                  e.currentTarget.style.transform = 'translateX(2px)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.background = colors.neutral[50];
                                  e.currentTarget.style.borderColor = colors.neutral[200];
                                  e.currentTarget.style.transform = 'translateX(0)';
                                }}
                                title={consultorio.nombre}
                              >
                                <div style={{
                                  fontWeight: typography.fontWeight.semibold,
                                  fontSize: typography.fontSize.xs, color: colors.neutral[800],
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                }}>
                                  {consultorio.nombre}
                                </div>
                                {consultorio.ciudad && (
                                  <div style={{
                                    fontSize: typography.fontSize.xs, color: config.theme.colors.primary,
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px'
                                  }}>
                                    {consultorio.ciudad}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: getSpacing('xl'), color: colors.neutral[400] }}>
                          {viewMode === 'doctores'
                            ? <MdPerson size={24} style={{ marginBottom: getSpacing('sm') }} />
                            : <MdLocalHospital size={24} style={{ marginBottom: getSpacing('sm') }} />
                          }
                          <div style={{ fontSize: typography.fontSize.xs }}>
                            {viewMode === 'doctores' ? 'Sin doctores' : 'Sin consultorios'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Schedule_Dashboard;