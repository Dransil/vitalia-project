import React, { useState } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, MdArrowForward, MdCheck, MdPerson, 
  MdHome, MdLocalHospital, MdEmergency, MdSecurity,
  MdAssignmentInd, MdErrorOutline
} from 'react-icons/md';
import * as pacientesService from '../../../Services/Pacienteservice';

// VALORES POR DEFECTO
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

const PatientRegister = () => {
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

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Estados para cada seccion del formulario
  const [formData, setFormData] = useState({
    // Informacion Basica
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    // Informacion Domiciliaria
    direccion: '',
    ciudad: '',
    // Informacion Medica
    alergias: '',
    condiciones_medicas: '',
    medicamentos_actuales: '',
    grupo_sanguineo: '',
    // Contacto de Emergencia
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    contacto_emergencia_relacion: '',
    // Aseguramiento
    seguro_medico: '',
    numero_poliza: ''
  });

  const [errors, setErrors] = useState({});

  const pasos = [
    { titulo: 'Informacion Basica', icono: MdPerson },
    { titulo: 'Informacion Domiciliaria', icono: MdHome },
    { titulo: 'Informacion Medica', icono: MdLocalHospital },
    { titulo: 'Contacto de Emergencia', icono: MdEmergency },
    { titulo: 'Aseguramiento', icono: MdSecurity },
    { titulo: 'Revisar y Crear', icono: MdAssignmentInd }
  ];

  const gruposSanguineos = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  
  const relacionesEmergencia = [
    'Padre', 'Madre', 'Hermano', 'Hermana', 'Hijo', 'Hija',
    'Conyuge', 'Pareja', 'Abuelo', 'Abuela', 'Tio', 'Tia', 'Amigo'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarPasoActual = () => {
    const nuevosErrores = {};
    
    if (currentStep === 0) {
      if (!formData.nombre.trim()) nuevosErrores.nombre = 'Nombre requerido';
      if (!formData.apellido.trim()) nuevosErrores.apellido = 'Apellido requerido';
      if (!formData.cedula.trim()) nuevosErrores.cedula = 'Cedula requerida';
      if (!formData.email.trim()) nuevosErrores.email = 'Email requerido';
      if (!formData.telefono.trim()) nuevosErrores.telefono = 'Telefono requerido';
      if (!formData.fecha_nacimiento) nuevosErrores.fecha_nacimiento = 'Fecha requerida';
    }
    
    if (currentStep === 1) {
      if (!formData.direccion.trim()) nuevosErrores.direccion = 'Direccion requerida';
      if (!formData.ciudad.trim()) nuevosErrores.ciudad = 'Ciudad requerida';
    }
    
    if (currentStep === 3) {
      if (!formData.contacto_emergencia_nombre.trim()) nuevosErrores.contacto_emergencia_nombre = 'Nombre requerido';
      if (!formData.contacto_emergencia_telefono.trim()) nuevosErrores.contacto_emergencia_telefono = 'Telefono requerido';
      if (!formData.contacto_emergencia_relacion) nuevosErrores.contacto_emergencia_relacion = 'Relacion requerida';
    }
    
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const siguientePaso = () => {
    if (validarPasoActual() && currentStep < pasos.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const pasoAnterior = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      console.log('📤 Guardando paciente con datos:', formData);
      
      const result = await pacientesService.createPaciente(formData);

      if (result.ok) {
        console.log(' Paciente creado exitosamente:', result.data);
        alert(result.msg || ' Paciente creado exitosamente');
        
        // Redirigir al dashboard de pacientes después de 1 segundo
        setTimeout(() => {
          navigate('/Patient_Dashboard');
        }, 1000);
      } else {
        console.error('Error del servidor:', result.msg);
        setSubmitError(result.msg || 'Error al crear el paciente');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setSubmitError('Error inesperado al crear el paciente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / pasos.length) * 100;
  const CurrentIcon = pasos[currentStep].icono;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      {/* Header */}
      <div style={{ marginBottom: spacing?.['2xl'] || '48px' }}>
        <h1 style={{
          fontSize: typography?.fontSize?.['3xl']?.size || '30px',
          fontWeight: typography?.fontWeight?.bold || 700,
          color: colors?.neutral?.[900] || '#111827',
          margin: 0,
          marginBottom: spacing?.md || '16px'
        }}>
          Registrar Nuevo Paciente
        </h1>
        <p style={{ 
          color: colors?.neutral?.[600] || '#4b5563', 
          margin: 0,
          fontSize: typography?.fontSize?.sm?.size || '14px'
        }}>
          Complete la informacion del paciente en los siguientes pasos
        </p>
      </div>

      {/* Progress Section */}
      <div style={{
        background: colors?.neutral?.[0] || '#fff',
        border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
        borderRadius: borderRadius?.xl || '12px',
        padding: spacing?.lg || '24px',
        marginBottom: spacing?.lg || '24px',
        boxShadow: shadows?.sm || '0 1px 2px 0 rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing?.md || '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing?.sm || '8px',
            fontSize: typography?.fontSize?.sm?.size || '14px',
            fontWeight: typography?.fontWeight?.semibold || 600,
            color: colors?.neutral?.[700] || '#374151'
          }}>
            <CurrentIcon size={20} style={{ color: config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary }} />
            Paso {currentStep + 1} de {pasos.length}
          </div>
          <div style={{
            fontSize: typography?.fontSize?.sm?.size || '14px',
            fontWeight: typography?.fontWeight?.medium || 500,
            color: colors?.neutral?.[600] || '#4b5563'
          }}>
            {pasos[currentStep].titulo}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          height: '8px',
          background: colors?.neutral?.[200] || '#e5e7eb',
          borderRadius: borderRadius?.full || '9999px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: `linear-gradient(to right, ${config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary}, ${config?.theme?.colors?.secondary || DEFAULT_CONFIG.theme.colors.secondary})`,
            borderRadius: borderRadius?.full || '9999px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Error Alert */}
      {submitError && (
        <div style={{
          background: colors?.error?.light || '#fee2e2',
          border: `1px solid ${colors?.error?.main || '#dc2626'}`,
          borderRadius: borderRadius?.lg || '8px',
          padding: spacing?.lg || '24px',
          marginBottom: spacing?.lg || '24px',
          display: 'flex',
          gap: spacing?.md || '16px',
          alignItems: 'flex-start'
        }}>
          <MdErrorOutline size={24} style={{ color: colors?.error?.main || '#dc2626', marginTop: '2px' }} />
          <div>
            <h4 style={{ margin: 0, color: colors?.error?.dark || '#991b1b', fontSize: typography?.fontSize?.sm?.size || '14px' }}>
              Error al guardar
            </h4>
            <p style={{ margin: 0, color: colors?.error?.dark || '#991b1b', fontSize: typography?.fontSize?.sm?.size || '14px' }}>
              {submitError}
            </p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div style={{
        background: colors?.neutral?.[0] || '#fff',
        border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
        borderRadius: borderRadius?.xl || '12px',
        padding: spacing?.['2xl'] || '48px',
        boxShadow: shadows?.md || '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        {/* Step 1: Informacion Basica */}
        {currentStep === 0 && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: spacing?.lg || '24px',
              marginBottom: spacing?.lg || '24px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  fontWeight: typography?.fontWeight?.semibold || 600,
                  color: colors?.neutral?.[700] || '#374151',
                  marginBottom: spacing?.xs || '4px'
                }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: spacing?.md || '16px',
                    border: `2px solid ${errors.nombre ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                    borderRadius: borderRadius?.md || '6px',
                    fontSize: typography?.fontSize?.sm?.size || '14px',
                    outline: 'none',
                    transition: '0.3s',
                    opacity: isSubmitting ? 0.6 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'text',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                  onBlur={e => e.target.style.borderColor = errors.nombre ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                  placeholder="Nombre del paciente"
                />
                {errors.nombre && (
                  <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', marginTop: spacing?.xs || '4px', display: 'block' }}>
                    {errors.nombre}
                  </span>
                )}
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  fontWeight: typography?.fontWeight?.semibold || 600,
                  color: colors?.neutral?.[700] || '#374151',
                  marginBottom: spacing?.xs || '4px'
                }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: spacing?.md || '16px',
                    border: `2px solid ${errors.apellido ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                    borderRadius: borderRadius?.md || '6px',
                    fontSize: typography?.fontSize?.sm?.size || '14px',
                    outline: 'none',
                    transition: '0.3s',
                    opacity: isSubmitting ? 0.6 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'text',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                  onBlur={e => e.target.style.borderColor = errors.apellido ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                  placeholder="Apellido del paciente"
                />
                {errors.apellido && (
                  <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.apellido}</span>
                )}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: spacing?.lg || '24px',
              marginBottom: spacing?.lg || '24px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  fontWeight: typography?.fontWeight?.semibold || 600,
                  color: colors?.neutral?.[700] || '#374151',
                  marginBottom: spacing?.xs || '4px'
                }}>
                  Cedula *
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: spacing?.md || '16px',
                    border: `2px solid ${errors.cedula ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                    borderRadius: borderRadius?.md || '6px',
                    fontSize: typography?.fontSize?.sm?.size || '14px',
                    outline: 'none',
                    opacity: isSubmitting ? 0.6 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'text',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                  onBlur={e => e.target.style.borderColor = errors.cedula ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                  placeholder="12345678"
                />
                {errors.cedula && <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.cedula}</span>}
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  fontWeight: typography?.fontWeight?.semibold || 600,
                  color: colors?.neutral?.[700] || '#374151',
                  marginBottom: spacing?.xs || '4px'
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: spacing?.md || '16px',
                    border: `2px solid ${errors.email ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                    borderRadius: borderRadius?.md || '6px',
                    fontSize: typography?.fontSize?.sm?.size || '14px',
                    outline: 'none',
                    opacity: isSubmitting ? 0.6 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'text',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                  onBlur={e => e.target.style.borderColor = errors.email ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                  placeholder="paciente@email.com"
                />
                {errors.email && <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.email}</span>}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: spacing?.lg || '24px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  fontWeight: typography?.fontWeight?.semibold || 600,
                  color: colors?.neutral?.[700] || '#374151',
                  marginBottom: spacing?.xs || '4px'
                }}>
                  Telefono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: spacing?.md || '16px',
                    border: `2px solid ${errors.telefono ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                    borderRadius: borderRadius?.md || '6px',
                    fontSize: typography?.fontSize?.sm?.size || '14px',
                    outline: 'none',
                    opacity: isSubmitting ? 0.6 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'text',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                  onBlur={e => e.target.style.borderColor = errors.telefono ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                  placeholder="0999999999"
                />
                {errors.telefono && <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.telefono}</span>}
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  fontWeight: typography?.fontWeight?.semibold || 600,
                  color: colors?.neutral?.[700] || '#374151',
                  marginBottom: spacing?.xs || '4px'
                }}>
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: spacing?.md || '16px',
                    border: `2px solid ${errors.fecha_nacimiento ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                    borderRadius: borderRadius?.md || '6px',
                    fontSize: typography?.fontSize?.sm?.size || '14px',
                    outline: 'none',
                    opacity: isSubmitting ? 0.6 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'text',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                  onBlur={e => e.target.style.borderColor = errors.fecha_nacimiento ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                />
                {errors.fecha_nacimiento && <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.fecha_nacimiento}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Informacion Domiciliaria */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Direccion *
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${errors.direccion ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  outline: 'none',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = errors.direccion ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                placeholder="Calle principal #123"
              />
              {errors.direccion && <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.direccion}</span>}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Ciudad *
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${errors.ciudad ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  outline: 'none',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = errors.ciudad ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                placeholder="Ciudad"
              />
              {errors.ciudad && <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.ciudad}</span>}
            </div>
          </div>
        )}

        {/* Step 3: Informacion Medica */}
        {currentStep === 2 && (
          <div>
            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Alergias
              </label>
              <textarea
                name="alergias"
                value={formData.alergias}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                rows="3"
                placeholder="Ej: Penicilina, Polen, Mariscos..."
              />
            </div>

            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Condiciones Medicas
              </label>
              <textarea
                name="condiciones_medicas"
                value={formData.condiciones_medicas}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                rows="3"
                placeholder="Ej: Hipertension, Diabetes, Asma..."
              />
            </div>

            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Medicamentos Actuales
              </label>
              <textarea
                name="medicamentos_actuales"
                value={formData.medicamentos_actuales}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                rows="3"
                placeholder="Ej: Losartan 50mg, Metformina 500mg..."
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Grupo Sanguineo
              </label>
              <select
                name="grupo_sanguineo"
                value={formData.grupo_sanguineo}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  background: colors?.neutral?.[0] || '#fff',
                  outline: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
              >
                <option value="">Seleccionar grupo sanguineo</option>
                {gruposSanguineos.map(grupo => (
                  <option key={grupo} value={grupo}>{grupo}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Contacto de Emergencia */}
        {currentStep === 3 && (
          <div>
            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Nombre Contacto *
              </label>
              <input
                type="text"
                name="contacto_emergencia_nombre"
                value={formData.contacto_emergencia_nombre}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${errors.contacto_emergencia_nombre ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  outline: 'none',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = errors.contacto_emergencia_nombre ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                placeholder="Nombre completo del contacto"
              />
              {errors.contacto_emergencia_nombre && <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.contacto_emergencia_nombre}</span>}
            </div>

            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Telefono Contacto *
              </label>
              <input
                type="tel"
                name="contacto_emergencia_telefono"
                value={formData.contacto_emergencia_telefono}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${errors.contacto_emergencia_telefono ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  outline: 'none',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = errors.contacto_emergencia_telefono ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                placeholder="0999999999"
              />
              {errors.contacto_emergencia_telefono && <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.contacto_emergencia_telefono}</span>}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Relacion *
              </label>
              <select
                name="contacto_emergencia_relacion"
                value={formData.contacto_emergencia_relacion}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${errors.contacto_emergencia_relacion ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  background: colors?.neutral?.[0] || '#fff',
                  outline: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = errors.contacto_emergencia_relacion ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
              >
                <option value="">Seleccionar relacion</option>
                {relacionesEmergencia.map(relacion => (
                  <option key={relacion} value={relacion}>{relacion}</option>
                ))}
              </select>
              {errors.contacto_emergencia_relacion && <span style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', display: 'block' }}>{errors.contacto_emergencia_relacion}</span>}
            </div>
          </div>
        )}

        {/* Step 5: Aseguramiento */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Aseguradora Medica
              </label>
              <input
                type="text"
                name="seguro_medico"
                value={formData.seguro_medico}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  outline: 'none',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                placeholder="Nombre de la aseguradora"
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: typography?.fontSize?.sm?.size || '14px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.neutral?.[700] || '#374151',
                marginBottom: spacing?.xs || '4px'
              }}>
                Numero de Poliza
              </label>
              <input
                type="text"
                name="numero_poliza"
                value={formData.numero_poliza}
                onChange={handleChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: spacing?.md || '16px',
                  border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  outline: 'none',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'text',
                  boxSizing: 'border-box'
                }}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary)}
                onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                placeholder="Numero de poliza"
              />
            </div>
          </div>
        )}

        {/* Step 6: Revisar y Crear */}
        {currentStep === 5 && (
          <div>
            <div style={{
              background: colors?.neutral?.[50] || '#f9fafb',
              borderRadius: borderRadius?.lg || '8px',
              padding: spacing?.lg || '24px',
              marginBottom: spacing?.lg || '24px'
            }}>
              <h3 style={{
                fontSize: typography?.fontSize?.md?.size || '16px',
                fontWeight: typography?.fontWeight?.bold || 700,
                color: colors?.neutral?.[900] || '#111827',
                margin: 0,
                marginBottom: spacing?.md || '16px',
                paddingBottom: spacing?.sm || '8px',
                borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`
              }}>
                Informacion Basica
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing?.md || '16px',
                fontSize: typography?.fontSize?.sm?.size || '14px'
              }}>
                <div><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</div>
                <div><strong>Cedula:</strong> {formData.cedula}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Telefono:</strong> {formData.telefono}</div>
                <div><strong>Fecha Nacimiento:</strong> {formData.fecha_nacimiento}</div>
              </div>
            </div>

            {(formData.direccion || formData.ciudad) && (
              <div style={{
                background: colors?.neutral?.[50] || '#f9fafb',
                borderRadius: borderRadius?.lg || '8px',
                padding: spacing?.lg || '24px',
                marginBottom: spacing?.lg || '24px'
              }}>
                <h3 style={{
                  fontSize: typography?.fontSize?.md?.size || '16px',
                  fontWeight: typography?.fontWeight?.bold || 700,
                  color: colors?.neutral?.[900] || '#111827',
                  margin: 0,
                  marginBottom: spacing?.md || '16px',
                  paddingBottom: spacing?.sm || '8px',
                  borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`
                }}>
                  Informacion Domiciliaria
                </h3>
                <div><strong>Direccion:</strong> {formData.direccion}</div>
                <div><strong>Ciudad:</strong> {formData.ciudad}</div>
              </div>
            )}

            {(formData.alergias || formData.condiciones_medicas || formData.medicamentos_actuales || formData.grupo_sanguineo) && (
              <div style={{
                background: colors?.neutral?.[50] || '#f9fafb',
                borderRadius: borderRadius?.lg || '8px',
                padding: spacing?.lg || '24px',
                marginBottom: spacing?.lg || '24px'
              }}>
                <h3 style={{
                  fontSize: typography?.fontSize?.md?.size || '16px',
                  fontWeight: typography?.fontWeight?.bold || 700,
                  color: colors?.neutral?.[900] || '#111827',
                  margin: 0,
                  marginBottom: spacing?.md || '16px',
                  paddingBottom: spacing?.sm || '8px',
                  borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`
                }}>
                  Informacion Medica
                </h3>
                {formData.alergias && <div><strong>Alergias:</strong> {formData.alergias}</div>}
                {formData.condiciones_medicas && <div><strong>Condiciones:</strong> {formData.condiciones_medicas}</div>}
                {formData.medicamentos_actuales && <div><strong>Medicamentos:</strong> {formData.medicamentos_actuales}</div>}
                {formData.grupo_sanguineo && <div><strong>Grupo Sanguineo:</strong> {formData.grupo_sanguineo}</div>}
              </div>
            )}

            {(formData.contacto_emergencia_nombre || formData.contacto_emergencia_telefono || formData.contacto_emergencia_relacion) && (
              <div style={{
                background: colors?.neutral?.[50] || '#f9fafb',
                borderRadius: borderRadius?.lg || '8px',
                padding: spacing?.lg || '24px',
                marginBottom: spacing?.lg || '24px'
              }}>
                <h3 style={{
                  fontSize: typography?.fontSize?.md?.size || '16px',
                  fontWeight: typography?.fontWeight?.bold || 700,
                  color: colors?.neutral?.[900] || '#111827',
                  margin: 0,
                  marginBottom: spacing?.md || '16px',
                  paddingBottom: spacing?.sm || '8px',
                  borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`
                }}>
                  Contacto de Emergencia
                </h3>
                <div><strong>Nombre:</strong> {formData.contacto_emergencia_nombre}</div>
                <div><strong>Telefono:</strong> {formData.contacto_emergencia_telefono}</div>
                <div><strong>Relacion:</strong> {formData.contacto_emergencia_relacion}</div>
              </div>
            )}

            {(formData.seguro_medico || formData.numero_poliza) && (
              <div style={{
                background: colors?.neutral?.[50] || '#f9fafb',
                borderRadius: borderRadius?.lg || '8px',
                padding: spacing?.lg || '24px',
                marginBottom: spacing?.lg || '24px'
              }}>
                <h3 style={{
                  fontSize: typography?.fontSize?.md?.size || '16px',
                  fontWeight: typography?.fontWeight?.bold || 700,
                  color: colors?.neutral?.[900] || '#111827',
                  margin: 0,
                  marginBottom: spacing?.md || '16px',
                  paddingBottom: spacing?.sm || '8px',
                  borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`
                }}>
                  Aseguramiento
                </h3>
                {formData.seguro_medico && <div><strong>Aseguradora:</strong> {formData.seguro_medico}</div>}
                {formData.numero_poliza && <div><strong>Poliza:</strong> {formData.numero_poliza}</div>}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: spacing?.md || '16px',
          marginTop: spacing?.['2xl'] || '48px',
          paddingTop: spacing?.lg || '24px',
          borderTop: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`
        }}>
          {currentStep > 0 && (
            <button
              onClick={pasoAnterior}
              disabled={isSubmitting}
              style={{
                padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`,
                background: colors?.neutral?.[100] || '#f3f4f6',
                color: colors?.neutral?.[700] || '#374151',
                border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                borderRadius: borderRadius?.md || '6px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                fontSize: typography?.fontSize?.sm?.size || '14px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: '0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: spacing?.sm || '8px',
                opacity: isSubmitting ? 0.5 : 1
              }}
              onMouseEnter={e => !isSubmitting && (e.currentTarget.style.background = colors?.neutral?.[200] || '#e5e7eb')}
              onMouseLeave={e => !isSubmitting && (e.currentTarget.style.background = colors?.neutral?.[100] || '#f3f4f6')}
            >
              <MdArrowBack size={18} />
              Atras
            </button>
          )}

          {currentStep < pasos.length - 1 ? (
            <button
              onClick={siguientePaso}
              disabled={isSubmitting}
              style={{
                marginLeft: 'auto',
                padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`,
                background: `linear-gradient(to right, ${config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary}, ${config?.theme?.colors?.secondary || DEFAULT_CONFIG.theme.colors.secondary})`,
                color: colors?.neutral?.[0] || '#fff',
                border: 'none',
                borderRadius: borderRadius?.md || '6px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                fontSize: typography?.fontSize?.sm?.size || '14px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: '0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: spacing?.sm || '8px',
                opacity: isSubmitting ? 0.5 : 1
              }}
              onMouseEnter={e => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => !isSubmitting && (e.currentTarget.style.opacity = '1')}
            >
              Siguiente
              <MdArrowForward size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                marginLeft: 'auto',
                padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`,
                background: `linear-gradient(to right, ${config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary}, ${config?.theme?.colors?.secondary || DEFAULT_CONFIG.theme.colors.secondary})`,
                color: colors?.neutral?.[0] || '#fff',
                border: 'none',
                borderRadius: borderRadius?.md || '6px',
                fontWeight: typography?.fontWeight?.semibold || 600,
                fontSize: typography?.fontSize?.sm?.size || '14px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: '0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: spacing?.sm || '8px',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseEnter={e => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => !isSubmitting && (e.currentTarget.style.opacity = '1')}
            >
              {isSubmitting ? '⏳ Guardando...' : '✓ Crear Paciente'}
              {!isSubmitting && <MdCheck size={18} />}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PatientRegister;