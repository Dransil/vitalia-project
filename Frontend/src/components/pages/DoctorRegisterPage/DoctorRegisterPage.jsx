// src/components/pages/DoctorRegisterPage/DoctorRegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdWork, MdSchedule, MdSecurity } from 'react-icons/md';
import FormPageTemplate from '../../templates/FormPageTemplate/FormPageTemplate';
import WizardProgress from '../../molecules/WizardProgress/WizardProgress';
import WizardNavigation from '../../molecules/WizardNavigation/WizardNavigation';
import PersonalInfoStep from '../../organisms/PersonalInfoStep/PersonalInfoStep';
import ProfessionalInfoStep from '../../organisms/ProfessionalInfoStep/ProfessionalInfoStep';
import ScheduleStep from '../../organisms/ScheduleStep/ScheduleStep';
import CredentialsStep from '../../organisms/CredentialsStep/CredentialsStep';
import * as especialidadesService from '../../../Services/especialidadesService';
import * as consultoriosService from '../../../Services/Consultorioservice';
import usuarioService from '../../../Services/usuarioService';

const pasos = [
  { titulo: 'Informacion Personal', icono: MdPerson },
  { titulo: 'Informacion Profesional', icono: MdWork },
  { titulo: 'Horario de Atencion', icono: MdSchedule },
  { titulo: 'Credenciales de Acceso', icono: MdSecurity },
];

const HORARIOS_DEFAULT = [
  { id_horario: 1, nombre: 'Manana', horario_inicio: '08:00:00', horario_fin: '12:00:00' },
  { id_horario: 2, nombre: 'Tarde', horario_inicio: '14:00:00', horario_fin: '18:00:00' },
  { id_horario: 3, nombre: 'Completo', horario_inicio: '08:00:00', horario_fin: '18:00:00' },
];

const DoctorRegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [horarios] = useState(HORARIOS_DEFAULT);
  const [especialidades, setEspecialidades] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    id_especialidad: '',
    id_consultorio: '',
    id_horario: '',
    contraseña: '',
    confirmarContraseña: '',
    dias_atencion: [],
  });

  const [passwordValidation, setPasswordValidation] = useState({
    mayuscula: false,
    minuscula: false,
    numero: false,
    caracterEspecial: false,
    minimo8: false,
  });

  useEffect(() => {
    const loadCatalogos = async () => {
      setLoadingData(true);
      setError('');
      try {
        const espRes = await especialidadesService.getEspecialidades();
        if (espRes?.ok && Array.isArray(espRes.data)) {
          setEspecialidades(espRes.data.filter(e => e && (e.estado === 'activa' || e.estado === 'activo')));
        } else {
          setEspecialidades([]);
        }

        const consRes = await consultoriosService.getConsultorios();
        if (consRes?.ok && Array.isArray(consRes.data)) {
          setConsultorios(consRes.data.filter(c => c && (c.estado === 'activo' || c.estado === 'activa')));
        } else {
          setConsultorios([]);
        }
      } catch (err) {
        setError('Error al cargar los datos necesarios. Por favor, recargue la pagina.');
      } finally {
        setLoadingData(false);
      }
    };
    loadCatalogos();
  }, []);

  const validatePassword = (p) => ({
    mayuscula: /[A-Z]/.test(p),
    minuscula: /[a-z]/.test(p),
    numero: /[0-9]/.test(p),
    caracterEspecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
    minimo8: p?.length >= 8,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'contraseña') {
      setPasswordValidation(validatePassword(value));
    }
    if (error) setError('');
  };

  const handleDayToggle = (diaId) => {
    setFormData((prev) => ({
      ...prev,
      dias_atencion: prev.dias_atencion.includes(diaId)
        ? prev.dias_atencion.filter((d) => d !== diaId)
        : [...prev.dias_atencion, diaId],
    }));
    if (error) setError('');
  };

  const validarPasoActual = () => {
    if (currentStep === 0) {
      if (!formData.nombre?.trim()) {
        setError('El nombre es requerido');
        return false;
      }
      if (!formData.apellido?.trim()) {
        setError('El apellido es requerido');
        return false;
      }
      if (!formData.email?.trim()) {
        setError('El email es requerido');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Email no valido');
        return false;
      }
      if (!formData.cedula?.trim()) {
        setError('La cedula es requerida');
        return false;
      }
      if (!formData.telefono?.trim()) {
        setError('El telefono es requerido');
        return false;
      }
      if (!/^[0-9\-\+\(\)\s]{7,}$/.test(formData.telefono)) {
        setError('Telefono no valido');
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
        setError('Seleccione un horario de atencion');
        return false;
      }
      if (formData.dias_atencion.length === 0) {
        setError('Seleccione al menos un dia de atencion');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.contraseña) {
        setError('La contraseña es requerida');
        return false;
      }
      if (
        !passwordValidation.mayuscula ||
        !passwordValidation.minuscula ||
        !passwordValidation.numero ||
        !passwordValidation.caracterEspecial ||
        !passwordValidation.minimo8
      ) {
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
      setCurrentStep((s) => s + 1);
    }
  };

  const pasoAnterior = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setError('');
    }
  };

  const isFormValid = () => {
    return (
      formData.nombre &&
      formData.apellido &&
      formData.email &&
      formData.cedula &&
      formData.telefono &&
      formData.id_especialidad &&
      formData.id_consultorio &&
      formData.id_horario &&
      formData.dias_atencion.length > 0 &&
      formData.contraseña &&
      formData.contraseña === formData.confirmarContraseña &&
      passwordValidation.mayuscula &&
      passwordValidation.minuscula &&
      passwordValidation.numero &&
      passwordValidation.caracterEspecial &&
      passwordValidation.minimo8
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarPasoActual()) return;

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
        contraseña_hash: formData.contraseña,
        id_especialidad: parseInt(formData.id_especialidad),
        id_consultorio: parseInt(formData.id_consultorio),
        horario_id: parseInt(formData.id_horario),
        dias_atencion: formData.dias_atencion.join(','),
        rol: 'medico',
        estado: 'activo',
      };

      const response = await usuarioService.crearDoctor(dataToSend);

      if (response?.ok) {
        setSuccess(response.msg || 'Doctor creado exitosamente');
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
          <p style={{ marginTop: '24px' }}>Cargando datos...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <FormPageTemplate
      title="Crear Nuevo Doctor"
      onBack={() => navigate('/Doctor_Dashboard')}
      error={error}
      success={success}
    >
      <WizardProgress
        currentStep={currentStep}
        totalSteps={pasos.length}
        steps={pasos}
        currentIcon={pasos[currentStep]?.icono}
      />

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          }}
        >
          {currentStep === 0 && (
            <PersonalInfoStep formData={formData} onChange={handleInputChange} />
          )}

          {currentStep === 1 && (
            <ProfessionalInfoStep
              formData={formData}
              onChange={handleInputChange}
              especialidades={especialidades}
              consultorios={consultorios}
            />
          )}

          {currentStep === 2 && (
            <ScheduleStep
              formData={formData}
              onChange={handleInputChange}
              onDayToggle={handleDayToggle}
              horarios={horarios}
            />
          )}

          {currentStep === 3 && (
            <CredentialsStep
              formData={formData}
              onChange={handleInputChange}
              passwordValidation={passwordValidation}
            />
          )}

          <WizardNavigation
            currentStep={currentStep}
            totalSteps={pasos.length}
            onPrevious={pasoAnterior}
            onNext={siguientePaso}
            onSubmit={handleSubmit}
            isSubmitting={loading}
            isLastStep={currentStep === pasos.length - 1}
            isFormValid={isFormValid()}
          />
        </div>
      </form>
    </FormPageTemplate>
  );
};

export default DoctorRegisterPage;