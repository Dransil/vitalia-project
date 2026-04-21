import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import {
  MdArrowBack, MdCheck, MdPerson, MdWork, MdSchedule,
  MdSecurity, MdErrorOutline, MdVisibility, MdVisibilityOff,
  MdClose, MdAccessTime, MdEdit
} from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import * as especialidadesService from '../../../Services/especialidadesService';
import * as consultoriosService from '../../../Services/Consultorioservice';
import usuarioService from '../../../Services/usuarioService';

const DEFAULT_COLORS = {
  neutral: { 0: '#fff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
  success: { light: '#d1fae5', main: '#10b981', dark: '#059669' },
  error:   { light: '#fee2e2', main: '#dc2626', dark: '#991b1b' },
};
const DEFAULT_SPACING      = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' };
const DEFAULT_TYPOGRAPHY   = {
  fontSize:   { xs: { size: '12px' }, sm: { size: '14px' }, md: { size: '16px' }, lg: { size: '18px' }, xl: { size: '20px' }, '2xl': { size: '24px' } },
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 }
};
const DEFAULT_BORDER_RADIUS = { sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px' };
const DEFAULT_SHADOWS       = { sm: '0 1px 2px 0 rgba(0,0,0,0.05)', md: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const DEFAULT_CONFIG        = { theme: { colors: { primary: '#0ea5e9', secondary: '#14b8a6' } } };

const HORARIOS_DEFAULT = [
  { id_horario: 1, nombre: 'Mañana',   horario_inicio: '08:00:00', horario_fin: '12:00:00' },
  { id_horario: 2, nombre: 'Tarde',    horario_inicio: '14:00:00', horario_fin: '18:00:00' },
  { id_horario: 3, nombre: 'Completo', horario_inicio: '08:00:00', horario_fin: '18:00:00' },
];

const DIAS_SEMANA = [
  { id: 'Lun', nombre: 'Lunes'     }, { id: 'Mar', nombre: 'Martes'    },
  { id: 'Mie', nombre: 'Miércoles' }, { id: 'Jue', nombre: 'Jueves'    },
  { id: 'Vie', nombre: 'Viernes'   }, { id: 'Sab', nombre: 'Sábado'    },
  { id: 'Dom', nombre: 'Domingo'   }
];

const toStr = (v) => (v !== null && v !== undefined && v !== '') ? String(v) : '';

const DoctorMd = () => {
  const navigate = useNavigate();
  const { id }   = useParams();

  let themeContext = {};
  try { themeContext = useTheme() || {}; } catch (e) {}

  const config       = themeContext.config       || DEFAULT_CONFIG;
  const colors       = themeContext.colors       || DEFAULT_COLORS;
  const spacing      = themeContext.spacing      || DEFAULT_SPACING;
  const typography   = themeContext.typography   || DEFAULT_TYPOGRAPHY;
  const borderRadius = themeContext.borderRadius || DEFAULT_BORDER_RADIUS;
  const shadows      = themeContext.shadows      || DEFAULT_SHADOWS;

  const primaryColor   = config?.theme?.colors?.primary   || DEFAULT_CONFIG.theme.colors.primary;
  const secondaryColor = config?.theme?.colors?.secondary || DEFAULT_CONFIG.theme.colors.secondary;

  const [loadingData, setLoadingData]     = useState(true);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState('');
  const [activeSection, setActiveSection] = useState('personal');

  const [horarios, setHorarios]             = useState(HORARIOS_DEFAULT);
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios]     = useState([]);

  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cambiarPassword, setCambiarPassword]         = useState(false);
  const [passwordValidation, setPasswordValidation]   = useState({
    mayuscula: false, minuscula: false, numero: false, caracterEspecial: false, minimo8: false,
  });

  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', cedula: '', telefono: '',
    id_especialidad: '', id_consultorio: '', id_horario: '',
    dias_atencion: [], estado: 'activo',
    nueva_contraseña: '', confirmar_contraseña: '',
  });

  const secciones = [
    { id: 'personal',     label: 'Personal',     icono: MdPerson   },
    { id: 'profesional',  label: 'Profesional',  icono: MdWork     },
    { id: 'horario',      label: 'Horario',      icono: MdSchedule },
    { id: 'credenciales', label: 'Credenciales', icono: MdSecurity },
  ];

  useEffect(() => {
    if (!id) {
      setError('ID de doctor no encontrado en la URL');
      setLoadingData(false);
      return;
    }

    const loadAll = async () => {
      setLoadingData(true);
      setError('');
      try {
        const [doctorRes, espRes, consRes] = await Promise.all([
          usuarioService.obtenerUsuario(id),
          especialidadesService.getEspecialidades(),
          consultoriosService.getConsultorios(),
        ]);

        if (espRes?.ok && Array.isArray(espRes.data)) {
          setEspecialidades(espRes.data.filter(e => e && (e.estado === 'activa' || e.estado === 'activo')));
        }
        if (consRes?.ok && Array.isArray(consRes.data)) {
          setConsultorios(consRes.data.filter(c => c && (c.estado === 'activo' || c.estado === 'activa')));
        }

        if (!doctorRes?.ok || !doctorRes.data) {
          setError(doctorRes?.msg || 'No se pudo cargar el doctor');
          return;
        }

        const doc = doctorRes.data;

        // ── cédula: campo directo en la tabla usuarios ──────────────────
        const cedula = toStr(doc.cedula);

        // ── horario_id: FK directa en la tabla usuarios ─────────────────
        // El backend ahora lo expone como doc.horario_id
        // Fallback: doc.Horario.id_horario (relación incluida)
        const id_horario = toStr(
          doc.horario_id        ||
          doc.Horario?.id_horario
        );

        // ── especialidad y consultorio: vienen en asignaciones[0] ───────
        // Con el backend corregido, asignaciones[0] incluye id_especialidad
        // e id_consultorio como atributos directos de la tabla pivot
        const asig = Array.isArray(doc.asignaciones) && doc.asignaciones.length > 0
          ? doc.asignaciones[0]
          : null;

        const id_especialidad = toStr(
          asig?.id_especialidad              ||
          asig?.Especialidad?.id_especialidad
        );

        const id_consultorio = toStr(
          asig?.id_consultorio              ||
          asig?.Consultorio?.id_consultorio
        );

        // ── días de atención ─────────────────────────────────────────────
        let diasArray = [];
        if (Array.isArray(doc.dias_atencion)) {
          diasArray = doc.dias_atencion;
        } else if (typeof doc.dias_atencion === 'string' && doc.dias_atencion.trim()) {
          diasArray = doc.dias_atencion.split(',').map(d => d.trim()).filter(Boolean);
        }

        setFormData({
          nombre:               doc.nombre   || '',
          apellido:             doc.apellido || '',
          email:                doc.email    || '',
          cedula,
          telefono:             doc.telefono || '',
          id_especialidad,
          id_consultorio,
          id_horario,
          dias_atencion:        diasArray,
          estado:               doc.estado   || 'activo',
          nueva_contraseña:     '',
          confirmar_contraseña: '',
        });

      } catch (err) {
        setError('Error al cargar los datos. Por favor, recargue la página.');
      } finally {
        setLoadingData(false);
      }
    };

    loadAll();
  }, [id]);

  const validatePassword = (p) => ({
    mayuscula:        /[A-Z]/.test(p),
    minuscula:        /[a-z]/.test(p),
    numero:           /[0-9]/.test(p),
    caracterEspecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
    minimo8:          p?.length >= 8,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'nueva_contraseña') setPasswordValidation(validatePassword(value));
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

  const validarFormulario = () => {
    if (!formData.nombre?.trim())   { setError('El nombre es requerido');        return false; }
    if (!formData.apellido?.trim()) { setError('El apellido es requerido');      return false; }
    if (!formData.email?.trim())    { setError('El email es requerido');         return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Email no válido'); return false; }
    if (!formData.cedula?.trim())   { setError('La cédula es requerida');        return false; }
    if (!formData.telefono?.trim()) { setError('El teléfono es requerido');      return false; }
    if (!formData.id_especialidad)  { setError('Seleccione una especialidad');   return false; }
    if (!formData.id_consultorio)   { setError('Seleccione un consultorio');     return false; }
    if (!formData.id_horario)       { setError('Seleccione un horario');         return false; }
    if (formData.dias_atencion.length === 0) { setError('Seleccione al menos un día'); return false; }

    if (cambiarPassword) {
      if (!formData.nueva_contraseña) { setError('Ingrese la nueva contraseña'); return false; }
      const pv = validatePassword(formData.nueva_contraseña);
      if (!pv.mayuscula || !pv.minuscula || !pv.numero || !pv.caracterEspecial || !pv.minimo8) {
        setError('La contraseña no cumple los requisitos'); return false;
      }
      if (formData.nueva_contraseña !== formData.confirmar_contraseña) {
        setError('Las contraseñas no coinciden'); return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setError(''); setSuccess(''); setLoading(true);

    try {
      const dataToSend = {
        nombre:          formData.nombre?.trim(),
        apellido:        formData.apellido?.trim(),
        email:           formData.email?.trim(),
        cedula:          formData.cedula?.trim(),
        telefono:        formData.telefono?.trim(),
        id_especialidad: parseInt(formData.id_especialidad),
        id_consultorio:  parseInt(formData.id_consultorio),
        horario_id:      parseInt(formData.id_horario),   // ✅ nombre correcto en la BD
        dias_atencion:   formData.dias_atencion.join(','),
        estado:          formData.estado,
      };

      if (cambiarPassword && formData.nueva_contraseña) {
        dataToSend.contraseña_hash = formData.nueva_contraseña;
      }

      const response = await usuarioService.actualizarUsuario(id, dataToSend);

      if (response?.ok) {
        setSuccess(response.msg || '✅ Doctor actualizado exitosamente');
        setTimeout(() => navigate('/Doctor_Dashboard'), 2000);
      } else {
        setError(response?.msg || 'Error al actualizar el doctor');
      }
    } catch (err) {
      setError(err?.message || 'Error inesperado al actualizar el doctor');
    } finally {
      setLoading(false);
    }
  };

  const horarioSeleccionado = horarios.find(h => toStr(h.id_horario) === formData.id_horario);

  const inputStyle = {
    width: '100%', padding: spacing?.md || '16px',
    border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
    borderRadius: borderRadius?.md || '6px',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    outline: 'none', boxSizing: 'border-box',
    background: colors?.neutral?.[0] || '#fff',
    color: colors?.neutral?.[900] || '#111827',
  };

  const labelStyle = {
    display: 'block',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    fontWeight: typography?.fontWeight?.semibold || 600,
    color: colors?.neutral?.[700] || '#374151',
    marginBottom: spacing?.xs || '4px',
  };

  const sectionTitleStyle = {
    fontSize: typography?.fontSize?.lg?.size || '18px',
    fontWeight: typography?.fontWeight?.bold || 700,
    color: colors?.neutral?.[900] || '#111827',
    margin: 0, marginBottom: spacing?.lg || '24px',
    paddingBottom: spacing?.md || '16px',
    borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
    display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px',
  };

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
          <p style={{ marginTop: '24px', color: colors?.neutral?.[600] || '#4b5563' }}>Cargando datos del doctor...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
          <button onClick={() => navigate('/Doctor_Dashboard')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: colors?.neutral?.[600] || '#4b5563',
            display: 'flex', alignItems: 'center', padding: spacing?.sm || '8px',
            borderRadius: borderRadius?.md || '6px',
          }}>
            <MdArrowBack size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: borderRadius?.full || '9999px',
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MdEdit size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{
                fontSize: typography?.fontSize?.['2xl']?.size || '24px',
                fontWeight: typography?.fontWeight?.bold || 700,
                color: colors?.neutral?.[900] || '#111827', margin: 0, lineHeight: 1,
              }}>
                Modificar Doctor
              </h1>
              <p style={{ margin: 0, fontSize: typography?.fontSize?.xs?.size || '12px', color: colors?.neutral?.[500] || '#6b7280', marginTop: '2px' }}>
                ID: {id}
              </p>
            </div>
          </div>
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

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: spacing?.lg || '24px', alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{
            background: colors?.neutral?.[0] || '#fff',
            border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
            borderRadius: borderRadius?.xl || '12px',
            overflow: 'hidden', boxShadow: shadows?.sm,
            position: 'sticky', top: '90px',
          }}>
            {secciones.map((sec, idx) => {
              const Icon     = sec.icono;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id} type="button"
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: spacing?.md || '16px',
                    padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`,
                    background: isActive ? `${primaryColor}12` : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? `3px solid ${primaryColor}` : '3px solid transparent',
                    borderBottom: idx < secciones.length - 1 ? `1px solid ${colors?.neutral?.[100] || '#f3f4f6'}` : 'none',
                    cursor: 'pointer', textAlign: 'left', transition: '0.2s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = colors?.neutral?.[50] || '#f9fafb'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon size={20} style={{ color: isActive ? primaryColor : colors?.neutral?.[400] || '#9ca3af', flexShrink: 0 }} />
                  <span style={{
                    fontSize: typography?.fontSize?.sm?.size || '14px',
                    fontWeight: isActive ? typography?.fontWeight?.semibold || 600 : typography?.fontWeight?.normal || 400,
                    color: isActive ? primaryColor : colors?.neutral?.[600] || '#4b5563',
                  }}>
                    {sec.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contenido */}
          <form onSubmit={handleSubmit}>
            <div style={{
              background: colors?.neutral?.[0] || '#fff',
              border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
              borderRadius: borderRadius?.xl || '12px',
              padding: spacing?.xl || '32px',
              boxShadow: shadows?.md,
            }}>

              {/* ── Personal ─────────────────────────────────────────── */}
              {activeSection === 'personal' && (
                <div>
                  <h3 style={sectionTitleStyle}>
                    <MdPerson size={22} style={{ color: primaryColor }} />
                    Información Personal
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.lg || '24px' }}>
                    {[
                      { label: 'Nombre *',   name: 'nombre',   type: 'text',  placeholder: 'Nombre del doctor'  },
                      { label: 'Apellido *', name: 'apellido', type: 'text',  placeholder: 'Apellido del doctor' },
                      { label: 'Email *',    name: 'email',    type: 'email', placeholder: 'doctor@email.com'   },
                      { label: 'Cédula *',   name: 'cedula',   type: 'text',  placeholder: '12345678'           },
                      { label: 'Teléfono *', name: 'telefono', type: 'tel',   placeholder: '0999999999'         },
                    ].map(field => (
                      <div key={field.name}>
                        <label style={labelStyle}>{field.label}</label>
                        <input
                          type={field.type} name={field.name}
                          value={formData[field.name]} onChange={handleInputChange}
                          placeholder={field.placeholder} style={inputStyle}
                          onFocus={e => e.target.style.borderColor = primaryColor}
                          onBlur={e  => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                        />
                      </div>
                    ))}

                    <div>
                      <label style={labelStyle}>Estado</label>
                      <select
                        name="estado" value={formData.estado} onChange={handleInputChange}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        onFocus={e => e.target.style.borderColor = primaryColor}
                        onBlur={e  => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Profesional ──────────────────────────────────────── */}
              {activeSection === 'profesional' && (
                <div>
                  <h3 style={sectionTitleStyle}>
                    <MdWork size={22} style={{ color: primaryColor }} />
                    Información Profesional
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.lg || '24px' }}>
                    {[
                      {
                        label: 'Especialidad *', name: 'id_especialidad',
                        items: especialidades,   idKey: 'id_especialidad',
                        placeholder: 'Selecciona una especialidad',
                        emptyMsg: 'No hay especialidades activas.',
                      },
                      {
                        label: 'Consultorio *', name: 'id_consultorio',
                        items: consultorios,    idKey: 'id_consultorio',
                        placeholder: 'Selecciona un consultorio',
                        emptyMsg: 'No hay consultorios activos.',
                      },
                    ].map(sel => (
                      <div key={sel.name}>
                        <label style={labelStyle}>{sel.label}</label>
                        <select
                          name={sel.name} value={formData[sel.name]} onChange={handleInputChange}
                          style={{ ...inputStyle, cursor: 'pointer' }}
                          onFocus={e => e.target.style.borderColor = primaryColor}
                          onBlur={e  => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb'}
                        >
                          <option value="">{sel.placeholder}</option>
                          {Array.isArray(sel.items) && sel.items.length > 0
                            ? sel.items.map(item => {
                                if (!item) return null;
                                const itemId = toStr(item?.[sel.idKey] || item?.id);
                                const extra  = item?.ciudad ? ` - ${item.ciudad}` : '';
                                return (
                                  <option key={itemId} value={itemId}>
                                    {item.nombre || 'Sin nombre'}{extra}
                                  </option>
                                );
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

              {/* ── Horario ──────────────────────────────────────────── */}
              {activeSection === 'horario' && (
                <div>
                  <h3 style={sectionTitleStyle}>
                    <MdSchedule size={22} style={{ color: primaryColor }} />
                    Horario de Atención
                  </h3>

                  <div style={{ marginBottom: spacing?.xl || '32px' }}>
                    <label style={{ ...labelStyle, marginBottom: spacing?.sm || '8px' }}>Turno *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: spacing?.md || '16px' }}>
                      {horarios.map(horario => {
                        const horarioId  = toStr(horario.id_horario);
                        const isSelected = formData.id_horario === horarioId;
                        return (
                          <label key={horarioId} style={{
                            display: 'flex', alignItems: 'center', gap: spacing?.md || '16px',
                            padding: spacing?.md || '16px',
                            background: isSelected ? `${primaryColor}10` : colors?.neutral?.[50] || '#f9fafb',
                            border: `2px solid ${isSelected ? primaryColor : colors?.neutral?.[200] || '#e5e7eb'}`,
                            borderRadius: borderRadius?.lg || '8px', cursor: 'pointer', transition: '0.2s',
                          }}>
                            <input
                              type="radio" name="id_horario" value={horarioId}
                              checked={isSelected} onChange={handleInputChange}
                              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: primaryColor }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: typography?.fontSize?.md?.size || '16px', color: isSelected ? primaryColor : colors?.neutral?.[800] || '#1f2937', marginBottom: '4px' }}>
                                {horario.nombre}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: typography?.fontSize?.sm?.size || '14px', color: colors?.neutral?.[600] || '#4b5563' }}>
                                <MdAccessTime size={15} />
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <MdCheck size={16} style={{ color: colors?.success?.dark || '#059669' }} />
                        <span style={{ fontWeight: 600, color: colors?.success?.dark || '#059669', fontSize: typography?.fontSize?.sm?.size || '14px' }}>
                          Turno seleccionado: {horarioSeleccionado.nombre}
                        </span>
                      </div>
                      <div style={{ fontSize: typography?.fontSize?.sm?.size || '14px', color: colors?.success?.dark || '#059669' }}>
                        {horarioSeleccionado.horario_inicio?.substring(0, 5)} - {horarioSeleccionado.horario_fin?.substring(0, 5)}
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ ...labelStyle, marginBottom: spacing?.md || '16px' }}>Días de Atención *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: spacing?.md || '16px' }}>
                      {DIAS_SEMANA.map(dia => {
                        const isChecked = formData.dias_atencion.includes(dia.id);
                        return (
                          <label key={dia.id} style={{
                            display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px',
                            padding: spacing?.md || '16px',
                            background: isChecked ? `${primaryColor}10` : colors?.neutral?.[50] || '#f9fafb',
                            border: `2px solid ${isChecked ? primaryColor : colors?.neutral?.[200] || '#e5e7eb'}`,
                            borderRadius: borderRadius?.md || '6px', cursor: 'pointer', transition: '0.2s',
                          }}>
                            <input
                              type="checkbox" checked={isChecked}
                              onChange={() => handleDiaToggle(dia.id)}
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
                        <span style={{ fontSize: typography?.fontSize?.xs?.size || '12px', color: colors?.success?.dark || '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MdCheck size={13} /> Días: {formData.dias_atencion.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Credenciales ─────────────────────────────────────── */}
              {activeSection === 'credenciales' && (
                <div>
                  <h3 style={sectionTitleStyle}>
                    <MdSecurity size={22} style={{ color: primaryColor }} />
                    Credenciales de Acceso
                  </h3>

                  <div style={{
                    padding: spacing?.md || '16px',
                    background: cambiarPassword ? `${primaryColor}08` : colors?.neutral?.[50] || '#f9fafb',
                    border: `2px solid ${cambiarPassword ? primaryColor : colors?.neutral?.[200] || '#e5e7eb'}`,
                    borderRadius: borderRadius?.lg || '8px',
                    marginBottom: spacing?.lg || '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', transition: '0.2s',
                  }}
                    onClick={() => {
                      setCambiarPassword(v => !v);
                      setFormData(prev => ({ ...prev, nueva_contraseña: '', confirmar_contraseña: '' }));
                      setPasswordValidation({ mayuscula: false, minuscula: false, numero: false, caracterEspecial: false, minimo8: false });
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: typography?.fontWeight?.semibold || 600, fontSize: typography?.fontSize?.sm?.size || '14px', color: cambiarPassword ? primaryColor : colors?.neutral?.[700] || '#374151' }}>
                        Cambiar contraseña
                      </p>
                      <p style={{ margin: 0, fontSize: typography?.fontSize?.xs?.size || '12px', color: colors?.neutral?.[500] || '#6b7280', marginTop: '2px' }}>
                        {cambiarPassword ? 'Haz clic para cancelar el cambio' : 'Haz clic para establecer una nueva contraseña'}
                      </p>
                    </div>
                    <div style={{
                      width: '44px', height: '24px', borderRadius: '12px',
                      background: cambiarPassword ? primaryColor : colors?.neutral?.[300] || '#d1d5db',
                      position: 'relative', transition: '0.3s', flexShrink: 0,
                    }}>
                      <div style={{
                        position: 'absolute', top: '3px',
                        left: cambiarPassword ? '23px' : '3px',
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: '#fff', transition: '0.3s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </div>
                  </div>

                  {cambiarPassword && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.lg || '24px', marginBottom: spacing?.lg || '24px' }}>
                      {[
                        { label: 'Nueva Contraseña *',     name: 'nueva_contraseña',    show: showPassword,        toggle: () => setShowPassword(v => !v)        },
                        { label: 'Confirmar Contraseña *', name: 'confirmar_contraseña', show: showConfirmPassword, toggle: () => setShowConfirmPassword(v => !v) },
                      ].map(field => (
                        <div key={field.name}>
                          <label style={labelStyle}>{field.label}</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={field.show ? 'text' : 'password'}
                              name={field.name} value={formData[field.name]}
                              onChange={handleInputChange} placeholder="••••••••"
                              style={{
                                ...inputStyle,
                                padding: `${spacing?.md || '16px'} 40px ${spacing?.md || '16px'} ${spacing?.md || '16px'}`,
                                borderColor: field.name === 'confirmar_contraseña' && formData.confirmar_contraseña && formData.nueva_contraseña !== formData.confirmar_contraseña
                                  ? colors?.error?.main || '#dc2626'
                                  : colors?.neutral?.[200] || '#e5e7eb',
                              }}
                              onFocus={e => e.target.style.borderColor = primaryColor}
                              onBlur={e  => e.target.style.borderColor = field.name === 'confirmar_contraseña' && formData.confirmar_contraseña && formData.nueva_contraseña !== formData.confirmar_contraseña ? colors?.error?.main || '#dc2626' : colors?.neutral?.[200] || '#e5e7eb'}
                            />
                            <button type="button" onClick={field.toggle} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: colors?.neutral?.[500] || '#6b7280' }}>
                              {field.show ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                            </button>
                          </div>
                          {field.name === 'confirmar_contraseña' && formData.confirmar_contraseña && formData.nueva_contraseña !== formData.confirmar_contraseña && (
                            <p style={{ color: colors?.error?.main || '#dc2626', fontSize: typography?.fontSize?.xs?.size || '12px', marginTop: '4px' }}>
                              Las contraseñas no coinciden
                            </p>
                          )}
                        </div>
                      ))}

                      {formData.nueva_contraseña && (
                        <div style={{ gridColumn: '1 / -1', padding: spacing?.md || '16px', background: colors?.neutral?.[50] || '#f9fafb', border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`, borderRadius: borderRadius?.md || '6px' }}>
                          <p style={{ margin: 0, marginBottom: spacing?.md || '16px', fontWeight: typography?.fontWeight?.semibold || 600, fontSize: typography?.fontSize?.sm?.size || '14px', color: colors?.neutral?.[900] || '#111827' }}>
                            Requisitos:
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.md || '16px' }}>
                            {[
                              { key: 'mayuscula',        label: 'Una mayúscula (A-Z)'        },
                              { key: 'minuscula',        label: 'Una minúscula (a-z)'        },
                              { key: 'numero',           label: 'Un número (0-9)'            },
                              { key: 'caracterEspecial', label: 'Carácter especial (!@#$%)' },
                              { key: 'minimo8',          label: 'Mínimo 8 caracteres'        },
                            ].map(req => (
                              <div key={req.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {passwordValidation[req.key]
                                  ? <MdCheck size={16} style={{ color: colors?.success?.main || '#10b981' }} />
                                  : <MdClose  size={16} style={{ color: colors?.error?.main  || '#dc2626' }} />
                                }
                                <span style={{ fontSize: typography?.fontSize?.xs?.size || '12px', color: colors?.neutral?.[600] || '#4b5563' }}>{req.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!cambiarPassword && (
                    <div style={{ padding: spacing?.lg || '24px', textAlign: 'center', color: colors?.neutral?.[500] || '#6b7280', fontSize: typography?.fontSize?.sm?.size || '14px' }}>
                      <MdSecurity size={40} style={{ color: colors?.neutral?.[300] || '#d1d5db', display: 'block', margin: '0 auto 12px' }} />
                      La contraseña actual se mantiene sin cambios.<br />
                      Activa la opción de arriba para modificarla.
                    </div>
                  )}
                </div>
              )}

              {/* Botones */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: spacing?.md || '16px',
                marginTop: spacing?.['2xl'] || '48px', paddingTop: spacing?.lg || '24px',
                borderTop: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
              }}>
                <button type="button" onClick={() => navigate('/Doctor_Dashboard')} style={{
                  padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`,
                  background: colors?.neutral?.[100] || '#f3f4f6',
                  color: colors?.neutral?.[700] || '#374151',
                  border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
                  borderRadius: borderRadius?.md || '6px',
                  fontWeight: typography?.fontWeight?.semibold || 600,
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  cursor: 'pointer', transition: '0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = colors?.neutral?.[200] || '#e5e7eb'}
                  onMouseLeave={e => e.currentTarget.style.background = colors?.neutral?.[100] || '#f3f4f6'}
                >
                  Cancelar
                </button>

                <button type="submit" disabled={loading} style={{
                  padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`,
                  background: loading ? colors?.neutral?.[300] || '#d1d5db' : `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                  color: '#fff', border: 'none',
                  borderRadius: borderRadius?.md || '6px',
                  fontWeight: typography?.fontWeight?.semibold || 600,
                  fontSize: typography?.fontSize?.sm?.size || '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: '0.2s', display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px',
                }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? '⏳ Guardando...' : <><MdCheck size={18} /> Guardar Cambios</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin    { to   { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DoctorMd;