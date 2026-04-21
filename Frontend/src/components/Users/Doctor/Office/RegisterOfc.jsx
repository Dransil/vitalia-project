import React, { useState } from 'react';
import { useTheme } from '../../../../Config/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  MdArrowBack, MdCheck, MdErrorOutline, MdInfoOutline,
  MdLocationOn, MdPhone, MdAccessTime
} from 'react-icons/md';
import * as consultoriosService from '../../../../Services/Consultorioservice';

const DEFAULT_COLORS = {
  neutral: { 0: '#fff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
  success: { light: '#d1fae5', main: '#10b981', dark: '#059669' },
  error: { light: '#fee2e2', main: '#dc2626', dark: '#991b1b' },
  warning: { light: '#fef3c7', main: '#f59e0b', dark: '#d97706' },
  info: { light: '#dbeafe', main: '#3b82f6', dark: '#1d4ed8' },
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

const DIAS_SEMANA = [
  { label: 'Lun', value: 'Lun' },
  { label: 'Mar', value: 'Mar' },
  { label: 'Mie', value: 'Mié' },
  { label: 'Jue', value: 'Jue' },
  { label: 'Vie', value: 'Vie' },
  { label: 'Sab', value: 'Sáb' },
  { label: 'Dom', value: 'Dom' },
];

const CreateConsultorio = () => {
  const navigate = useNavigate();

  let themeContext = {};
  try {
    themeContext = useTheme() || {};
  } catch (e) {
    console.warn('ThemeContext no disponible, usando valores por defecto');
  }

  const config = themeContext.config || DEFAULT_CONFIG;
  const colors = themeContext.colors || DEFAULT_COLORS;
  const spacing = themeContext.spacing || DEFAULT_SPACING;
  const typography = themeContext.typography || DEFAULT_TYPOGRAPHY;
  const borderRadius = themeContext.borderRadius || DEFAULT_BORDER_RADIUS;
  const shadows = themeContext.shadows || DEFAULT_SHADOWS;

  const primaryColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary;
  const secondaryColor = config?.theme?.colors?.secondary || DEFAULT_CONFIG.theme.colors.secondary;

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: '',
    descripcion: '',
    horario_apertura: '',
    horario_cierre: '',
    dias_atencion: '',
    estado: 'activo'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre?.trim()) {
      nuevosErrores.nombre = 'El nombre del consultorio es requerido';
    }
    if (!formData.direccion?.trim()) {
      nuevosErrores.direccion = 'La direccion es requerida';
    }
    if (!formData.ciudad?.trim()) {
      nuevosErrores.ciudad = 'La ciudad es requerida';
    }
    if (!formData.telefono?.trim()) {
      nuevosErrores.telefono = 'El telefono es requerido';
    }
    if (!formData.email?.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nuevosErrores.email = 'El email no es valido';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleDiaToggle = (value) => {
    const orden = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const actuales = formData.dias_atencion
      ? formData.dias_atencion.split(',').filter(Boolean)
      : [];
    const nuevo = actuales.includes(value)
      ? actuales.filter(d => d !== value)
      : [...actuales, value];
    const ordenados = orden.filter(d => nuevo.includes(d));
    setFormData(prev => ({ ...prev, dias_atencion: ordenados.join(',') }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      console.log('Guardando consultorio:', formData);

      const result = await consultoriosService.createConsultorio(formData);

      if (result.ok) {
        console.log('Consultorio creado exitosamente:', result.data);
        setSubmitSuccess(result.msg || 'Consultorio creado exitosamente');

        setFormData({
          nombre: '',
          direccion: '',
          ciudad: '',
          telefono: '',
          email: '',
          descripcion: '',
          horario_apertura: '',
          horario_cierre: '',
          dias_atencion: '',
          estado: 'activo'
        });

        setTimeout(() => {
          navigate('/Office_Dashboard');
        }, 2000);
      } else {
        console.error('Error del servidor:', result.msg);
        setSubmitError(result.msg || 'Error al crear el consultorio');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setSubmitError('Error inesperado al crear el consultorio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: spacing?.md || '16px',
    border: `2px solid ${hasError ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}`,
    borderRadius: borderRadius?.md || '6px',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    outline: 'none',
    transition: '0.3s',
    opacity: isSubmitting ? 0.6 : 1,
    cursor: isSubmitting ? 'not-allowed' : 'text',
    boxSizing: 'border-box'
  });

  const labelStyle = {
    display: 'block',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    fontWeight: typography?.fontWeight?.semibold || 600,
    color: colors?.neutral?.[700] || '#374151',
    marginBottom: spacing?.sm || '8px'
  };

  const errorTextStyle = {
    color: colors?.error?.main || '#dc2626',
    fontSize: typography?.fontSize?.xs?.size || '12px',
    display: 'block',
    marginTop: spacing?.xs || '4px'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing?.md || '16px',
    marginBottom: spacing?.lg || '24px',
    paddingBottom: spacing?.lg || '24px',
    borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`
  };

  const sectionTitleStyle = {
    fontSize: typography?.fontSize?.lg?.size || '18px',
    fontWeight: typography?.fontWeight?.semibold || 600,
    color: colors?.neutral?.[900] || '#111827',
    margin: 0
  };

  const gridTwoColStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing?.lg || '24px',
    marginBottom: spacing?.lg || '24px'
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>

      {/* Encabezado */}
      <div style={{ marginBottom: spacing?.['2xl'] || '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing?.md || '16px', marginBottom: spacing?.md || '16px' }}>
          <button
            onClick={() => navigate('/Office_Dashboard')}
            style={{
              padding: spacing?.sm || '8px',
              background: colors?.neutral?.[100] || '#f3f4f6',
              border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
              borderRadius: borderRadius?.md || '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: '0.3s'
            }}
            onMouseEnter={e => e.target.style.background = colors?.neutral?.[200] || '#e5e7eb'}
            onMouseLeave={e => e.target.style.background = colors?.neutral?.[100] || '#f3f4f6'}
          >
            <MdArrowBack size={20} />
          </button>
          <h1 style={{
            fontSize: typography?.fontSize?.['3xl']?.size || '30px',
            fontWeight: typography?.fontWeight?.bold || 700,
            color: colors?.neutral?.[900] || '#111827',
            margin: 0
          }}>
            Crear Nuevo Consultorio
          </h1>
        </div>
        <p style={{
          color: colors?.neutral?.[600] || '#4b5563',
          margin: 0,
          fontSize: typography?.fontSize?.sm?.size || '14px',
          marginLeft: spacing?.['2xl'] || '48px'
        }}>
          Complete todos los campos para registrar un nuevo consultorio
        </p>
      </div>

      {/* Alerta exito */}
      {submitSuccess && (
        <div style={{
          background: colors?.success?.light || '#d1fae5',
          border: `1px solid ${colors?.success?.main || '#10b981'}`,
          borderRadius: borderRadius?.lg || '8px',
          padding: spacing?.lg || '24px',
          marginBottom: spacing?.lg || '24px',
          display: 'flex',
          gap: spacing?.md || '16px',
          alignItems: 'flex-start'
        }}>
          <MdCheck size={24} style={{ color: colors?.success?.main || '#10b981', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: 0, color: colors?.success?.dark || '#059669', fontSize: typography?.fontSize?.sm?.size || '14px', fontWeight: 600 }}>
              Exito
            </h4>
            <p style={{ margin: 0, color: colors?.success?.dark || '#059669', fontSize: typography?.fontSize?.sm?.size || '14px' }}>
              {submitSuccess}
            </p>
          </div>
        </div>
      )}

      {/* Alerta error */}
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
          <MdErrorOutline size={24} style={{ color: colors?.error?.main || '#dc2626', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: 0, color: colors?.error?.dark || '#991b1b', fontSize: typography?.fontSize?.sm?.size || '14px', fontWeight: 600 }}>
              Error al guardar
            </h4>
            <p style={{ margin: 0, color: colors?.error?.dark || '#991b1b', fontSize: typography?.fontSize?.sm?.size || '14px' }}>
              {submitError}
            </p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div style={{
        background: colors?.neutral?.[0] || '#fff',
        border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
        borderRadius: borderRadius?.xl || '12px',
        padding: spacing?.['2xl'] || '48px',
        boxShadow: shadows?.md || '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit}>

          {/* Seccion Informacion Basica */}
          <div style={{ marginBottom: spacing?.['2xl'] || '48px' }}>
            <div style={sectionHeaderStyle}>
              <MdInfoOutline size={24} style={{ color: primaryColor }} />
              <h2 style={sectionTitleStyle}>Informacion Basica</h2>
            </div>

            <div style={gridTwoColStyle}>
              {/* Nombre */}
              <div>
                <label style={labelStyle}>Nombre del Consultorio *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Ej: Consultorio Centro Medico"
                  style={inputStyle(errors.nombre)}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                  onBlur={e => e.target.style.borderColor = errors.nombre ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                />
                {errors.nombre && <span style={errorTextStyle}>{errors.nombre}</span>}
              </div>

              {/* Telefono */}
              <div>
                <label style={labelStyle}>Telefono *</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MdPhone size={18} style={{ position: 'absolute', left: spacing?.md || '16px', color: colors?.neutral?.[400] || '#9ca3af' }} />
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="0999999999"
                    style={{
                      ...inputStyle(errors.telefono),
                      paddingLeft: spacing?.['2xl'] || '48px'
                    }}
                    onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                    onBlur={e => e.target.style.borderColor = errors.telefono ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                  />
                </div>
                {errors.telefono && <span style={errorTextStyle}>{errors.telefono}</span>}
              </div>
            </div>

            <div style={gridTwoColStyle}>
              {/* Email */}
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="consultorio@email.com"
                  style={inputStyle(errors.email)}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                  onBlur={e => e.target.style.borderColor = errors.email ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                />
                {errors.email && <span style={errorTextStyle}>{errors.email}</span>}
              </div>

              {/* Estado */}
              <div>
                <label style={labelStyle}>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
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
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                  onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seccion Ubicacion */}
          <div style={{ marginBottom: spacing?.['2xl'] || '48px' }}>
            <div style={sectionHeaderStyle}>
              <MdLocationOn size={24} style={{ color: primaryColor }} />
              <h2 style={sectionTitleStyle}>Ubicacion</h2>
            </div>

            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={labelStyle}>Direccion *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Ej: Calle Principal #123, Apto 4"
                style={inputStyle(errors.direccion)}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                onBlur={e => e.target.style.borderColor = errors.direccion ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
              />
              {errors.direccion && <span style={errorTextStyle}>{errors.direccion}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.lg || '24px' }}>
              {/* Ciudad */}
              <div>
                <label style={labelStyle}>Ciudad *</label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Ej: Cochabamba"
                  style={inputStyle(errors.ciudad)}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                  onBlur={e => e.target.style.borderColor = errors.ciudad ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                />
                {errors.ciudad && <span style={errorTextStyle}>{errors.ciudad}</span>}
              </div>
            </div>
          </div>

          {/* Seccion Horarios y Dias */}
          <div style={{ marginBottom: spacing?.['2xl'] || '48px' }}>
            <div style={sectionHeaderStyle}>
              <MdAccessTime size={24} style={{ color: primaryColor }} />
              <h2 style={sectionTitleStyle}>Horarios y Dias de Atencion</h2>
            </div>

            {/* Horario apertura / cierre */}
            <div style={gridTwoColStyle}>
              <div>
                <label style={labelStyle}>Horario de Apertura</label>
                <input
                  type="time"
                  name="horario_apertura"
                  value={formData.horario_apertura}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={inputStyle(false)}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                  onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                />
              </div>
              <div>
                <label style={labelStyle}>Horario de Cierre</label>
                <input
                  type="time"
                  name="horario_cierre"
                  value={formData.horario_cierre}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={inputStyle(false)}
                  onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                  onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                />
              </div>
            </div>

            {/* Selector de dias */}
            <div>
              <label style={labelStyle}>Dias de Atencion</label>
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: spacing?.sm || '8px'
              }}>
                {DIAS_SEMANA.map(({ label, value }) => {
                  const activo = formData.dias_atencion?.split(',').includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => !isSubmitting && handleDiaToggle(value)}
                      disabled={isSubmitting}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        border: `2px solid ${activo ? primaryColor : colors?.neutral?.[200] || '#e5e7eb'}`,
                        background: activo ? primaryColor : colors?.neutral?.[0] || '#fff',
                        color: activo ? '#fff' : colors?.neutral?.[700] || '#374151',
                        fontSize: typography?.fontSize?.xs?.size || '12px',
                        fontWeight: typography?.fontWeight?.semibold || 600,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                        opacity: isSubmitting ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {formData.dias_atencion ? (
                <span style={{
                  fontSize: typography?.fontSize?.xs?.size || '12px',
                  color: colors?.neutral?.[500] || '#6b7280'
                }}>
                  Seleccionados: {formData.dias_atencion}
                </span>
              ) : (
                <span style={{
                  fontSize: typography?.fontSize?.xs?.size || '12px',
                  color: colors?.neutral?.[400] || '#9ca3af'
                }}>
                  Ningún dia seleccionado
                </span>
              )}
            </div>
          </div>

          {/* Botones de Accion */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: spacing?.md || '16px',
            paddingTop: spacing?.lg || '24px',
            borderTop: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`
          }}>
            <button
              type="button"
              onClick={() => navigate('/consultorios')}
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
                opacity: isSubmitting ? 0.5 : 1
              }}
              onMouseEnter={e => !isSubmitting && (e.target.style.background = colors?.neutral?.[200] || '#e5e7eb')}
              onMouseLeave={e => !isSubmitting && (e.target.style.background = colors?.neutral?.[100] || '#f3f4f6')}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`,
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
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
              onMouseEnter={e => !isSubmitting && (e.target.style.opacity = '0.9')}
              onMouseLeave={e => !isSubmitting && (e.target.style.opacity = '1')}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: `2px solid ${colors?.neutral?.[0] || '#fff'}`,
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  Guardando...
                </>
              ) : (
                <>
                  <MdCheck size={18} />
                  Crear Consultorio
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreateConsultorio;