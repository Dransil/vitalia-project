import React, { useState } from 'react';
import { useTheme } from '../../../Config/ThemeContext';
import { 
  MdArrowBack, 
  MdVisibility, 
  MdVisibilityOff,
  MdCheck,
  MdClose,
  MdErrorOutline
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import api from '../../../Services/Api';

const RegisterDct = ({ onBack }) => {
  const { config, colors, spacing, typography, borderRadius, shadows } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cedula: '',
    telefono: '',
    especialidad: '',
    consultorio: '',
    contraseña: '',
    confirmarContraseña: '',
  });

  const [passwordValidation, setPasswordValidation] = useState({
    mayuscula: false,
    minuscula: false,
    numero: false,
    caracterEspecial: false,
    minimo8: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validar contraseña
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

    // Validar contraseña si es el campo password
    if (name === 'contraseña') {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleback = () => {
    navigate('/Doctor_Dashboard');
  };

  // Validar que todos los campos requeridos estén completos
  const validateAllFields = () => {
    const requiredFields = [
      'nombre',
      'apellido',
      'email',
      'telefono',
      'cedula',
      'especialidad',
      'consultorio',
      'contraseña',
      'confirmarContraseña',
    ];

    // Verificar campos requeridos
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        return false;
      }
    }

    // Validar contraseña
    if (!passwordValidation.mayuscula || !passwordValidation.minuscula || 
        !passwordValidation.numero || !passwordValidation.caracterEspecial || 
        !passwordValidation.minimo8) {
      return false;
    }

    // Validar que las contraseñas coincidan
    if (formData.contraseña !== formData.confirmarContraseña) {
      return false;
    }

    return true;
  };

  // Validación individual de campos
  const isFieldValid = (fieldName) => {
    const value = formData[fieldName];
    return value && value.trim() !== '';
  };

  // Validación de emails
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de teléfono
  const isPhoneValid = (phone) => {
    const phoneRegex = /^[0-9\-\+\(\)\s]{7,}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!validateAllFields()) {
        setError('Por favor completa todos los campos requeridos y verifica la contraseña');
        setLoading(false);
        return;
      }

      if (formData.contraseña !== formData.confirmarContraseña) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      // Preparar datos para enviar - Sin usuario, sin null
      const dataToSend = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        cedula: formData.cedula.trim(),
        telefono: formData.telefono.trim(),
        contraseña_hash: formData.contraseña,
        id_especialidad: formData.especialidad,
        id_consultorio: formData.consultorio,
        rol: 'doctor',
        estado: 'activo',
      };

      // Realizar petición POST
      const response = await api.post('/usuarios', dataToSend, true);

      if (response.ok) {
        setSuccess('Usuario creado exitosamente');
        setTimeout(() => {
          navigate('/Doctor_Dashboard');
        }, 1500);
      } else {
        setError(response.msg || 'Error al crear el usuario');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = validateAllFields();

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
            onClick={handleback}
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
        {/* Mensajes de Error/Éxito */}
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

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: colors.neutral[0],
              border: `1px solid ${colors.neutral[200]}`,
              borderRadius: borderRadius.xl,
              padding: spacing.lg,
              boxShadow: shadows.md,
            }}
          >
            {/* Sección Información Personal */}
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
              Información Personal
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.lg,
                marginBottom: spacing['2xl'],
              }}
            >
              {/* Nombre */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Juan"
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${
                      isFieldValid('nombre') ? colors.success.main : colors.neutral[200]
                    }`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: '0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  onBlur={e =>
                    e.target.style.borderColor = isFieldValid('nombre')
                      ? colors.success.main
                      : colors.neutral[200]
                  }
                />
              </div>

              {/* Apellido */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="García"
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${
                      isFieldValid('apellido') ? colors.success.main : colors.neutral[200]
                    }`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: '0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  onBlur={e =>
                    e.target.style.borderColor = isFieldValid('apellido')
                      ? colors.success.main
                      : colors.neutral[200]
                  }
                />
              </div>

              {/* Email (Login) */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Email (Login) *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="juan@ejemplo.com"
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${
                      isFieldValid('email') && isEmailValid(formData.email)
                        ? colors.success.main
                        : colors.neutral[200]
                    }`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: '0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  onBlur={e =>
                    e.target.style.borderColor =
                      isFieldValid('email') && isEmailValid(formData.email)
                        ? colors.success.main
                        : colors.neutral[200]
                  }
                />
                {formData.email && !isEmailValid(formData.email) && (
                  <p style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size, margin: spacing.sm }}>
                    Email no válido
                  </p>
                )}
              </div>

              {/* Cédula */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Cédula *
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  placeholder="1234567"
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${
                      isFieldValid('cedula') ? colors.success.main : colors.neutral[200]
                    }`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: '0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  onBlur={e =>
                    e.target.style.borderColor = isFieldValid('cedula')
                      ? colors.success.main
                      : colors.neutral[200]
                  }
                />
              </div>

              {/* Teléfono */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+591 4 1234567"
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${
                      isFieldValid('telefono') && isPhoneValid(formData.telefono)
                        ? colors.success.main
                        : colors.neutral[200]
                    }`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: '0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  onBlur={e =>
                    e.target.style.borderColor =
                      isFieldValid('telefono') && isPhoneValid(formData.telefono)
                        ? colors.success.main
                        : colors.neutral[200]
                  }
                />
                {formData.telefono && !isPhoneValid(formData.telefono) && (
                  <p style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size, margin: spacing.sm }}>
                    Teléfono no válido
                  </p>
                )}
              </div>
            </div>

            {/* Sección Información Profesional */}
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
              Información Profesional
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.lg,
                marginBottom: spacing['2xl'],
              }}
            >
              {/* Especialidad */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Horario *
                </label>
                <select
                  name="Horario"
                  value={formData.Horario}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${
                      isFieldValid('Horario') ? colors.success.main : colors.neutral[200]
                    }`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: colors.neutral[0],
                    cursor: 'pointer',
                    transition: '0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  onBlur={e =>
                    e.target.style.borderColor = isFieldValid('Horario')
                      ? colors.success.main
                      : colors.neutral[200]
                  }
                >
                  <option value="">Selecciona un horario</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
                   <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Especialidad *
                </label>
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${
                      isFieldValid('especialidad') ? colors.success.main : colors.neutral[200]
                    }`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: colors.neutral[0],
                    cursor: 'pointer',
                    transition: '0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  onBlur={e =>
                    e.target.style.borderColor = isFieldValid('especialidad')
                      ? colors.success.main
                      : colors.neutral[200]
                  }
                >
                  <option value="">Selecciona una especialidad</option>
                  <option value="1">Cardiología</option>
                  <option value="2">Dermatología</option>
                  <option value="3">Oftalmología</option>
                  <option value="4">Pediatría</option>
                </select>
              </div>
              {/* Consultorio */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Consultorio *
                </label>
                <select
                  name="consultorio"
                  value={formData.consultorio}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: spacing.md,
                    border: `2px solid ${
                      isFieldValid('consultorio') ? colors.success.main : colors.neutral[200]
                    }`,
                    borderRadius: borderRadius.md,
                    fontSize: typography.fontSize.sm.size,
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: colors.neutral[0],
                    cursor: 'pointer',
                    transition: '0.3s',
                  }}
                  onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                  onBlur={e =>
                    e.target.style.borderColor = isFieldValid('consultorio')
                      ? colors.success.main
                      : colors.neutral[200]
                  }
                >
                  <option value="">Selecciona un consultorio</option>
                  <option value="1">Consultorio A</option>
                  <option value="2">Consultorio B</option>
                  <option value="3">Consultorio C</option>
                </select>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                borderTop: `2px solid ${colors.neutral[200]}`,
                margin: `${spacing.lg} 0`,
              }}
            />

            {/* Sección Credenciales de Acceso */}
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
                marginBottom: spacing['2xl'],
              }}
            >
              {/* Contraseña */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Contraseña *
                </label>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="contraseña"
                    value={formData.contraseña}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: `${spacing.md} ${spacing.lg} ${spacing.md} ${spacing.md}`,
                      border: `2px solid ${colors.neutral[200]}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: '0.3s',
                      paddingRight: '40px',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e => e.target.style.borderColor = colors.neutral[200]}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: spacing.md,
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

              {/* Confirmar Contraseña */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm.size,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.neutral[900],
                    marginBottom: spacing.sm,
                  }}
                >
                  Confirmar Contraseña *
                </label>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmarContraseña"
                    value={formData.confirmarContraseña}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: `${spacing.md} ${spacing.lg} ${spacing.md} ${spacing.md}`,
                      border: `2px solid ${
                        formData.contraseña && formData.confirmarContraseña === formData.contraseña
                          ? colors.success.main
                          : formData.confirmarContraseña
                          ? colors.error.main
                          : colors.neutral[200]
                      }`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.sm.size,
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: '0.3s',
                      paddingRight: '40px',
                    }}
                    onFocus={e => e.target.style.borderColor = config.theme.colors.primary}
                    onBlur={e =>
                      e.target.style.borderColor =
                        formData.contraseña && formData.confirmarContraseña === formData.contraseña
                          ? colors.success.main
                          : formData.confirmarContraseña
                          ? colors.error.main
                          : colors.neutral[200]
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: spacing.md,
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
                  <p style={{ color: colors.error.main, fontSize: typography.fontSize.xs.size, margin: spacing.sm }}>
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
                  marginBottom: spacing['2xl'],
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
                  {/* Mayúscula */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    {passwordValidation.mayuscula ? (
                      <MdCheck size={20} style={{ color: colors.success.main }} />
                    ) : (
                      <MdClose size={20} style={{ color: colors.error.main }} />
                    )}
                    <span
                      style={{
                        fontSize: typography.fontSize.xs.size,
                        color: passwordValidation.mayuscula ? colors.success.main : colors.neutral[600],
                      }}
                    >
                      Una letra mayúscula (A-Z)
                    </span>
                  </div>

                  {/* Minúscula */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    {passwordValidation.minuscula ? (
                      <MdCheck size={20} style={{ color: colors.success.main }} />
                    ) : (
                      <MdClose size={20} style={{ color: colors.error.main }} />
                    )}
                    <span
                      style={{
                        fontSize: typography.fontSize.xs.size,
                        color: passwordValidation.minuscula ? colors.success.main : colors.neutral[600],
                      }}
                    >
                      Una letra minúscula (a-z)
                    </span>
                  </div>

                  {/* Número */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    {passwordValidation.numero ? (
                      <MdCheck size={20} style={{ color: colors.success.main }} />
                    ) : (
                      <MdClose size={20} style={{ color: colors.error.main }} />
                    )}
                    <span
                      style={{
                        fontSize: typography.fontSize.xs.size,
                        color: passwordValidation.numero ? colors.success.main : colors.neutral[600],
                      }}
                    >
                      Un número (0-9)
                    </span>
                  </div>

                  {/* Carácter Especial */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    {passwordValidation.caracterEspecial ? (
                      <MdCheck size={20} style={{ color: colors.success.main }} />
                    ) : (
                      <MdClose size={20} style={{ color: colors.error.main }} />
                    )}
                    <span
                      style={{
                        fontSize: typography.fontSize.xs.size,
                        color: passwordValidation.caracterEspecial ? colors.success.main : colors.neutral[600],
                      }}
                    >
                      Un carácter especial (!@#$%^&*)
                    </span>
                  </div>

                  {/* Mínimo 8 caracteres */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    {passwordValidation.minimo8 ? (
                      <MdCheck size={20} style={{ color: colors.success.main }} />
                    ) : (
                      <MdClose size={20} style={{ color: colors.error.main }} />
                    )}
                    <span
                      style={{
                        fontSize: typography.fontSize.xs.size,
                        color: passwordValidation.minimo8 ? colors.success.main : colors.neutral[600],
                      }}
                    >
                      Mínimo 8 caracteres
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div
              style={{
                display: 'flex',
                gap: spacing.md,
                paddingTop: spacing.lg,
                borderTop: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <button
                type="button"
                onClick={handleback}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  background: colors.neutral[200],
                  color: colors.neutral[900],
                  border: 'none',
                  borderRadius: borderRadius.md,
                  fontWeight: typography.fontWeight.semibold,
                  cursor: 'pointer',
                  transition: '0.3s',
                  fontSize: typography.fontSize.sm.size,
                }}
                onMouseEnter={e => e.target.style.background = colors.neutral[300]}
                onMouseLeave={e => e.target.style.background = colors.neutral[200]}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={!isFormValid || loading}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  background: isFormValid
                    ? `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`
                    : colors.neutral[300],
                  color: colors.neutral[0],
                  border: 'none',
                  borderRadius: borderRadius.md,
                  fontWeight: typography.fontWeight.semibold,
                  cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
                  transition: '0.3s',
                  opacity: isFormValid ? 1 : 0.6,
                  fontSize: typography.fontSize.sm.size,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm,
                }}
                onMouseEnter={e => isFormValid && !loading && (e.target.style.opacity = '0.9')}
                onMouseLeave={e => isFormValid && !loading && (e.target.style.opacity = '1')}
              >
                {loading ? 'Guardando...' : 'Crear Doctor'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterDct;