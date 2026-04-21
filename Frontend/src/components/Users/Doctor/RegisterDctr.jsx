import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import { 
  MdArrowBack, MdArrowForward, MdCheck, MdPerson, 
  MdWork, MdSchedule, MdSecurity, MdErrorOutline,
  MdVisibility, MdVisibilityOff, MdClose, MdAccessTime
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import * as especialidadesService from '../../../Services/especialidadesService';
import * as consultoriosService from '../../../Services/Consultorioservice';

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
      setError('');
      
      try {
        // Cargar horarios predefinidos (si tienes un servicio para horarios)
        // Por ahora usamos datos de ejemplo, pero deberías tener un servicio similar
        const horariosEjemplo = [
          { id_horario: 1, nombre: 'Mañana', horario_inicio: '08:00:00', horario_fin: '12:00:00' },
          { id_horario: 2, nombre: 'Tarde', horario_inicio: '14:00:00', horario_fin: '18:00:00' },
          { id_horario: 3, nombre: 'Completo', horario_inicio: '08:00:00', horario_fin: '18:00:00' },
        ];
        setHorarios(horariosEjemplo);

        // Cargar especialidades usando el servicio
        console.log('Cargando especialidades...');
        const especialidadesResponse = await especialidadesService.getEspecialidades();
        console.log('Respuesta especialidades:', especialidadesResponse);
        
        if (especialidadesResponse.ok && Array.isArray(especialidadesResponse.data)) {
          // Filtrar solo especialidades activas
          const especialidadesActivas = especialidadesResponse.data.filter(
            esp => esp.estado === 'activa' || esp.estado === 'activo'
          );
          setEspecialidades(especialidadesActivas);
          console.log('Especialidades cargadas:', especialidadesActivas.length);
        } else {
          console.warn('Error al cargar especialidades:', especialidadesResponse.msg);
          setEspecialidades([]);
        }

        // Cargar consultorios usando el servicio
        console.log('Cargando consultorios...');
        const consultoriosResponse = await consultoriosService.getConsultorios();
        console.log('Respuesta consultorios:', consultoriosResponse);
        
        if (consultoriosResponse.ok && Array.isArray(consultoriosResponse.data)) {
          // Filtrar solo consultorios activos
          const consultoriosActivos = consultoriosResponse.data.filter(
            cons => cons.estado === 'activo' || cons.estado === 'activa'
          );
          setConsultorios(consultoriosActivos);
          console.log('Consultorios cargados:', consultoriosActivos.length);
        } else {
          console.warn('Error al cargar consultorios:', consultoriosResponse.msg);
          setConsultorios([]);
        }

      } catch (error) {
        console.error('Error cargando catalogos:', error);
        setError('Error al cargar los datos necesarios. Por favor, recargue la página.');
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
      caracterEspecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
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
    
    // Limpiar errores al cambiar
    if (error) setError('');
  };

  const handleDiaToggle = (diaId) => {
    setFormData(prev => {
      const nuevosDias = prev.dias_atencion.includes(diaId)
        ? prev.dias_atencion.filter(d => d !== diaId)
        : [...prev.dias_atencion, diaId];
      return { ...prev, dias_atencion: nuevosDias };
    });
    if (error) setError('');
  };

  const validarPasoActual = () => {
    if (currentStep === 0) {
      if (!formData.nombre.trim()) {
        setError('El nombre es requerido');
        return false;
      }
      if (!formData.apellido.trim()) {
        setError('El apellido es requerido');
        return false;
      }
      if (!formData.email.trim()) {
        setError('El email es requerido');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Email no válido');
        return false;
      }
      if (!formData.cedula.trim()) {
        setError('La cédula es requerida');
        return false;
      }
      if (!formData.telefono.trim()) {
        setError('El teléfono es requerido');
        return false;
      }
      if (!/^[0-9\-\+\(\)\s]{7,}$/.test(formData.telefono)) {
        setError('Teléfono no válido');
        return false;
      }
    }
    
    if (currentStep === 1) {
      if (!formData.id_especialidad) {
        setError('Seleccione una especialidad');
        return false;
      }
      if (!formData.id_consultorio) {
        setError('Seleccione un consultorio');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.id_horario) {
        setError('Seleccione un horario de atención');
        return false;
      }
      if (formData.dias_atencion.length === 0) {
        setError('Seleccione al menos un día de atención');
        return false;
      }
    }
    
    if (currentStep === 3) {
      if (!formData.contraseña) {
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

      console.log('Enviando datos:', dataToSend);

      // Aquí deberías usar tu servicio de usuarios
      // const response = await api.post('/usuarios', dataToSend, true);
      
      // Simulamos una respuesta exitosa por ahora
      // Reemplaza esto con tu llamada real a la API
      const response = { ok: true, msg: 'Doctor creado exitosamente' };

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
        background: colors?.neutral?.[50] || '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div>
          <div style={{
            width: '40px',
            height: '40px',
            border: `4px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
            borderTop: `4px solid ${config?.theme?.colors?.primary || '#0ea5e9'}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} />
          <p style={{ marginTop: spacing?.lg || '24px', color: colors?.neutral?.[600] || '#4b5563' }}>
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

  // Valores por defecto para los estilos
  const defaultColors = {
    neutral: { 0: '#fff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
    success: { light: '#d1fae5', main: '#10b981', dark: '#059669' },
    error: { light: '#fee2e2', main: '#dc2626', dark: '#991b1b' },
  };
  
  const finalColors = colors || defaultColors;
  const finalSpacing = spacing || { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' };
  const finalTypography = typography || { fontSize: { xs: { size: '12px' }, sm: { size: '14px' }, md: { size: '16px' }, lg: { size: '18px' }, xl: { size: '20px' }, '2xl': { size: '24px' } }, fontWeight: { regular: 400, semibold: 600, bold: 700 } };
  const finalBorderRadius = borderRadius || { sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px' };
  const finalShadows = shadows || { sm: '0 1px 2px 0 rgba(0,0,0,0.05)', md: '0 4px 6px -1px rgba(0,0,0,0.1)' };
  const primaryColor = config?.theme?.colors?.primary || '#0ea5e9';
  const secondaryColor = config?.theme?.colors?.secondary || '#14b8a6';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: finalColors.neutral[50],
        overflow: 'auto',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: finalColors.neutral[0],
          borderBottom: `1px solid ${finalColors.neutral[200]}`,
          padding: finalSpacing.lg,
          boxShadow: finalShadows.sm,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: finalSpacing.md,
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
              fontSize: finalTypography.fontSize.xl.size,
              color: finalColors.neutral[600],
              display: 'flex',
              alignItems: 'center',
              padding: finalSpacing.sm,
            }}
          >
            <MdArrowBack size={24} />
          </button>
          <h1
            style={{
              fontSize: finalTypography.fontSize['2xl'].size,
              fontWeight: finalTypography.fontWeight.bold,
              color: finalColors.neutral[900],
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
          padding: finalSpacing.xl,
        }}
      >
        {/* Mensajes de Error/Exito */}
        {error && (
          <div
            style={{
              padding: finalSpacing.md,
              marginBottom: finalSpacing.lg,
              backgroundColor: finalColors.error.light,
              border: `2px solid ${finalColors.error.main}`,
              color: finalColors.error.dark,
              borderRadius: finalBorderRadius.lg,
              fontWeight: finalTypography.fontWeight.semibold,
              fontSize: finalTypography.fontSize.sm.size,
              display: 'flex',
              alignItems: 'center',
              gap: finalSpacing.md,
            }}
          >
            <MdErrorOutline size={20} />
            {error}
          </div>
        )}
        
        {success && (
          <div
            style={{
              padding: finalSpacing.md,
              marginBottom: finalSpacing.lg,
              backgroundColor: finalColors.success.light,
              border: `2px solid ${finalColors.success.main}`,
              color: finalColors.success.dark,
              borderRadius: finalBorderRadius.lg,
              fontWeight: finalTypography.fontWeight.semibold,
              fontSize: finalTypography.fontSize.sm.size,
              display: 'flex',
              alignItems: 'center',
              gap: finalSpacing.md,
            }}
          >
            <MdCheck size={20} />
            {success}
          </div>
        )}

        {/* Progress Bar */}
        <div
          style={{
            background: finalColors.neutral[0],
            border: `1px solid ${finalColors.neutral[200]}`,
            borderRadius: finalBorderRadius.xl,
            padding: finalSpacing.lg,
            marginBottom: finalSpacing.lg,
            boxShadow: finalShadows.sm,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: finalSpacing.md,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: finalSpacing.sm,
                fontSize: finalTypography.fontSize.sm.size,
                fontWeight: finalTypography.fontWeight.semibold,
                color: finalColors.neutral[700],
              }}
            >
              <CurrentIcon size={20} style={{ color: primaryColor }} />
              Paso {currentStep + 1} de {pasos.length}
            </div>
            <div
              style={{
                fontSize: finalTypography.fontSize.sm.size,
                fontWeight: finalTypography.fontWeight.medium,
                color: finalColors.neutral[600],
              }}
            >
              {pasos[currentStep].titulo}
            </div>
          </div>
          
          <div
            style={{
              height: '8px',
              background: finalColors.neutral[200],
              borderRadius: finalBorderRadius.full,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                borderRadius: finalBorderRadius.full,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: finalColors.neutral[0],
              border: `1px solid ${finalColors.neutral[200]}`,
              borderRadius: finalBorderRadius.xl,
              padding: finalSpacing.xl,
              boxShadow: finalShadows.md,
            }}
          >
            {/* Paso 1: Informacion Personal */}
            {currentStep === 0 && (
              <div>
                <h3
                  style={{
                    fontSize: finalTypography.fontSize.lg.size,
                    fontWeight: finalTypography.fontWeight.bold,
                    color: finalColors.neutral[900],
                    margin: 0,
                    marginBottom: finalSpacing.lg,
                    paddingBottom: finalSpacing.md,
                    borderBottom: `2px solid ${finalColors.neutral[200]}`,
                  }}
                >
                  Informacion Personal
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: finalSpacing.lg,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[700],
                        marginBottom: finalSpacing.xs,
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
                        padding: finalSpacing.md,
                        border: `2px solid ${finalColors.neutral[200]}`,
                        borderRadius: finalBorderRadius.md,
                        fontSize: finalTypography.fontSize.sm.size,
                        outline: 'none',
                        transition: '0.3s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = primaryColor}
                      onBlur={e => e.target.style.borderColor = finalColors.neutral[200]}
                      placeholder="Nombre del doctor"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[700],
                        marginBottom: finalSpacing.xs,
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
                        padding: finalSpacing.md,
                        border: `2px solid ${finalColors.neutral[200]}`,
                        borderRadius: finalBorderRadius.md,
                        fontSize: finalTypography.fontSize.sm.size,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = primaryColor}
                      onBlur={e => e.target.style.borderColor = finalColors.neutral[200]}
                      placeholder="Apellido del doctor"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[700],
                        marginBottom: finalSpacing.xs,
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
                        padding: finalSpacing.md,
                        border: `2px solid ${finalColors.neutral[200]}`,
                        borderRadius: finalBorderRadius.md,
                        fontSize: finalTypography.fontSize.sm.size,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = primaryColor}
                      onBlur={e => e.target.style.borderColor = finalColors.neutral[200]}
                      placeholder="doctor@email.com"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[700],
                        marginBottom: finalSpacing.xs,
                      }}
                    >
                      Cédula *
                    </label>
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: finalSpacing.md,
                        border: `2px solid ${finalColors.neutral[200]}`,
                        borderRadius: finalBorderRadius.md,
                        fontSize: finalTypography.fontSize.sm.size,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = primaryColor}
                      onBlur={e => e.target.style.borderColor = finalColors.neutral[200]}
                      placeholder="12345678"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[700],
                        marginBottom: finalSpacing.xs,
                      }}
                    >
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: finalSpacing.md,
                        border: `2px solid ${finalColors.neutral[200]}`,
                        borderRadius: finalBorderRadius.md,
                        fontSize: finalTypography.fontSize.sm.size,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = primaryColor}
                      onBlur={e => e.target.style.borderColor = finalColors.neutral[200]}
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
                    fontSize: finalTypography.fontSize.lg.size,
                    fontWeight: finalTypography.fontWeight.bold,
                    color: finalColors.neutral[900],
                    margin: 0,
                    marginBottom: finalSpacing.lg,
                    paddingBottom: finalSpacing.md,
                    borderBottom: `2px solid ${finalColors.neutral[200]}`,
                  }}
                >
                  Informacion Profesional
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: finalSpacing.lg,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[700],
                        marginBottom: finalSpacing.xs,
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
                        padding: finalSpacing.md,
                        border: `2px solid ${finalColors.neutral[200]}`,
                        borderRadius: finalBorderRadius.md,
                        fontSize: finalTypography.fontSize.sm.size,
                        background: finalColors.neutral[0],
                        cursor: 'pointer',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = primaryColor}
                      onBlur={e => e.target.style.borderColor = finalColors.neutral[200]}
                    >
                      <option value="">Selecciona una especialidad</option>
                      {especialidades.length === 0 ? (
                        <option value="" disabled>No hay especialidades disponibles</option>
                      ) : (
                        especialidades.map(esp => (
                          <option key={esp.id_especialidad} value={esp.id_especialidad}>
                            {esp.nombre}
                          </option>
                        ))
                      )}
                    </select>
                    {especialidades.length === 0 && (
                      <p style={{ color: finalColors.error.main, fontSize: finalTypography.fontSize.xs.size, marginTop: finalSpacing.xs }}>
                        No hay especialidades activas. Cree una especialidad primero.
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[700],
                        marginBottom: finalSpacing.xs,
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
                        padding: finalSpacing.md,
                        border: `2px solid ${finalColors.neutral[200]}`,
                        borderRadius: finalBorderRadius.md,
                        fontSize: finalTypography.fontSize.sm.size,
                        background: finalColors.neutral[0],
                        cursor: 'pointer',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = primaryColor}
                      onBlur={e => e.target.style.borderColor = finalColors.neutral[200]}
                    >
                      <option value="">Selecciona un consultorio</option>
                      {consultorios.length === 0 ? (
                        <option value="" disabled>No hay consultorios disponibles</option>
                      ) : (
                        consultorios.map(cons => (
                          <option key={cons.id_consultorio} value={cons.id_consultorio}>
                            {cons.nombre} - {cons.ciudad || ''}
                          </option>
                        ))
                      )}
                    </select>
                    {consultorios.length === 0 && (
                      <p style={{ color: finalColors.error.main, fontSize: finalTypography.fontSize.xs.size, marginTop: finalSpacing.xs }}>
                        No hay consultorios activos. Cree un consultorio primero.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3: Horario de Atencion */}
            {currentStep === 2 && (
              <div>
                <h3
                  style={{
                    fontSize: finalTypography.fontSize.lg.size,
                    fontWeight: finalTypography.fontWeight.bold,
                    color: finalColors.neutral[900],
                    margin: 0,
                    marginBottom: finalSpacing.lg,
                    paddingBottom: finalSpacing.md,
                    borderBottom: `2px solid ${finalColors.neutral[200]}`,
                  }}
                >
                  Horario de Atencion
                </h3>

                <div style={{ marginBottom: finalSpacing.xl }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: finalTypography.fontSize.sm.size,
                      fontWeight: finalTypography.fontWeight.semibold,
                      color: finalColors.neutral[700],
                      marginBottom: finalSpacing.sm,
                    }}
                  >
                    Seleccione un Horario *
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: finalSpacing.md,
                    }}
                  >
                    {horarios.map(horario => (
                      <label
                        key={horario.id_horario}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: finalSpacing.md,
                          padding: finalSpacing.md,
                          background: formData.id_horario === String(horario.id_horario)
                            ? `${primaryColor}10`
                            : finalColors.neutral[50],
                          border: `2px solid ${formData.id_horario === String(horario.id_horario)
                            ? primaryColor
                            : finalColors.neutral[200]}`,
                          borderRadius: finalBorderRadius.lg,
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
                            accentColor: primaryColor,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: finalTypography.fontWeight.semibold,
                              fontSize: finalTypography.fontSize.md.size,
                              color: formData.id_horario === String(horario.id_horario)
                                ? primaryColor
                                : finalColors.neutral[800],
                              marginBottom: finalSpacing.xs,
                            }}
                          >
                            {horario.nombre}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: finalSpacing.md,
                              fontSize: finalTypography.fontSize.sm.size,
                              color: finalColors.neutral[600],
                            }}
                          >
                            <MdAccessTime size={16} />
                            <span>
                              {horario.horario_inicio?.substring(0, 5) || horario.horario_inicio} - 
                              {horario.horario_fin?.substring(0, 5) || horario.horario_fin}
                            </span>
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
                      padding: finalSpacing.md,
                      background: finalColors.success.light,
                      borderRadius: finalBorderRadius.md,
                      marginBottom: finalSpacing.xl,
                      border: `1px solid ${finalColors.success.main}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: finalSpacing.sm,
                        marginBottom: finalSpacing.sm,
                      }}
                    >
                      <MdCheck size={18} style={{ color: finalColors.success.dark }} />
                      <span
                        style={{
                          fontWeight: finalTypography.fontWeight.semibold,
                          color: finalColors.success.dark,
                        }}
                      >
                        Horario seleccionado: {horarioSeleccionado.nombre}
                      </span>
                    </div>
                    <div style={{ fontSize: finalTypography.fontSize.sm.size, color: finalColors.success.dark }}>
                      Horario: {horarioSeleccionado.horario_inicio?.substring(0, 5) || horarioSeleccionado.horario_inicio} - 
                      {horarioSeleccionado.horario_fin?.substring(0, 5) || horarioSeleccionado.horario_fin}
                    </div>
                  </div>
                )}

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: finalTypography.fontSize.sm.size,
                      fontWeight: finalTypography.fontWeight.semibold,
                      color: finalColors.neutral[700],
                      marginBottom: finalSpacing.md,
                    }}
                  >
                    Días de Atención * (Seleccione los días que trabaja)
                  </label>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                      gap: finalSpacing.md,
                    }}
                  >
                    {diasSemana.map(dia => (
                      <label
                        key={dia.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: finalSpacing.sm,
                          padding: finalSpacing.md,
                          background: formData.dias_atencion.includes(dia.id)
                            ? `${primaryColor}10`
                            : finalColors.neutral[50],
                          border: `2px solid ${formData.dias_atencion.includes(dia.id)
                            ? primaryColor
                            : finalColors.neutral[200]}`,
                          borderRadius: finalBorderRadius.md,
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
                            accentColor: primaryColor,
                          }}
                        />
                        <span
                          style={{
                            fontSize: finalTypography.fontSize.sm.size,
                            fontWeight: formData.dias_atencion.includes(dia.id)
                              ? finalTypography.fontWeight.semibold
                              : finalTypography.fontWeight.regular,
                            color: formData.dias_atencion.includes(dia.id)
                              ? primaryColor
                              : finalColors.neutral[600],
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
                        marginTop: finalSpacing.md,
                        padding: finalSpacing.sm,
                        background: finalColors.success.light,
                        borderRadius: finalBorderRadius.md,
                        display: 'inline-block',
                      }}
                    >
                      <span
                        style={{
                          fontSize: finalTypography.fontSize.xs.size,
                          color: finalColors.success.dark,
                          display: 'flex',
                          alignItems: 'center',
                          gap: finalSpacing.xs,
                        }}
                      >
                        <MdCheck size={14} />
                        Días seleccionados: {formData.dias_atencion.join(', ')}
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
                    fontSize: finalTypography.fontSize.lg.size,
                    fontWeight: finalTypography.fontWeight.bold,
                    color: finalColors.neutral[900],
                    margin: 0,
                    marginBottom: finalSpacing.lg,
                    paddingBottom: finalSpacing.md,
                    borderBottom: `2px solid ${finalColors.neutral[200]}`,
                  }}
                >
                  Credenciales de Acceso
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: finalSpacing.lg,
                    marginBottom: finalSpacing.lg,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[700],
                        marginBottom: finalSpacing.xs,
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
                          padding: `${finalSpacing.md} ${finalSpacing.xl} ${finalSpacing.md} ${finalSpacing.md}`,
                          border: `2px solid ${finalColors.neutral[200]}`,
                          borderRadius: finalBorderRadius.md,
                          fontSize: finalTypography.fontSize.sm.size,
                          outline: 'none',
                          transition: '0.3s',
                          boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = primaryColor}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: finalSpacing.md,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: finalColors.neutral[500],
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
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[700],
                        marginBottom: finalSpacing.xs,
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
                          padding: `${finalSpacing.md} ${finalSpacing.xl} ${finalSpacing.md} ${finalSpacing.md}`,
                          border: `2px solid ${
                            formData.confirmarContraseña && formData.contraseña !== formData.confirmarContraseña
                              ? finalColors.error.main
                              : finalColors.neutral[200]
                          }`,
                          borderRadius: finalBorderRadius.md,
                          fontSize: finalTypography.fontSize.sm.size,
                          outline: 'none',
                          transition: '0.3s',
                          boxSizing: 'border-box',
                        }}
                        onFocus={e => e.target.style.borderColor = primaryColor}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: finalSpacing.md,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: finalColors.neutral[500],
                        }}
                      >
                        {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                      </button>
                    </div>
                    {formData.confirmarContraseña && formData.contraseña !== formData.confirmarContraseña && (
                      <p style={{ color: finalColors.error.main, fontSize: finalTypography.fontSize.xs.size, marginTop: finalSpacing.xs }}>
                        Las contraseñas no coinciden
                      </p>
                    )}
                  </div>
                </div>

                {/* Requisitos de Contraseña */}
                {formData.contraseña && (
                  <div
                    style={{
                      padding: finalSpacing.md,
                      background: finalColors.neutral[50],
                      border: `1px solid ${finalColors.neutral[200]}`,
                      borderRadius: finalBorderRadius.md,
                    }}
                  >
                    <p
                      style={{
                        fontSize: finalTypography.fontSize.sm.size,
                        fontWeight: finalTypography.fontWeight.semibold,
                        color: finalColors.neutral[900],
                        margin: 0,
                        marginBottom: finalSpacing.md,
                      }}
                    >
                      Requisitos de contraseña:
                    </p>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: finalSpacing.md,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: finalSpacing.sm }}>
                        {passwordValidation.mayuscula ? (
                          <MdCheck size={18} style={{ color: finalColors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: finalColors.error.main }} />
                        )}
                        <span style={{ fontSize: finalTypography.fontSize.xs.size }}>Una mayúscula (A-Z)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: finalSpacing.sm }}>
                        {passwordValidation.minuscula ? (
                          <MdCheck size={18} style={{ color: finalColors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: finalColors.error.main }} />
                        )}
                        <span style={{ fontSize: finalTypography.fontSize.xs.size }}>Una minúscula (a-z)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: finalSpacing.sm }}>
                        {passwordValidation.numero ? (
                          <MdCheck size={18} style={{ color: finalColors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: finalColors.error.main }} />
                        )}
                        <span style={{ fontSize: finalTypography.fontSize.xs.size }}>Un número (0-9)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: finalSpacing.sm }}>
                        {passwordValidation.caracterEspecial ? (
                          <MdCheck size={18} style={{ color: finalColors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: finalColors.error.main }} />
                        )}
                        <span style={{ fontSize: finalTypography.fontSize.xs.size }}>Carácter especial (!@#$%^&*)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: finalSpacing.sm }}>
                        {passwordValidation.minimo8 ? (
                          <MdCheck size={18} style={{ color: finalColors.success.main }} />
                        ) : (
                          <MdClose size={18} style={{ color: finalColors.error.main }} />
                        )}
                        <span style={{ fontSize: finalTypography.fontSize.xs.size }}>Mínimo 8 caracteres</span>
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
                gap: finalSpacing.md,
                marginTop: finalSpacing['2xl'],
                paddingTop: finalSpacing.lg,
                borderTop: `1px solid ${finalColors.neutral[200]}`,
              }}
            >
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={pasoAnterior}
                  style={{
                    padding: `${finalSpacing.md} ${finalSpacing.lg}`,
                    background: finalColors.neutral[100],
                    color: finalColors.neutral[700],
                    border: `1px solid ${finalColors.neutral[200]}`,
                    borderRadius: finalBorderRadius.md,
                    fontWeight: finalTypography.fontWeight.semibold,
                    fontSize: finalTypography.fontSize.sm.size,
                    cursor: 'pointer',
                    transition: '0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: finalSpacing.sm,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = finalColors.neutral[200]}
                  onMouseLeave={e => e.currentTarget.style.background = finalColors.neutral[100]}
                >
                  <MdArrowBack size={18} />
                  Atrás
                </button>
              )}

              {currentStep < pasos.length - 1 ? (
                <button
                  type="button"
                  onClick={siguientePaso}
                  style={{
                    marginLeft: 'auto',
                    padding: `${finalSpacing.md} ${finalSpacing.lg}`,
                    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                    color: finalColors.neutral[0],
                    border: 'none',
                    borderRadius: finalBorderRadius.md,
                    fontWeight: finalTypography.fontWeight.semibold,
                    fontSize: finalTypography.fontSize.sm.size,
                    cursor: 'pointer',
                    transition: '0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: finalSpacing.sm,
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
                    padding: `${finalSpacing.md} ${finalSpacing.lg}`,
                    background: isFormValid()
                      ? `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                      : finalColors.neutral[300],
                    color: finalColors.neutral[0],
                    border: 'none',
                    borderRadius: finalBorderRadius.md,
                    fontWeight: finalTypography.fontWeight.semibold,
                    fontSize: finalTypography.fontSize.sm.size,
                    cursor: isFormValid() && !loading ? 'pointer' : 'not-allowed',
                    transition: '0.3s',
                    opacity: isFormValid() ? 1 : 0.6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: finalSpacing.sm,
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