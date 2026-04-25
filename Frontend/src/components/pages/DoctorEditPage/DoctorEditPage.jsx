// src/components/pages/DoctorEditPage/DoctorEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdPerson, MdWork, MdSchedule, MdSecurity } from 'react-icons/md';
import FormPageTemplate from '../../templates/FormPageTemplate/FormPageTemplate';
import DoctorFormSidebar from '../../organisms/DoctorFormSidebar/DoctorFormSidebar';
import PersonalInfoForm from '../../organisms/PersonalInfoForm/PersonalInfoForm';
import ProfessionalInfoForm from '../../organisms/ProfessionalInfoForm/ProfessionalInfoForm';
import ScheduleForm from '../../organisms/ScheduleForm/ScheduleForm';
import CredentialsForm from '../../organisms/CredentialsForm/CredentialsForm';
import Button from '../../atoms/Button/Button';
import { MdCheck } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';
import * as especialidadesService from '../../../Services/especialidadesService';
import * as consultoriosService from '../../../Services/Consultorioservice';
import usuarioService from '../../../Services/usuarioService';

const HORARIOS_DEFAULT = [
  { id_horario: 1, nombre: 'Manana', horario_inicio: '08:00:00', horario_fin: '12:00:00' },
  { id_horario: 2, nombre: 'Tarde', horario_inicio: '14:00:00', horario_fin: '18:00:00' },
  { id_horario: 3, nombre: 'Completo', horario_inicio: '08:00:00', horario_fin: '18:00:00' },
];

// Corregido: los iconos ahora son los componentes importados, no null
const secciones = [
  { id: 'personal', label: 'Personal', icono: MdPerson },
  { id: 'profesional', label: 'Profesional', icono: MdWork },
  { id: 'horario', label: 'Horario', icono: MdSchedule },
  { id: 'credenciales', label: 'Credenciales', icono: MdSecurity },
];

const toStr = (v) => (v !== null && v !== undefined && v !== '') ? String(v) : '';

const DoctorEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { spacing } = useTheme();

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('personal');

  const [horarios] = useState(HORARIOS_DEFAULT);
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);

  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    mayuscula: false,
    minuscula: false,
    numero: false,
    caracterEspecial: false,
    minimo8: false,
  });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    id_especialidad: '',
    id_consultorio: '',
    id_horario: '',
    dias_atencion: [],
    estado: 'activo',
    nueva_contraseña: '',
    confirmar_contraseña: '',
  });

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', xl: '32px', md: '16px', '2xl': '48px' };
    return fallbacks[space] || '24px';
  };

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
        const cedula = toStr(doc.cedula);
        const id_horario = toStr(doc.horario_id || doc.Horario?.id_horario);

        const asig = Array.isArray(doc.asignaciones) && doc.asignaciones.length > 0
          ? doc.asignaciones[0]
          : null;

        const id_especialidad = toStr(asig?.id_especialidad || asig?.Especialidad?.id_especialidad);
        const id_consultorio = toStr(asig?.id_consultorio || asig?.Consultorio?.id_consultorio);

        let diasArray = [];
        if (Array.isArray(doc.dias_atencion)) {
          diasArray = doc.dias_atencion;
        } else if (typeof doc.dias_atencion === 'string' && doc.dias_atencion.trim()) {
          diasArray = doc.dias_atencion.split(',').map(d => d.trim()).filter(Boolean);
        }

        setFormData({
          nombre: doc.nombre || '',
          apellido: doc.apellido || '',
          email: doc.email || '',
          cedula,
          telefono: doc.telefono || '',
          id_especialidad,
          id_consultorio,
          id_horario,
          dias_atencion: diasArray,
          estado: doc.estado || 'activo',
          nueva_contraseña: '',
          confirmar_contraseña: '',
        });
      } catch (err) {
        setError('Error al cargar los datos. Por favor, recargue la pagina.');
      } finally {
        setLoadingData(false);
      }
    };

    loadAll();
  }, [id]);

  const validatePassword = (p) => ({
    mayuscula: /[A-Z]/.test(p),
    minuscula: /[a-z]/.test(p),
    numero: /[0-9]/.test(p),
    caracterEspecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
    minimo8: p?.length >= 8,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'nueva_contraseña') {
      setPasswordValidation(validatePassword(value));
    }
    if (error) setError('');
  };

  const handleDayToggle = (diaId) => {
    setFormData(prev => ({
      ...prev,
      dias_atencion: prev.dias_atencion.includes(diaId)
        ? prev.dias_atencion.filter(d => d !== diaId)
        : [...prev.dias_atencion, diaId]
    }));
    if (error) setError('');
  };

  const handleToggleCambiarPassword = () => {
    setCambiarPassword(!cambiarPassword);
    setFormData(prev => ({ ...prev, nueva_contraseña: '', confirmar_contraseña: '' }));
    setPasswordValidation({ mayuscula: false, minuscula: false, numero: false, caracterEspecial: false, minimo8: false });
  };

  const validarFormulario = () => {
    if (!formData.nombre?.trim()) { setError('El nombre es requerido'); return false; }
    if (!formData.apellido?.trim()) { setError('El apellido es requerido'); return false; }
    if (!formData.email?.trim()) { setError('El email es requerido'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Email no valido'); return false; }
    if (!formData.cedula?.trim()) { setError('La cedula es requerida'); return false; }
    if (!formData.telefono?.trim()) { setError('El telefono es requerido'); return false; }
    if (!formData.id_especialidad) { setError('Seleccione una especialidad'); return false; }
    if (!formData.id_consultorio) { setError('Seleccione un consultorio'); return false; }
    if (!formData.id_horario) { setError('Seleccione un horario'); return false; }
    if (formData.dias_atencion.length === 0) { setError('Seleccione al menos un dia'); return false; }

    if (cambiarPassword) {
      if (!formData.nueva_contraseña) { setError('Ingrese la nueva contraseña'); return false; }
      const pv = validatePassword(formData.nueva_contraseña);
      if (!pv.mayuscula || !pv.minuscula || !pv.numero || !pv.caracterEspecial || !pv.minimo8) {
        setError('La contraseña no cumple los requisitos');
        return false;
      }
      if (formData.nueva_contraseña !== formData.confirmar_contraseña) {
        setError('Las contraseñas no coinciden');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const dataToSend = {
        nombre: formData.nombre?.trim(),
        apellido: formData.apellido?.trim(),
        email: formData.email?.trim(),
        cedula: formData.cedula?.trim(),
        telefono: formData.telefono?.trim(),
        id_especialidad: parseInt(formData.id_especialidad),
        id_consultorio: parseInt(formData.id_consultorio),
        horario_id: parseInt(formData.id_horario),
        dias_atencion: formData.dias_atencion.join(','),
        estado: formData.estado,
      };

      if (cambiarPassword && formData.nueva_contraseña) {
        dataToSend.contraseña_hash = formData.nueva_contraseña;
      }

      const response = await usuarioService.actualizarUsuario(id, dataToSend);

      if (response?.ok) {
        setSuccess(response.msg || 'Doctor actualizado exitosamente');
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

  const confirmPasswordError = formData.confirmar_contraseña &&
    formData.nueva_contraseña !== formData.confirmar_contraseña;

  if (loadingData) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #3B82F6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }}
          />
          <p style={{ marginTop: '24px' }}>Cargando datos del doctor...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <FormPageTemplate
      title="Modificar Doctor"
      subtitle={`ID: ${id}`}
      onBack={() => navigate('/Doctor_Dashboard')}
      error={error}
      success={success}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: getSpacing('lg'),
          alignItems: 'start',
        }}
      >
        <DoctorFormSidebar
          sections={secciones}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: getSpacing('xl'),
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
          >
            {activeSection === 'personal' && (
              <PersonalInfoForm formData={formData} onChange={handleInputChange} />
            )}

            {activeSection === 'profesional' && (
              <ProfessionalInfoForm
                formData={formData}
                onChange={handleInputChange}
                especialidades={especialidades}
                consultorios={consultorios}
              />
            )}

            {activeSection === 'horario' && (
              <ScheduleForm
                formData={formData}
                onChange={handleInputChange}
                onDayToggle={handleDayToggle}
                horarios={horarios}
              />
            )}

            {activeSection === 'credenciales' && (
              <CredentialsForm
                cambiarPassword={cambiarPassword}
                onToggleCambiarPassword={handleToggleCambiarPassword}
                formData={formData}
                onChange={handleInputChange}
                passwordValidation={passwordValidation}
                confirmPasswordError={confirmPasswordError}
              />
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: getSpacing('md'),
                marginTop: getSpacing('2xl'),
                paddingTop: getSpacing('lg'),
                borderTop: `1px solid #E5E7EB`,
              }}
            >
              <Button variant="secondary" onClick={() => navigate('/Doctor_Dashboard')}>
                Cancelar
              </Button>

              <Button type="submit" disabled={loading} icon={MdCheck}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </FormPageTemplate>
  );
};

export default DoctorEditPage;