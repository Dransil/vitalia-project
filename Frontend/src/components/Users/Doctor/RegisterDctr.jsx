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
import usuarioService from '../../../Services/usuarioService';

const DEFAULT_COLORS = {
  neutral: { 0: '#fff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
  success: { light: '#d1fae5', main: '#10b981', dark: '#059669' },
  error: { light: '#fee2e2', main: '#dc2626', dark: '#991b1b' },
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
const DEFAULT_SHADOWS = { sm: '0 1px 2px 0 rgba(0,0,0,0.05)', md: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const DEFAULT_CONFIG = { theme: { colors: { primary: '#0ea5e9', secondary: '#14b8a6' } } };

const RegisterDct = () => {
  const navigate = useNavigate();

  let themeContext = {};
  try { themeContext = useTheme() || {}; } catch (e) {}

  const config = themeContext.config || DEFAULT_CONFIG;
  const colors = themeContext.colors || DEFAULT_COLORS;
  const spacing = themeContext.spacing || DEFAULT_SPACING;
  const typography = themeContext.typography || DEFAULT_TYPOGRAPHY;
  const borderRadius = themeContext.borderRadius || DEFAULT_BORDER_RADIUS;
  const shadows = themeContext.shadows || DEFAULT_SHADOWS;

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [horarios, setHorarios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', cedula: '', telefono: '',
    id_especialidad: '', id_consultorio: '', id_horario: '',
    contraseña: '', confirmarContraseña: '', dias_atencion: []
  });

  const [passwordValidation, setPasswordValidation] = useState({
    mayuscula: false, minuscula: false, numero: false, caracterEspecial: false, minimo8: false,
  });

  const diasSemana = [
    { id: 'Lun', nombre: 'Lunes' }, { id: 'Mar', nombre: 'Martes' },
    { id: 'Mie', nombre: 'Miércoles' }, { id: 'Jue', nombre: 'Jueves' },
    { id: 'Vie', nombre: 'Viernes' }, { id: 'Sab', nombre: 'Sábado' },
    { id: 'Dom', nombre: 'Domingo' }
  ];

  const pasos = [
    { titulo: 'Informacion Personal', icono: MdPerson },
    { titulo: 'Informacion Profesional', icono: MdWork },
    { titulo: 'Horario de Atencion', icono: MdSchedule },
    { titulo: 'Credenciales de Acceso', icono: MdSecurity }
  ];

  useEffect(() => {
    const loadCatalogos = async () => {
      setLoadingData(true);
      setError('');
      try {
        setHorarios([
          { id_horario: 1, nombre: 'Mañana', horario_inicio: '08:00:00', horario_fin: '12:00:00' },
          { id_horario: 2, nombre: 'Tarde', horario_inicio: '14:00:00', horario_fin: '18:00:00' },
          { id_horario: 3, nombre: 'Completo', horario_inicio: '08:00:00', horario_fin: '18:00:00' },
        ]);

        const espRes = await especialidadesService.getEspecialidades();
        if (espRes?.ok && Array.isArray(espRes.data)) {
          setEspecialidades(espRes.data.filter(e => e && (e.estado === 'activa' || e.estado === 'activo')));
        } else setEspecialidades([]);

        const consRes = await consultoriosService.getConsultorios();
        if (consRes?.ok && Array.isArray(consRes.data)) {
          setConsultorios(consRes.data.filter(c => c && (c.estado === 'activo' || c.estado === 'activa')));
        } else setConsultorios([]);

      } catch (err) {
        setError('Error al cargar los datos necesarios. Por favor, recargue la página.');
      } finally {
        setLoadingData(false);
      }
    };
    loadCatalogos();
  }, []);

  const validatePassword = (p) => ({
    mayuscula: /[A-Z]/.test(p), minuscula: /[a-z]/.test(p),
    numero: /[0-9]/.test(p),
    caracterEspecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
    minimo8: p?.length >= 8,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'contraseña') setPasswordValidation(validatePassword(value));
    if (error) setError('');
  };

  const handleDiaToggle = (diaId) => {
    setFormData(prev => ({
      ...prev,
      dias_atencion: prev.dias_atencion.includes(diaId)
        ? prev.dias_atencion.filter(d => d !== diaId)
        : [...prev.dias_atencion, diaId]
    }));
    if (error) setError('');
  };

  const validarPasoActual = () => {
    if (currentStep === 0) {
      if (!formData.nombre?.trim()) { setError('El nombre es requerido'); return false; }
      if (!formData.apellido?.trim()) { setError('El apellido es requerido'); return false; }
      if (!formData.email?.trim()) { setError('El email es requerido'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Email no válido'); return false; }
      if (!formData.cedula?.trim()) { setError('La cédula es requerida'); return false; }
      if (!formData.telefono?.trim()) { setError('El teléfono es requerido'); return false; }
      if (!/^[0-9\-\+\(\)\s]{7,}$/.test(formData.telefono)) { setError('Teléfono no válido'); return false; }
    }
    if (currentStep === 1) {
      if (!formData.id_especialidad) { setError('Seleccione una especialidad'); return false; }
      if (!formData.id_consultorio) { setError('Seleccione un consultorio'); return false; }
    }
    if (currentStep === 2) {
      if (!formData.id_horario) { setError('Seleccione un horario de atención'); return false; }
      if (formData.dias_atencion.length === 0) { setError('Seleccione al menos un día de atención'); return false; }
    }
    if (currentStep === 3) {
      if (!formData.contraseña) { setError('La contraseña es requerida'); return false; }
      if (!passwordValidation.mayuscula || !passwordValidation.minuscula ||
          !passwordValidation.numero || !passwordValidation.caracterEspecial ||
          !passwordValidation.minimo8) { setError('La contraseña no cumple con los requisitos'); return false; }
      if (formData.contraseña !== formData.confirmarContraseña) { setError('Las contraseñas no coinciden'); return false; }
    }
    setError('');
    return true;
  };

  const siguientePaso = () => { if (validarPasoActual() && currentStep < pasos.length - 1) setCurrentStep(s => s + 1); };
  const pasoAnterior = () => { if (currentStep > 0) { setCurrentStep(s => s - 1); setError(''); } };
  const handleBack = () => navigate('/Doctor_Dashboard');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarPasoActual()) return;
    setError(''); setSuccess(''); setLoading(true);

    try {
      const dataToSend = {
        nombre: formData.nombre?.trim(),
        apellido: formData.apellido?.trim(),
        email: formData.email?.trim(),
        cedula: formData.cedula?.trim(),
        telefono: formData.telefono?.trim(),
        contraseña_hash: formData.contraseña,
        id_especialidad: parseInt(formData.id_especialidad),
        id_consultorio: parseInt(formData.id_consultorio),
        horario_id: parseInt(formData.id_horario),       // ✅ campo correcto según BD
        dias_atencion: formData.dias_atencion.join(','),
        rol: 'medico',                                    // ✅ valor válido del enum
        estado: 'activo',
      };

      const response = await usuarioService.crearDoctor(dataToSend);

      if (response?.ok) {
        setSuccess(response.msg || '✅ Doctor creado exitosamente');
        setFormData({
          nombre: '', apellido: '', email: '', cedula: '', telefono: '',
          id_especialidad: '', id_consultorio: '', id_horario: '',
          contraseña: '', confirmarContraseña: '', dias_atencion: []
        });
        setTimeout(() => navigate('/Doctor_Dashboard'), 2000);
      } else {
        setError(response?.msg || 'Error al crear el doctor');
      }
    } catch (err) {
      setError(err?.message || 'Error inesperado al crear el doctor');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / pasos.length) * 100;
  const CurrentIcon = pasos[currentStep]?.icono;
  const primaryColor = config?.theme?.colors?.primary || DEFAULT_CONFIG.theme.colors.primary;
  const secondaryColor = config?.theme?.colors?.secondary || DEFAULT_CONFIG.theme.colors.secondary;

  const isFormValid = () =>
    formData.nombre && formData.apellido && formData.email && formData.cedula &&
    formData.telefono && formData.id_especialidad && formData.id_consultorio &&
    formData.id_horario && formData.dias_atencion.length > 0 && formData.contraseña &&
    formData.contraseña === formData.confirmarContraseña &&
    passwordValidation.mayuscula && passwordValidation.minuscula &&
    passwordValidation.numero && passwordValidation.caracterEspecial && passwordValidation.minimo8;

  const horarioSeleccionado = horarios.find(h => String(h?.id_horario) === formData.id_horario);

  if (loadingData) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: colors?.neutral?.[50] || '#f9fafb',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: `4px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
            borderTop: `4px solid ${primaryColor}`,
            borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto',
          }} />
          <p style={{ marginTop: '24px', color: colors?.neutral?.[600] || '#4b5563' }}>Cargando datos...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: spacing?.md || '16px',
    border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
    borderRadius: borderRadius?.md || '6px',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    fontWeight: typography?.fontWeight?.semibold || 600,
    color: colors?.neutral?.[700] || '#374151',
    marginBottom: spacing?.xs || '4px',
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: colors?.neutral?.[50] || '#f9fafb',
      overflow: 'auto', zIndex: 1000, animation: 'fadeIn 0.3s ease-in-out',
    }}>
      {/* Header */}
      <div style={{
        background: colors?.neutral?.[0] || '#fff',
        borderBottom: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
        padding: spacing?.lg || '24px',
        boxShadow: shadows?.sm, position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing?.md || '16px', maxWidth: '1400px', margin: '0 auto' }}>
          <button onClick={handleBack} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: colors?.neutral?.[600] || '#4b5563',
            display: 'flex', alignItems: 'center', padding: spacing?.sm || '8px',
          }}>
            <MdArrowBack size={24} />
          </button>
          <h1 style={{
            fontSize: typography?.fontSize?.['2xl']?.size || '24px',
            fontWeight: typography?.fontWeight?.bold || 700,
            color: colors?.neutral?.[900] || '#111827', margin: 0,
          }}>
            Crear Nuevo Doctor
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: spacing?.xl || '32px' }}>

        {error && (
          <div style={{
            padding: spacing?.md || '16px', marginBottom: spacing?.lg || '24px',
            backgroundColor: colors?.error?.light || '#fee2e2',
            border: `2px solid ${colors?.error?.main || '#dc2626'}`,
            color: colors?.error?.dark || '#991b1b',
            borderRadius: borderRadius?.lg || '8px',
            fontWeight: typography?.fontWeight?.semibold || 600,
            fontSize: typography?.fontSize?.sm?.size || '14px',
            display: 'flex', alignItems: 'center', gap: spacing?.md || '16px',
          }}>
            <MdErrorOutline size={20} />{error}
          </div>
        )}

        {success && (
          <div style={{
            padding: spacing?.md || '16px', marginBottom: spacing?.lg || '24px',
            backgroundColor: colors?.success?.light || '#d1fae5',
            border: `2px solid ${colors?.success?.main || '#10b981'}`,
            color: colors?.success?.dark || '#059669',
            borderRadius: borderRadius?.lg || '8px',
            fontWeight: typography?.fontWeight?.semibold || 600,
            fontSize: typography?.fontSize?.sm?.size || '14px',
            display: 'flex', alignItems: 'center', gap: spacing?.md || '16px',
          }}>
            <MdCheck size={20} />{success}
          </div>
        )}

        {/* Progress Bar */}
        <div style={{
          background: colors?.neutral?.[0] || '#fff',
          border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
          borderRadius: borderRadius?.xl || '12px',
          padding: spacing?.lg || '24px', marginBottom: spacing?.lg || '24px',
          boxShadow: shadows?.sm,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing?.md || '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px', fontSize: typography?.fontSize?.sm?.size || '14px', fontWeight: typography?.fontWeight?.semibold || 600, color: colors?.neutral?.[700] || '#374151' }}>
              {CurrentIcon && <CurrentIcon size={20} style={{ color: primaryColor }} />}
              Paso {currentStep + 1} de {pasos.length}
            </div>
            <div style={{ fontSize: typography?.fontSize?.sm?.size || '14px', fontWeight: typography?.fontWeight?.medium || 500, color: colors?.neutral?.[600] || '#4b5563' }}>
              {pasos[currentStep]?.titulo}
            </div>
          </div>
          <div style={{ height: '8px', background: colors?.neutral?.[200] || '#e5e7eb', borderRadius: borderRadius?.full || '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, height: '100%', background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, borderRadius: borderRadius?.full || '9999px', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            background: colors?.neutral?.[0] || '#fff',
            border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
            borderRadius: borderRadius?.xl || '12px',
            padding: spacing?.xl || '32px', boxShadow: shadows?.md,
          }}>

            {/* Paso 1 */}
            {currentStep === 0 && (
              <div>
                <h3 style={{ fontSize: typography?.fontSize?.lg?.size || '18px', fontWeight: typography?.fontWeight?.bold || 700, color: colors?.neutral?.[900] || '#111827', margin: 0, marginBottom: spacing?.lg || '24px', paddingBottom: spacing?.md || '16px', borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}` }}>
                  Informacion Personal
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.lg || '24px' }}>
                  {[
                    { label: 'Nombre *', name: 'nombre', type: 'text', placeholder: 'Nombre del doctor' },
                    { label: 'Apellido *', name: 'apellido', type: 'text', placeholder: 'Apellido del doctor' },
                    { label: 'Email *', name: 'email', type: 'email', placeholder: 'doctor@email.com' },
                    { label: 'Cédula *', name: 'cedula', type: 'text', placeholder: '12345678' },
                    { label: 'Teléfono *', name: 'telefono', type: 'tel', placeholder: '0999999999' },
                  ].map(field => (
                    <div key={field.name}>
                      <label style={labelStyle}>{field.label}</label>
                      <input type={field.type} name={field.name} value={formData[field.name]}
                        onChange={handleInputChange} placeholder={field.placeholder} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = primaryColor}
                        onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 2 */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontSize: typography?.fontSize?.lg?.size || '18px', fontWeight: typography?.fontWeight?.bold || 700, color: colors?.neutral?.[900] || '#111827', margin: 0, marginBottom: spacing?.lg || '24px', paddingBottom: spacing?.md || '16px', borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}` }}>
                  Informacion Profesional
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.lg || '24px' }}>
                  {[
                    { label: 'Especialidad *', name: 'id_especialidad', items: especialidades, idKey: 'id_especialidad', emptyMsg: 'No hay especialidades activas. Cree una especialidad primero.' },
                    { label: 'Consultorio *', name: 'id_consultorio', items: consultorios, idKey: 'id_consultorio', emptyMsg: 'No hay consultorios activos. Cree un consultorio primero.' },
                  ].map(sel => (
                    <div key={sel.name}>
                      <label style={labelStyle}>{sel.label}</label>
                      <select name={sel.name} value={formData[sel.name]} onChange={handleInputChange}
                        style={{ ...inputStyle, background: colors?.neutral?.[0] || '#fff', cursor: 'pointer' }}
                        onFocus={e => e.target.style.borderColor = primaryColor}
                        onBlur={e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                      >
                        <option value="">Selecciona {sel.label.replace(' *', '').toLowerCase()}</option>
                        {Array.isArray(sel.items) && sel.items.length > 0
                          ? sel.items.map(item => {
                              if (!item) return null;
                              const id = item?.[sel.idKey] || item?.id;
                              const nombre = item?.nombre || 'Sin nombre';
                              const extra = item?.ciudad ? ` - ${item.ciudad}` : '';
                              return <option key={id} value={id}>{nombre}{extra}</option>;
                            })
                          : <option value="" disabled>No hay opciones disponibles</option>
                        }
                      </select>
                      {(!Array.isArray(sel.items) || sel.items.length === 0) && (
                        <p style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', marginTop: spacing?.xs || '4px' }}>
                          {sel.emptyMsg}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 3 */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontSize: typography?.fontSize?.lg?.size || '18px', fontWeight: typography?.fontWeight?.bold || 700, color: colors?.neutral?.[900] || '#111827', margin: 0, marginBottom: spacing?.lg || '24px', paddingBottom: spacing?.md || '16px', borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}` }}>
                  Horario de Atencion
                </h3>

                <div style={{ marginBottom: spacing?.xl || '32px' }}>
                  <label style={{ ...labelStyle, marginBottom: spacing?.sm || '8px' }}>Seleccione un Horario *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: spacing?.md || '16px' }}>
                    {horarios.map(horario => {
                      if (!horario) return null;
                      const horarioId = String(horario.id_horario);
                      const isSelected = formData.id_horario === horarioId;
                      return (
                        <label key={horarioId} style={{
                          display: 'flex', alignItems: 'center', gap: spacing?.md || '16px',
                          padding: spacing?.md || '16px',
                          background: isSelected ? `${primaryColor}10` : colors?.neutral?.[50] || '#f9fafb',
                          border: `2px solid ${isSelected ? primaryColor : colors?.neutral?.[200] || '#e5e7eb'}`,
                          borderRadius: borderRadius?.lg || '8px', cursor: 'pointer', transition: '0.3s',
                        }}>
                          <input type="radio" name="id_horario" value={horarioId}
                            checked={isSelected} onChange={handleInputChange}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: primaryColor }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: typography?.fontWeight?.semibold || 600, fontSize: typography?.fontSize?.md?.size || '16px', color: isSelected ? primaryColor : colors?.neutral?.[800] || '#1f2937', marginBottom: spacing?.xs || '4px' }}>
                              {horario.nombre}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: spacing?.md || '16px', fontSize: typography?.fontSize?.sm?.size || '14px', color: colors?.neutral?.[600] || '#4b5563' }}>
                              <MdAccessTime size={16} />
                              <span>{horario.horario_inicio?.substring(0, 5)} - {horario.horario_fin?.substring(0, 5)}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {horarioSeleccionado && (
                  <div style={{ padding: spacing?.md || '16px', background: colors?.success?.light || '#d1fae5', borderRadius: borderRadius?.md || '6px', marginBottom: spacing?.xl || '32px', border: `1px solid ${colors?.success?.main || '#10b981'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px', marginBottom: spacing?.sm || '8px' }}>
                      <MdCheck size={18} style={{ color: colors?.success?.dark || '#059669' }} />
                      <span style={{ fontWeight: typography?.fontWeight?.semibold || 600, color: colors?.success?.dark || '#059669' }}>
                        Horario seleccionado: {horarioSeleccionado.nombre}
                      </span>
                    </div>
                    <div style={{ fontSize: typography?.fontSize?.sm?.size || '14px', color: colors?.success?.dark || '#059669' }}>
                      Horario: {horarioSeleccionado.horario_inicio?.substring(0, 5)} - {horarioSeleccionado.horario_fin?.substring(0, 5)}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ ...labelStyle, marginBottom: spacing?.md || '16px' }}>
                    Días de Atención * (Seleccione los días que trabaja)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: spacing?.md || '16px' }}>
                    {diasSemana.map(dia => {
                      const isChecked = formData.dias_atencion.includes(dia.id);
                      return (
                        <label key={dia.id} style={{
                          display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px',
                          padding: spacing?.md || '16px',
                          background: isChecked ? `${primaryColor}10` : colors?.neutral?.[50] || '#f9fafb',
                          border: `2px solid ${isChecked ? primaryColor : colors?.neutral?.[200] || '#e5e7eb'}`,
                          borderRadius: borderRadius?.md || '6px', cursor: 'pointer', transition: '0.3s',
                        }}>
                          <input type="checkbox" checked={isChecked} onChange={() => handleDiaToggle(dia.id)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: primaryColor }}
                          />
                          <span style={{ fontSize: typography?.fontSize?.sm?.size || '14px', fontWeight: isChecked ? 600 : 400, color: isChecked ? primaryColor : colors?.neutral?.[600] || '#4b5563' }}>
                            {dia.nombre}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {formData.dias_atencion.length > 0 && (
                    <div style={{ marginTop: spacing?.md || '16px', padding: spacing?.sm || '8px', background: colors?.success?.light || '#d1fae5', borderRadius: borderRadius?.md || '6px', display: 'inline-block' }}>
                      <span style={{ fontSize: typography?.fontSize?.xs?.size || '12px', color: colors?.success?.dark || '#059669', display: 'flex', alignItems: 'center', gap: spacing?.xs || '4px' }}>
                        <MdCheck size={14} /> Días seleccionados: {formData.dias_atencion.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Paso 4 */}
            {currentStep === 3 && (
              <div>
                <h3 style={{ fontSize: typography?.fontSize?.lg?.size || '18px', fontWeight: typography?.fontWeight?.bold || 700, color: colors?.neutral?.[900] || '#111827', margin: 0, marginBottom: spacing?.lg || '24px', paddingBottom: spacing?.md || '16px', borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}` }}>
                  Credenciales de Acceso
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.lg || '24px', marginBottom: spacing?.lg || '24px' }}>
                  {[
                    { label: 'Contraseña *', name: 'contraseña', show: showPassword, toggle: () => setShowPassword(v => !v) },
                    { label: 'Confirmar Contraseña *', name: 'confirmarContraseña', show: showConfirmPassword, toggle: () => setShowConfirmPassword(v => !v) },
                  ].map(field => (
                    <div key={field.name}>
                      <label style={labelStyle}>{field.label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={field.show ? 'text' : 'password'} name={field.name}
                          value={formData[field.name]} onChange={handleInputChange} placeholder="••••••••"
                          style={{
                            ...inputStyle,
                            padding: `${spacing?.md || '16px'} 40px ${spacing?.md || '16px'} ${spacing?.md || '16px'}`,
                            borderColor: field.name === 'confirmarContraseña' && formData.confirmarContraseña && formData.contraseña !== formData.confirmarContraseña
                              ? colors?.error?.main || '#dc2626'
                              : colors?.neutral?.[200] || '#e5e7eb',
                          }}
                          onFocus={e => e.target.style.borderColor = primaryColor}
                          onBlur={e => e.target.style.borderColor = field.name === 'confirmarContraseña' && formData.confirmarContraseña && formData.contraseña !== formData.confirmarContraseña ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                        />
                        <button type="button" onClick={field.toggle} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: colors?.neutral?.[500] || '#6b7280' }}>
                          {field.show ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                      </div>
                      {field.name === 'confirmarContraseña' && formData.confirmarContraseña && formData.contraseña !== formData.confirmarContraseña && (
                        <p style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', marginTop: spacing?.xs || '4px' }}>
                          Las contraseñas no coinciden
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {formData.contraseña && (
                  <div style={{ padding: spacing?.md || '16px', background: colors?.neutral?.[50] || '#f9fafb', border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`, borderRadius: borderRadius?.md || '6px' }}>
                    <p style={{ fontSize: typography?.fontSize?.sm?.size || '14px', fontWeight: typography?.fontWeight?.semibold || 600, color: colors?.neutral?.[900] || '#111827', margin: 0, marginBottom: spacing?.md || '16px' }}>
                      Requisitos de contraseña:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.md || '16px' }}>
                      {[
                        { key: 'mayuscula', label: 'Una mayúscula (A-Z)' },
                        { key: 'minuscula', label: 'Una minúscula (a-z)' },
                        { key: 'numero', label: 'Un número (0-9)' },
                        { key: 'caracterEspecial', label: 'Carácter especial (!@#$%^&*)' },
                        { key: 'minimo8', label: 'Mínimo 8 caracteres' },
                      ].map(req => (
                        <div key={req.key} style={{ display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px' }}>
                          {passwordValidation[req.key]
                            ? <MdCheck size={18} style={{ color: colors?.success?.main || '#10b981' }} />
                            : <MdClose size={18} style={{ color: colors?.error?.main || '#dc2626' }} />
                          }
                          <span style={{ fontSize: typography?.fontSize?.xs?.size || '12px' }}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navegacion */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing?.md || '16px', marginTop: spacing?.['2xl'] || '48px', paddingTop: spacing?.lg || '24px', borderTop: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}` }}>
              {currentStep > 0 && (
                <button type="button" onClick={pasoAnterior} style={{ padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`, background: colors?.neutral?.[100] || '#f3f4f6', color: colors?.neutral?.[700] || '#374151', border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`, borderRadius: borderRadius?.md || '6px', fontWeight: typography?.fontWeight?.semibold || 600, fontSize: typography?.fontSize?.sm?.size || '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px' }}
                  onMouseEnter={e => e.currentTarget.style.background = colors?.neutral?.[200] || '#e5e7eb'}
                  onMouseLeave={e => e.currentTarget.style.background = colors?.neutral?.[100] || '#f3f4f6'}
                >
                  <MdArrowBack size={18} /> Atrás
                </button>
              )}

              {currentStep < pasos.length - 1 ? (
                <button type="button" onClick={siguientePaso} style={{ marginLeft: 'auto', padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`, background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, color: '#fff', border: 'none', borderRadius: borderRadius?.md || '6px', fontWeight: typography?.fontWeight?.semibold || 600, fontSize: typography?.fontSize?.sm?.size || '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Siguiente <MdArrowForward size={18} />
                </button>
              ) : (
                <button type="submit" disabled={!isFormValid() || loading} style={{ marginLeft: 'auto', padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`, background: isFormValid() ? `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` : colors?.neutral?.[300] || '#d1d5db', color: '#fff', border: 'none', borderRadius: borderRadius?.md || '6px', fontWeight: typography?.fontWeight?.semibold || 600, fontSize: typography?.fontSize?.sm?.size || '14px', cursor: isFormValid() && !loading ? 'pointer' : 'not-allowed', opacity: isFormValid() ? 1 : 0.6, display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px' }}
                  onMouseEnter={e => isFormValid() && !loading && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => isFormValid() && !loading && (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? '⏳ Creando...' : '✓ Crear Doctor'}
                  {!loading && <MdCheck size={18} />}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RegisterDct;