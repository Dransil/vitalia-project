import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import {
  MdArrowBack, MdCheck, MdPerson, MdFavorite, MdPhone,
  MdErrorOutline, MdEdit, MdLocalHospital, MdContactPhone
} from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { getPacienteById, updatePaciente } from '../../../Services/pacienteService';

const DEFAULT_COLORS = {
  neutral: { 0: '#fff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
  success: { light: '#d1fae5', main: '#10b981', dark: '#059669' },
  error: { light: '#fee2e2', main: '#dc2626', dark: '#991b1b' },
};
const DEFAULT_SPACING = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' };
const DEFAULT_TYPOGRAPHY = {
  fontSize: { xs: { size: '12px' }, sm: { size: '14px' }, md: { size: '16px' }, lg: { size: '18px' }, xl: { size: '20px' }, '2xl': { size: '24px' } },
  fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 }
};
const DEFAULT_BORDER_RADIUS = { sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px' };
const DEFAULT_SHADOWS = { sm: '0 1px 2px 0 rgba(0,0,0,0.05)', md: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const DEFAULT_CONFIG = { theme: { colors: { primary: '#0ea5e9', secondary: '#14b8a6' } } };

const GRUPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SECCIONES = [
  { id: 'personal',    label: 'Personal',       icono: MdPerson },
  { id: 'medico',      label: 'Historial Médico', icono: MdLocalHospital },
  { id: 'emergencia',  label: 'Emergencia',      icono: MdContactPhone },
  { id: 'seguro',      label: 'Seguro',          icono: MdFavorite },
];

const FORM_INICIAL = {
  nombre: '', apellido: '', cedula: '', fecha_nacimiento: '',
  email: '', telefono: '', direccion: '', ciudad: '', estado: 'activo',
  alergias: '', condiciones_medicas: '', medicamentos_actuales: '', grupo_sanguineo: '',
  contacto_emergencia_nombre: '', contacto_emergencia_telefono: '', contacto_emergencia_relacion: '',
  seguro_medico: '', numero_poliza: '',
};

const PacienteMd = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData]       = useState(FORM_INICIAL);

  useEffect(() => {
    if (!id) {
      setError('ID de paciente no encontrado en la URL');
      setLoadingData(false);
      return;
    }
    const load = async () => {
      setLoadingData(true);
      try {
        const res = await getPacienteById(id);
        if (!res?.ok || !res.data) {
          setError(res?.msg || 'No se pudo cargar el paciente');
          return;
        }
        const p = res.data;
        setFormData({
          nombre:                       p.nombre                       || '',
          apellido:                     p.apellido                     || '',
          cedula:                       p.cedula                       || '',
          fecha_nacimiento:             p.fecha_nacimiento             ? p.fecha_nacimiento.substring(0, 10) : '',
          email:                        p.email                        || '',
          telefono:                     p.telefono                     || '',
          direccion:                    p.direccion                    || '',
          ciudad:                       p.ciudad                       || '',
          estado:                       p.estado                       || 'activo',
          alergias:                     p.alergias                     || '',
          condiciones_medicas:          p.condiciones_medicas          || '',
          medicamentos_actuales:        p.medicamentos_actuales        || '',
          grupo_sanguineo:              p.grupo_sanguineo              || '',
          contacto_emergencia_nombre:   p.contacto_emergencia_nombre   || '',
          contacto_emergencia_telefono: p.contacto_emergencia_telefono || '',
          contacto_emergencia_relacion: p.contacto_emergencia_relacion || '',
          seguro_medico:                p.seguro_medico                || '',
          numero_poliza:                p.numero_poliza                || '',
        });
      } catch (err) {
        setError('Error al cargar los datos del paciente.');
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validar = () => {
    if (!formData.nombre?.trim())   { setError('El nombre es requerido');   return false; }
    if (!formData.apellido?.trim()) { setError('El apellido es requerido'); return false; }
    if (!formData.cedula?.trim())   { setError('La cédula es requerida');   return false; }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Email no válido'); return false; }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setError(''); setSuccess(''); setLoading(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.fecha_nacimiento) delete dataToSend.fecha_nacimiento;

      const res = await updatePaciente(id, dataToSend);
      if (res?.ok) {
        setSuccess(res.msg || '✅ Paciente actualizado exitosamente');
        setTimeout(() => navigate(-1), 2000);
      } else {
        setError(res?.msg || 'Error al actualizar el paciente');
      }
    } catch (err) {
      setError(err?.message || 'Error inesperado al actualizar el paciente');
    } finally {
      setLoading(false);
    }
  };

  // Estilos base reutilizables
  const inp = {
    width: '100%', padding: spacing?.md || '16px',
    border: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
    borderRadius: borderRadius?.md || '6px',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    outline: 'none', boxSizing: 'border-box',
    background: colors?.neutral?.[0] || '#fff',
    color: colors?.neutral?.[900] || '#111827',
    transition: 'border-color 0.2s',
  };

  const lbl = {
    display: 'block',
    fontSize: typography?.fontSize?.sm?.size || '14px',
    fontWeight: typography?.fontWeight?.semibold || 600,
    color: colors?.neutral?.[700] || '#374151',
    marginBottom: spacing?.xs || '4px',
  };

  const secTitle = {
    fontSize: typography?.fontSize?.lg?.size || '18px',
    fontWeight: typography?.fontWeight?.bold || 700,
    color: colors?.neutral?.[900] || '#111827',
    margin: 0, marginBottom: spacing?.lg || '24px',
    paddingBottom: spacing?.md || '16px',
    borderBottom: `2px solid ${colors?.neutral?.[200] || '#e5e7eb'}`,
    display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px',
  };

  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing?.lg || '24px' };

  const onFocus = e => e.target.style.borderColor = primaryColor;
  const onBlur  = e => e.target.style.borderColor = colors?.neutral?.[200] || '#e5e7eb';

  if (loadingData) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: colors?.neutral?.[50] || '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: `4px solid ${colors?.neutral?.[200] || '#e5e7eb'}`, borderTop: `4px solid ${primaryColor}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '24px', color: colors?.neutral?.[600] || '#4b5563' }}>Cargando datos del paciente...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: colors?.neutral?.[50] || '#f9fafb', overflow: 'auto', zIndex: 1000, animation: 'fadeIn 0.3s ease-in-out' }}>

      {/* Header */}
      <div style={{ background: colors?.neutral?.[0] || '#fff', borderBottom: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`, padding: spacing?.lg || '24px', boxShadow: shadows?.sm, position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing?.md || '16px', maxWidth: '1400px', margin: '0 auto' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: colors?.neutral?.[600] || '#4b5563', display: 'flex', alignItems: 'center', padding: spacing?.sm || '8px', borderRadius: borderRadius?.md || '6px' }}>
            <MdArrowBack size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: borderRadius?.full || '9999px', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MdEdit size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: typography?.fontSize?.['2xl']?.size || '24px', fontWeight: typography?.fontWeight?.bold || 700, color: colors?.neutral?.[900] || '#111827', margin: 0, lineHeight: 1 }}>
                Modificar Paciente
              </h1>
              <p style={{ margin: 0, fontSize: typography?.fontSize?.xs?.size || '12px', color: colors?.neutral?.[500] || '#6b7280', marginTop: '2px' }}>ID: {id}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: spacing?.xl || '32px' }}>

        {/* Alertas */}
        {error && (
          <div style={{ padding: spacing?.md || '16px', marginBottom: spacing?.lg || '24px', backgroundColor: colors?.error?.light || '#fee2e2', border: `2px solid ${colors?.error?.main || '#dc2626'}`, color: colors?.error?.dark || '#991b1b', borderRadius: borderRadius?.lg || '8px', fontWeight: 600, fontSize: typography?.fontSize?.sm?.size || '14px', display: 'flex', alignItems: 'center', gap: spacing?.md || '16px' }}>
            <MdErrorOutline size={20} />{error}
          </div>
        )}
        {success && (
          <div style={{ padding: spacing?.md || '16px', marginBottom: spacing?.lg || '24px', backgroundColor: colors?.success?.light || '#d1fae5', border: `2px solid ${colors?.success?.main || '#10b981'}`, color: colors?.success?.dark || '#059669', borderRadius: borderRadius?.lg || '8px', fontWeight: 600, fontSize: typography?.fontSize?.sm?.size || '14px', display: 'flex', alignItems: 'center', gap: spacing?.md || '16px' }}>
            <MdCheck size={20} />{success}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: spacing?.lg || '24px', alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{ background: colors?.neutral?.[0] || '#fff', border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`, borderRadius: borderRadius?.xl || '12px', overflow: 'hidden', boxShadow: shadows?.sm, position: 'sticky', top: '90px' }}>
            {SECCIONES.map((sec, idx) => {
              const Icon = sec.icono;
              const isActive = activeSection === sec.id;
              return (
                <button key={sec.id} type="button" onClick={() => setActiveSection(sec.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: spacing?.md || '16px', padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`, background: isActive ? `${primaryColor}12` : 'transparent', border: 'none', borderLeft: isActive ? `3px solid ${primaryColor}` : '3px solid transparent', borderBottom: idx < SECCIONES.length - 1 ? `1px solid ${colors?.neutral?.[100] || '#f3f4f6'}` : 'none', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = colors?.neutral?.[50] || '#f9fafb'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon size={20} style={{ color: isActive ? primaryColor : colors?.neutral?.[400] || '#9ca3af', flexShrink: 0 }} />
                  <span style={{ fontSize: typography?.fontSize?.sm?.size || '14px', fontWeight: isActive ? 600 : 400, color: isActive ? primaryColor : colors?.neutral?.[600] || '#4b5563' }}>
                    {sec.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div style={{ background: colors?.neutral?.[0] || '#fff', border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`, borderRadius: borderRadius?.xl || '12px', padding: spacing?.xl || '32px', boxShadow: shadows?.md }}>

              {/* Sección Personal */}
              {activeSection === 'personal' && (
                <div>
                  <h3 style={secTitle}><MdPerson size={22} style={{ color: primaryColor }} />Información Personal</h3>
                  <div style={{ ...grid2, marginBottom: spacing?.lg || '24px' }}>
                    {[
                      { label: 'Nombre *', name: 'nombre', type: 'text', placeholder: 'Nombre del paciente' },
                      { label: 'Apellido *', name: 'apellido', type: 'text', placeholder: 'Apellido del paciente' },
                      { label: 'Cédula *', name: 'cedula', type: 'text', placeholder: '12345678' },
                      { label: 'Fecha de Nacimiento', name: 'fecha_nacimiento', type: 'date', placeholder: '' },
                      { label: 'Email', name: 'email', type: 'email', placeholder: 'paciente@email.com' },
                      { label: 'Teléfono', name: 'telefono', type: 'tel', placeholder: '0999999999' },
                      { label: 'Ciudad', name: 'ciudad', type: 'text', placeholder: 'Ciudad de residencia' },
                    ].map(field => (
                      <div key={field.name}>
                        <label style={lbl}>{field.label}</label>
                        <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder} style={inp} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    ))}

                    {/* Estado */}
                    <div>
                      <label style={lbl}>Estado</label>
                      <select name="estado" value={formData.estado} onChange={handleInputChange} style={{ ...inp, cursor: 'pointer' }} onFocus={onFocus} onBlur={onBlur}>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="archivado">Archivado</option>
                      </select>
                    </div>
                  </div>

                  {/* Dirección (full width) */}
                  <div>
                    <label style={lbl}>Dirección</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Dirección completa del paciente" style={inp} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
              )}

              {/* Sección Historial Médico */}
              {activeSection === 'medico' && (
                <div>
                  <h3 style={secTitle}><MdLocalHospital size={22} style={{ color: primaryColor }} />Historial Médico</h3>

                  {/* Grupo sanguíneo */}
                  <div style={{ marginBottom: spacing?.lg || '24px' }}>
                    <label style={{ ...lbl, marginBottom: spacing?.sm || '8px' }}>Grupo Sanguíneo</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing?.sm || '8px' }}>
                      {GRUPOS_SANGUINEOS.map(grupo => {
                        const isSelected = formData.grupo_sanguineo === grupo;
                        return (
                          <button key={grupo} type="button" onClick={() => { setFormData(prev => ({ ...prev, grupo_sanguineo: isSelected ? '' : grupo })); if (error) setError(''); }} style={{ padding: `${spacing?.sm || '8px'} ${spacing?.md || '16px'}`, background: isSelected ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` : colors?.neutral?.[50] || '#f9fafb', border: `2px solid ${isSelected ? primaryColor : colors?.neutral?.[200] || '#e5e7eb'}`, borderRadius: borderRadius?.full || '9999px', fontSize: typography?.fontSize?.sm?.size || '14px', fontWeight: isSelected ? 600 : 400, color: isSelected ? '#fff' : colors?.neutral?.[600] || '#4b5563', cursor: 'pointer', transition: '0.2s', minWidth: '52px' }}>
                            {grupo}
                          </button>
                        );
                      })}
                    </div>
                    {formData.grupo_sanguineo && (
                      <p style={{ marginTop: spacing?.xs || '4px', fontSize: typography?.fontSize?.xs?.size || '12px', color: primaryColor, fontWeight: 600 }}>
                        Seleccionado: {formData.grupo_sanguineo}
                      </p>
                    )}
                  </div>

                  {/* Campos de texto médico */}
                  {[
                    { label: 'Alergias', name: 'alergias', placeholder: 'Ej: Penicilina, mariscos, látex...' },
                    { label: 'Condiciones Médicas', name: 'condiciones_medicas', placeholder: 'Ej: Diabetes tipo 2, hipertensión...' },
                    { label: 'Medicamentos Actuales', name: 'medicamentos_actuales', placeholder: 'Ej: Metformina 500mg, Losartán 50mg...' },
                  ].map(field => (
                    <div key={field.name} style={{ marginBottom: spacing?.lg || '24px' }}>
                      <label style={lbl}>{field.label}</label>
                      <textarea
                        name={field.name} value={formData[field.name]}
                        onChange={handleInputChange} placeholder={field.placeholder}
                        rows={3}
                        style={{ ...inp, resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
                        onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Sección Emergencia */}
              {activeSection === 'emergencia' && (
                <div>
                  <h3 style={secTitle}><MdContactPhone size={22} style={{ color: primaryColor }} />Contacto de Emergencia</h3>

                  {/* Info card */}
                  <div style={{ padding: spacing?.md || '16px', background: `${primaryColor}08`, border: `1px solid ${primaryColor}30`, borderRadius: borderRadius?.lg || '8px', marginBottom: spacing?.xl || '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px' }}>
                      <MdPhone size={16} style={{ color: primaryColor }} />
                      <span style={{ fontSize: typography?.fontSize?.sm?.size || '14px', color: primaryColor, fontWeight: 600 }}>
                        Persona a contactar en caso de emergencia médica
                      </span>
                    </div>
                  </div>

                  <div style={grid2}>
                    {[
                      { label: 'Nombre del Contacto', name: 'contacto_emergencia_nombre', type: 'text', placeholder: 'Nombre completo' },
                      { label: 'Teléfono del Contacto', name: 'contacto_emergencia_telefono', type: 'tel', placeholder: '0999999999' },
                      { label: 'Relación con el Paciente', name: 'contacto_emergencia_relacion', type: 'text', placeholder: 'Ej: Esposa, Padre, Hijo...' },
                    ].map(field => (
                      <div key={field.name}>
                        <label style={lbl}>{field.label}</label>
                        <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder} style={inp} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección Seguro */}
              {activeSection === 'seguro' && (
                <div>
                  <h3 style={secTitle}><MdFavorite size={22} style={{ color: primaryColor }} />Información del Seguro</h3>

                  <div style={{ padding: spacing?.md || '16px', background: `${primaryColor}08`, border: `1px solid ${primaryColor}30`, borderRadius: borderRadius?.lg || '8px', marginBottom: spacing?.xl || '32px' }}>
                    <span style={{ fontSize: typography?.fontSize?.sm?.size || '14px', color: primaryColor, fontWeight: 600 }}>
                      Estos campos son opcionales
                    </span>
                  </div>

                  <div style={grid2}>
                    {[
                      { label: 'Seguro Médico', name: 'seguro_medico', type: 'text', placeholder: 'Ej: IESS, Salud S.A., MetLife...' },
                      { label: 'Número de Póliza', name: 'numero_poliza', type: 'text', placeholder: 'Número de póliza o afiliación' },
                    ].map(field => (
                      <div key={field.name}>
                        <label style={lbl}>{field.label}</label>
                        <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleInputChange} placeholder={field.placeholder} style={inp} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing?.md || '16px', marginTop: spacing?.['2xl'] || '48px', paddingTop: spacing?.lg || '24px', borderTop: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}` }}>
                <button type="button" onClick={() => navigate(-1)} style={{ padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`, background: colors?.neutral?.[100] || '#f3f4f6', color: colors?.neutral?.[700] || '#374151', border: `1px solid ${colors?.neutral?.[200] || '#e5e7eb'}`, borderRadius: borderRadius?.md || '6px', fontWeight: 600, fontSize: typography?.fontSize?.sm?.size || '14px', cursor: 'pointer', transition: '0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = colors?.neutral?.[200] || '#e5e7eb'}
                  onMouseLeave={e => e.currentTarget.style.background = colors?.neutral?.[100] || '#f3f4f6'}
                >
                  Cancelar
                </button>

                <button type="submit" disabled={loading} style={{ padding: `${spacing?.md || '16px'} ${spacing?.lg || '24px'}`, background: loading ? colors?.neutral?.[300] || '#d1d5db' : `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, color: '#fff', border: 'none', borderRadius: borderRadius?.md || '6px', fontWeight: 600, fontSize: typography?.fontSize?.sm?.size || '14px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: spacing?.sm || '8px', transition: '0.2s' }}
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
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PacienteMd;