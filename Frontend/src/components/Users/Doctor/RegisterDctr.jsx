import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import { 
  MdArrowBack, MdArrowForward, MdCheck, MdPerson, 
  MdWork, MdSchedule, MdSecurity, MdErrorOutline,
  MdVisibility, MdVisibilityOff, MdClose, MdAccessTime
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import api from '../../../Services/Api';

const RegisterDct = () => {
  const { config, colors, spacing, typography, borderRadius, shadows } = useTheme();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Datos desde la BD
  const [horarios, setHorarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    // Informacion Personal
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    // Informacion Profesional
    id_especialidad: '',
    id_consultorio: '',
    // Horario (predefinido)
    id_horario: '',
    // Credenciales
    contraseña: '',
    confirmarContraseña: '',
    // Dias de atencion
    dias_atencion: []
  });

  const [passwordValidation, setPasswordValidation] = useState({
    mayuscula: false,
    minuscula: false,
    numero: false,
    caracterEspecial: false,
    minimo8: false,
  });

  const diasSemana = [
    { id: 'Lun', nombre: 'Lunes' },
    { id: 'Mar', nombre: 'Martes' },
    { id: 'Mie', nombre: 'Miércoles' },
    { id: 'Jue', nombre: 'Jueves' },
    { id: 'Vie', nombre: 'Viernes' },
    { id: 'Sab', nombre: 'Sábado' },
    { id: 'Dom', nombre: 'Domingo' }
  ];

  const pasos = [
    { titulo: 'Informacion Personal', icono: MdPerson },
    { titulo: 'Informacion Profesional', icono: MdWork },
    { titulo: 'Horario de Atencion', icono: MdSchedule },
    { titulo: 'Credenciales de Acceso', icono: MdSecurity }
  ];

  // Cargar datos desde la BD
  useEffect(() => {
    const loadCatalogos = async () => {
      setLoadingData(true);
      try {
        // Cargar horarios predefinidos
        const horariosResponse = await api.get('/horarios', true);
        if (horariosResponse.ok) {
          setHorarios(horariosResponse.data || []);
        }

        // Cargar especialidades
        const especialidadesResponse = await api.get('/especialidades', true);
        if (especialidadesResponse.ok) {
          setEspecialidades(especialidadesResponse.data || []);
        }

        // Cargar consultorios
        const consultoriosResponse = await api.get('/consultorios', true);
        if (consultoriosResponse.ok) {
          setConsultorios(consultoriosResponse.data || []);
        }
      } catch (error) {
        console.error('Error cargando catalogos:', error);
        setError('Error al cargar los datos necesarios');
      } finally {
        setLoadingData(false);
      }
    };

    loadCatalogos();
  }, []);

  const validatePassword = (password) => {
    const validation = {
      mayuscula: /[A-Z]/.test(password),
      minuscula: /[a-z]/.test(password),
      numero: /[0-9]/.test(password),
      caracterEspecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      minimo8: password.length >= 8,
    };
    return validation;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'contraseña') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleDiaToggle = (diaId) => {
    setFormData(prev => {
      const nuevosDias = prev.dias_atencion.includes(diaId)
        ? prev.dias_atencion.filter(d => d !== diaId)
        : [...prev.dias_atencion, diaId];
      return { ...prev, dias_atencion: nuevosDias };
    });
  };

  const validarPasoActual = () => {
    if (currentStep === 0) {
      if (!formData.nombre || !formData.apellido || !formData.email || 
          !formData.cedula || !formData.telefono) {
        setError('Todos los campos de informacion personal son requeridos');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Email no valido');
        return false;
      }
      if (!/^[0-9\-\+\(\)\s]{7,}$/.test(formData.telefono)) {
        setError('Telefono no valido');
        return false;
      }
    }
    
    if (currentStep === 1) {
      if (!formData.id_especialidad || !formData.id_consultorio) {
        setError('Especialidad y consultorio son requeridos');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.id_horario) {
        setError('Seleccione un horario de atencion');
        return false;
      }
      if (formData.dias_atencion.length === 0) {
        setError('Seleccione al menos un dia de atencion');
        return false;
      }
    }
    
    if (currentStep === 3) {
      if (!formData.contraseña || !formData.confirmarContraseña) {
        setError('La contraseña es requerida');
        return false;
      }
      if (!passwordValidation.mayuscula || !passwordValidation.minuscula || 
          !passwordValidation.numero || !passwordValidation.caracterEspecial || 
          !passwordValidation.minimo8) {
        setError('La contraseña no cumple con los requisitos');
        return false;
      }
      if (formData.contraseña !== formData.confirmarContraseña) {
        setError('Las contraseñas no coinciden');
        return false;
      }
    }
    
    setError('');
    return true;
  };

  const siguientePaso = () => {
    if (validarPasoActual() && currentStep < pasos.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const pasoAnterior = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleBack = () => {
    navigate('/Doctor_Dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarPasoActual()) {
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const dataToSend = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        cedula: formData.cedula.trim(),
        telefono: formData.telefono.trim(),
        contraseña_hash: formData.contraseña,
        id_especialidad: parseInt(formData.id_especialidad),
        id_consultorio: parseInt(formData.id_consultorio),
        id_horario: parseInt(formData.id_horario),
        dias_atencion: formData.dias_atencion.join(','),
        rol: 'doctor',
        estado: 'activo',
      };

      const response = await api.post('/usuarios', dataToSend, true);

      if (response.ok) {
        setSuccess('Doctor creado exitosamente');
        setTimeout(() => {
          navigate('/Doctor_Dashboard');
        }, 1500);
      } else {
        setError(response.msg || 'Error al crear el doctor');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al crear el doctor');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / pasos.length) * 100;
  const CurrentIcon = pasos[currentStep].icono;

  const isFormValid = () => {
    return formData.nombre && formData.apellido && formData.email && 
           formData.cedula && formData.telefono && formData.id_especialidad && 
           formData.id_consultorio && formData.id_horario &&
           formData.dias_atencion.length > 0 && formData.contraseña && 
           formData.contraseña === formData.confirmarContraseña &&
           passwordValidation.mayuscula && passwordValidation.minuscula &&
           passwordValidation.numero && passwordValidation.caracterEspecial &&
           passwordValidation.minimo8;
  };

  // Obtener informacion del horario seleccionado
  const horarioSeleccionado = horarios.find(h => h.id_horario === parseInt(formData.id_horario));

  if (loadingData) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: colors.neutral[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div>
          <div style={{
            width: '40px',
            height: '40px',
            border: `4px solid ${colors.neutral[200]}`,
            borderTop: `4px solid ${config.theme.colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} />
          <p style={{ marginTop: spacing.lg, color: colors.neutral[600] }}>
            Cargando datos...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: config.theme.background || colors.primary[50],
        overflow: 'auto',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: colors.neutral[0],
          borderBottom: `1px solid ${colors.neutral[200]}`,
          padding: spacing.lg,
          boxShadow: shadows.sm,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <button
            onClick={handleBack}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: typography.fontSize.xl.size,
              color: colors.neutral[600],
              display: 'flex',
              alignItems: 'center',
              padding: spacing.sm,
            }}
          >
            <MdArrowBack size={24} />
          </button>
          <h1
            style={{
              fontSize: typography.fontSize['2xl'].size,
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
              margin: 0,
            }}
          >
            Crear Nuevo Doctor
          </h1>
        </div>
      </div>

      {/* Contenido Principal */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: spacing.xl,
        }}
      >
        {/* Mensajes de Error/Exito */}
        {error && (
          <div
            style={{
              padding: spacing.md,
              marginBottom: spacing.lg,
              backgroundColor: colors.error.light,
              border: `2px solid ${colors.error.main}`,
              color: colors.error.dark,
              borderRadius: borderRadius.lg,
              fontWeight: typography.fontWeight.semibold,
              fontSize: typography.fontSize.sm.size,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <MdErrorOutline size={20} />
            {error}
          </div>
        )}
        
        {success && (
          <div
            style={{
              padding: spacing.md,
              marginBottom: spacing.lg,
              backgroundColor: colors.success.light,
              border: `2px solid ${colors.success.main}`,
              color: colors.success.dark,
              borderRadius: borderRadius.lg,
              fontWeight: typography.fontWeight.semibold,
              fontSize: typography.fontSize.sm.size,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <MdCheck size={20} />
            {success}
          </div>
        )}

        {/* Progress Bar */}
        <div
          style={{
            background: colors.neutral[0],
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            boxShadow: shadows.sm,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: spacing.md,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[700],
              }}
            >
              <CurrentIcon size={20} style={{ color: config.theme.colors.primary }} />
              Paso {currentStep + 1} de {pasos.length}
            </div>
            <div
              style={{
                fontSize: typography.fontSize.sm.size,
                fontWeight: typography.fontWeight.medium,
                color: colors.neutral[600],
              }}
            >
              {pasos[currentStep].titulo}
            </div>
          </div>
          
          <div
            style={{
              height: '8px',
              background: colors.neutral[200],
              borderRadius: borderRadius.full,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`,
                borderRadius: borderRadius.full,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: colors.neutral[0],
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: borderRadius.xl,
              padding: spacing.xl,
              boxShadow: shadows.md,
            }}
          >
            {/* Paso 1: Informacion Personal */}
            {currentStep === 0 && (
              <div>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg.size,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    margin: 0,
                    marginBottom: spacing.lg,
                    paddingBottom: spacing.md,
                    borderBottom: `2px solid ${colors.neutral[200]}`,
                  }}
                >
                  Informacion Personal
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.lg,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                        marginBottom: spacing.xs,
                      }}
                    >
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `2px solid ${colors.neutral[200]}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.sm.size,
                        outline: 'none',
                        transition: '0.3s',
                      }}
                      onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                      placeholder="Nombre del doctor"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                        marginBottom: spacing.xs,
                      }}
                    >
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `2px solid ${colors.neutral[200]}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.sm.size,
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                      placeholder="Apellido del doctor"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                        marginBottom: spacing.xs,
                      }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `2px solid ${colors.neutral[200]}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.sm.size,
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                      placeholder="doctor@email.com"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                        marginBottom: spacing.xs,
                      }}
                    >
                      Cedula *
                    </label>
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `2px solid ${colors.neutral[200]}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.sm.size,
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                      placeholder="12345678"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                        marginBottom: spacing.xs,
                      }}
                    >
                      Telefono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `2px solid ${colors.neutral[200]}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.sm.size,
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                      placeholder="0999999999"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 2: Informacion Profesional */}
            {currentStep === 1 && (
              <div>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg.size,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    margin: 0,
                    marginBottom: spacing.lg,
                    paddingBottom: spacing.md,
                    borderBottom: `2px solid ${colors.neutral[200]}`,
                  }}
                >
                  Informacion Profesional
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.lg,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                        marginBottom: spacing.xs,
                      }}
                    >
                      Especialidad *
                    </label>
                    <select
                      name="id_especialidad"
                      value={formData.id_especialidad}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `2px solid ${colors.neutral[200]}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.sm.size,
                        background: colors.neutral[0],
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    >
                      <option value="">Selecciona una especialidad</option>
                      {especialidades.map(esp => (
                        <option key={esp.id_especialidad} value={esp.id_especialidad}>
                          {esp.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                        marginBottom: spacing.xs,
                      }}
                    >
                      Consultorio *
                    </label>
                    <select
                      name="id_consultorio"
                      value={formData.id_consultorio}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: spacing.md,
                        border: `2px solid ${colors.neutral[200]}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.sm.size,
                        background: colors.neutral[0],
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    >
                      <option value="">Selecciona un consultorio</option>
                      {consultorios.map(cons => (
                        <option key={cons.id_consultorio} value={cons.id_consultorio}>
                          {cons.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Horario de Atencion */}
            {currentStep === 2 && (
              <div>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg.size,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    margin: 0,
                    marginBottom: spacing.lg,
                    paddingBottom: spacing.md,
                    borderBottom: `2px solid ${colors.neutral[200]}`,
                  }}
                >
                  Horario de Atencion
                </h3>

                <div style={{ marginBottom: spacing.xl }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[700],
                      marginBottom: spacing.sm,
                    }}
                  >
                    Seleccione un Horario *
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: spacing.md,
                    }}
                  >
                    {horarios.map(horario => (
                      <label
                        key={horario.id_horario}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.md,
                          padding: spacing.md,
                          background: formData.id_horario === String(horario.id_horario)
                            ? `${config.theme.colors.primary}10`
                            : colors.neutral[50],
                          border: `2px solid ${formData.id_horario === String(horario.id_horario)
                            ? config.theme.colors.primary
                            : colors.neutral[200]}`,
                          borderRadius: borderRadius.lg,
                          cursor: 'pointer',
                          transition: '0.3s',
                        }}
                      >
                        <input
                          type="radio"
                          name="id_horario"
                          value={horario.id_horario}
                          checked={formData.id_horario === String(horario.id_horario)}
                          onChange={handleInputChange}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: config.theme.colors.primary,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: typography.fontWeight.semibold,
                              fontSize: typography.fontSize.md.size,
                              color: formData.id_horario === String(horario.id_horario)
                                ? config.theme.colors.primary
                                : colors.neutral[800],
                              marginBottom: spacing.xs,
                            }}
                          >
                            {horario.nombre}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: spacing.md,
                              fontSize: typography.fontSize.sm.size,
                              color: colors.neutral[600],
                            }}
                          >
                            <MdAccessTime size={16} />
                            <span>{horario.horario_inicio.substring(0, 5)} - {horario.horario_fin.substring(0, 5)}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mostrar resumen del horario seleccionado */}
                {horarioSeleccionado && (
                  <div
                    style={{
                      padding: spacing.md,
                      background: colors.success.light,
                      borderRadius: borderRadius.md,
                      marginBottom: spacing.xl,
                      border: `1px solid ${colors.success.main}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                        marginBottom: spacing.sm,
                      }}
                    >
                      <MdCheck size={18} style={{ color: colors.success.dark }} />
                      <span
                        style={{
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.success.dark,
                        }}
                      >
                        Horario seleccionado: {horarioSeleccionado.nombre}
                      </span>
                    </div>
                    <div style={{ fontSize: typography.fontSize.sm.size, color: colors.success.dark }}>
                      Horario: {horarioSeleccionado.horario_inicio.substring(0, 5)} - {horarioSeleccionado.horario_fin.substring(0, 5)}
                    </div>
                  </div>
                )}

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm.size,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.neutral[700],
                      marginBottom: spacing.md,
                    }}
                  >
                    Dias de Atencion * (Seleccione los dias que trabaja)
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                      gap: spacing.md,
                    }}
                  >
                    {diasSemana.map(dia => (
                      <label
                        key={dia.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.sm,
                          padding: spacing.md,
                          background: formData.dias_atencion.includes(dia.id)
                            ? `${config.theme.colors.primary}10`
                            : colors.neutral[50],
                          border: `2px solid ${formData.dias_atencion.includes(dia.id)
                            ? config.theme.colors.primary
                            : colors.neutral[200]}`,
                          borderRadius: borderRadius.md,
                          cursor: 'pointer',
                          transition: '0.3s',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.dias_atencion.includes(dia.id)}
                          onChange={() => handleDiaToggle(dia.id)}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: config.theme.colors.primary,
                          }}
                        />
                        <span
                          style={{
                            fontSize: typography.fontSize.sm.size,
                            fontWeight: formData.dias_atencion.includes(dia.id)
                              ? typography.fontWeight.semibold
                              : typography.fontWeight.regular,
                            color: formData.dias_atencion.includes(dia.id)
                              ? config.theme.colors.primary
                              : colors.neutral[600],
                          }}
                        >
                          {dia.nombre}
                        </span>
                      </label>
                    ))}
                  </div>

                  {formData.dias_atencion.length > 0 && (
                    <div
                      style={{
                        marginTop: spacing.md,
                        padding: spacing.sm,
                        background: colors.success.light,
                        borderRadius: borderRadius.md,
                        display: 'inline-block',
                      }}
                    >
                      <span
                        style={{
                          fontSize: typography.fontSize.xs.size,
                          color: colors.success.dark,
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.xs,
                        }}
                      >
                        <MdCheck size={14} />
                        Dias seleccionados: {formData.dias_atencion.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 4: Credenciales de Acceso */}
            {currentStep === 3 && (
              <div>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg.size,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                    margin: 0,
                    marginBottom: spacing.lg,
                    paddingBottom: spacing.md,
                    borderBottom: `2px solid ${colors.neutral[200]}`,
                  }}
                >
                  Credenciales de Acceso
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing.lg,
                    marginBottom: spacing.lg,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                        marginBottom: spacing.xs,
                      }}
                    >
                      Contraseña *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="contraseña"
                        value={formData.contraseña}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: `${spacing.md} ${spacing.xl} ${spacing.md} ${spacing.md}`,
                          border: `2px solid ${colors.neutral[200]}`,
                          borderRadius: borderRadius.md,
                          fontSize: typography.fontSize.sm.size,
                          outline: 'none',
                          transition: '0.3s',
                        }}
                        onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: spacing.md,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: colors.neutral[500],
                        }}
                      >
                        {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[700],
                        marginBottom: spacing.xs,
                      }}
                    >
                      Confirmar Contraseña *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmarContraseña"
                        value={formData.confirmarContraseña}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: `${spacing.md} ${spacing.xl} ${spacing.md} ${spacing.md}`,
                          border: `2px solid ${
                            formData.confirmarContraseña && formData.contraseña !== formData.confirmarContraseña
                              ? colors.error.main
                              : colors.neutral[200]
                          }`,
                          borderRadius: borderRadius.md,
                          fontSize: typography.fontSize.sm.size,
                          outline: 'none',
                          transition: '0.3s',
                        }}
                        onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: spacing.md,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: colors.neutral[500],
                        }}
                      >
                        {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                      </button>
                    </div>
                    {formData.confirmarContraseña && formData.contraseña !== formData.confirmarContraseña && (
                      <p style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size, marginTop: spacing.xs }}>
                        Las contraseñas no coinciden
                      </p>
                    )}
                  </div>
                </div>

                {/* Requisitos de Contraseña */}
                {formData.contraseña && (
                  <div
                    style={{
                      padding: spacing.md,
                      background: colors.neutral[50],
                      border: `1px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <p
                      style={{
                        fontSize: typography.fontSize.sm.size,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.neutral[900],
                        margin: 0,
                        marginBottom: spacing.md,
                      }}
                    >
                      Requisitos de contraseña:
                    </p>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: spacing.md,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        {passwordValidation.mayuscula ? (
                          <MdCheck size={18} style={{ color: colors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: colors.error.main }} />
                        )}
                        <span style={{ fontSize: typography.fontSize.xs.size }}>Una mayuscula (A-Z)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        {passwordValidation.minuscula ? (
                          <MdCheck size={18} style={{ color: colors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: colors.error.main }} />
                        )}
                        <span style={{ fontSize: typography.fontSize.xs.size }}>Una minuscula (a-z)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        {passwordValidation.numero ? (
                          <MdCheck size={18} style={{ color: colors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: colors.error.main }} />
                        )}
                        <span style={{ fontSize: typography.fontSize.xs.size }}>Un numero (0-9)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        {passwordValidation.caracterEspecial ? (
                          <MdCheck size={18} style={{ color: colors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: colors.error.main }} />
                        )}
                        <span style={{ fontSize: typography.fontSize.xs.size }}>Caracter especial (!@#$%^&*)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        {passwordValidation.minimo8 ? (
                          <MdCheck size={18} style={{ color: colors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: colors.error.main }} />
                        )}
                        <span style={{ fontSize: typography.fontSize.xs.size }}>Minimo 8 caracteres</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: spacing.md,
                marginTop: spacing['2xl'],
                paddingTop: spacing.lg,
                borderTop: `1px solid ${colors.neutral[200]}`,
              }}
            >
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={pasoAnterior}
                  style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    background: colors.neutral[100],
                    color: colors.neutral[700],
                    border: `1px solid ${colors.neutral[200]}`,
                    borderRadius: borderRadius.md,
                    fontWeight: typography.fontWeight.semibold,
                    fontSize: typography.fontSize.sm.size,
                    cursor: 'pointer',
                    transition: '0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = colors.neutral[200]}
                  onMouseLeave={e => e.currentTarget.style.background = colors.neutral[100]}
                >
                  <MdArrowBack size={18} />
                  Atras
                </button>
              )}

              {currentStep < pasos.length - 1 ? (
                <button
                  type="button"
                  onClick={siguientePaso}
                  style={{
                    marginLeft: 'auto',
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
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Siguiente
                  <MdArrowForward size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isFormValid() || loading}
                  style={{
                    marginLeft: 'auto',
                    padding: `${spacing.md} ${spacing.lg}`,
                    background: isFormValid()
                      ? `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`
                      : colors.neutral[300],
                    color: colors.neutral[0],
                    border: 'none',
                    borderRadius: borderRadius.md,
                    fontWeight: typography.fontWeight.semibold,
                    fontSize: typography.fontSize.sm.size,
                    cursor: isFormValid() && !loading ? 'pointer' : 'not-allowed',
                    transition: '0.3s',
                    opacity: isFormValid() ? 1 : 0.6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                  }}
                  onMouseEnter={e => isFormValid() && !loading && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => isFormValid() && !loading && (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? 'Creando...' : 'Crear Doctor'}
                  <MdCheck size={18} />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RegisterDct;