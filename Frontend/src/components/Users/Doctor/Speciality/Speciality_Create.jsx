import React, { useState } from 'react';
import { useTheme } from '../../../../Config/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  MdArrowBack, MdCheck, MdErrorOutline, MdInfoOutline,
  MdLocalHospital
} from 'react-icons/md';
import * as especialidadesService from '../../../../services/especialidadesService';

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

const Speciality_create = () => {
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
    descripcion: '',
    estado: 'activa',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre?.trim()) {
      nuevosErrores.nombre = 'El nombre de la especialidad es requerido';
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    if (!formData.descripcion?.trim()) {
      nuevosErrores.descripcion = 'La descripción es requerida';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const result = await especialidadesService.createEspecialidad({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
        estado: formData.estado,
      });

      if (result.ok) {
        setSubmitSuccess(result.msg || 'Especialidad creada exitosamente');

        setFormData({
          nombre: '',
          descripcion: '',
          estado: 'activa',
        });

        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        setSubmitError(result.msg || 'Error al crear la especialidad');
      }
    } catch (error) {
      setSubmitError('Error inesperado al crear la especialidad');
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
    boxSizing: 'border-box',
    resize: 'vertical',
    fontFamily: 'inherit'
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
            onClick={() => navigate(-1)}
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
            onMouseEnter={e => e.currentTarget.style.background = colors?.neutral?.[200] || '#e5e7eb'}
            onMouseLeave={e => e.currentTarget.style.background = colors?.neutral?.[100] || '#f3f4f6'}
          >
            <MdArrowBack size={20} />
          </button>
          <h1 style={{
            fontSize: typography?.fontSize?.['3xl']?.size || '30px',
            fontWeight: typography?.fontWeight?.bold || 700,
            color: colors?.neutral?.[900] || '#111827',
            margin: 0
          }}>
            Nueva Especialidad
          </h1>
        </div>
        <p style={{
          color: colors?.neutral?.[600] || '#4b5563',
          margin: 0,
          fontSize: typography?.fontSize?.sm?.size || '14px',
          marginLeft: spacing?.['2xl'] || '48px'
        }}>
          Complete los campos para registrar una nueva especialidad médica
        </p>
      </div>

      {/* Alerta éxito */}
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
              Éxito
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

          {/* Sección Información de la Especialidad */}
          <div style={{ marginBottom: spacing?.['2xl'] || '48px' }}>
            <div style={sectionHeaderStyle}>
              <MdLocalHospital size={24} style={{ color: primaryColor }} />
              <h2 style={sectionTitleStyle}>Información de la Especialidad</h2>
            </div>

            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={labelStyle}>Nombre de la Especialidad *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Ej: Cardiología"
                style={inputStyle(errors.nombre)}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                onBlur={e => e.target.style.borderColor = errors.nombre ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
              />
              {errors.nombre && <span style={errorTextStyle}>{errors.nombre}</span>}
            </div>

            <div style={{ marginBottom: spacing?.lg || '24px' }}>
              <label style={labelStyle}>Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="Ej: Especialidad enfocada en el diagnóstico y tratamiento del corazón"
                rows={4}
                style={inputStyle(errors.descripcion)}
                onFocus={e => !isSubmitting && (e.target.style.borderColor = primaryColor)}
                onBlur={e => e.target.style.borderColor = errors.descripcion ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
              />
              {errors.descripcion && <span style={errorTextStyle}>{errors.descripcion}</span>}
            </div>

           
          </div>

          {/* Botones de Acción */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: spacing?.md || '16px',
            paddingTop: spacing?.lg || '24px',
            borderTop: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`
          }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
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
              onMouseEnter={e => !isSubmitting && (e.currentTarget.style.background = colors?.neutral?.[200] || '#e5e7eb')}
              onMouseLeave={e => !isSubmitting && (e.currentTarget.style.background = colors?.neutral?.[100] || '#f3f4f6')}
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
              onMouseEnter={e => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => !isSubmitting && (e.currentTarget.style.opacity = '1')}
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
                  Guardar Especialidad
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

export default Speciality_create;