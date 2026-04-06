import React, { useState } from 'react';
import { useTheme } from '../../Config/ThemeContext';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdPerson } from 'react-icons/md';
import VitaliaIcon from '../../assets/Vitalia_Icon.png';

const RegisterLg = () => {
  const { config, colors, spacing, typography, borderRadius } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Register attempt:', formData);
    }, 1500);
  };

  const backgroundColor = config.theme.background || colors.primary[50];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: colors.neutral[0],
      }}
    >
      {/* Lado Izquierdo - Formulario */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing['3xl'],
          background: colors.neutral[0],
        }}
      >
        <div style={{ maxWidth: '400px', width: '100%' }}>
          {/* Encabezado */}
          <div style={{ marginBottom: spacing['2xl'] }}>
            <h1
              style={{
                fontSize: typography.fontSize['2xl'].size,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
                margin: 0,
                marginBottom: spacing.sm,
              }}
            >
              Crear Cuenta
            </h1>
            <p
              style={{
                fontSize: typography.fontSize.sm.size,
                color: colors.neutral[500],
                margin: 0,
              }}
            >
              Únete a Vitalia hoy
            </p>
          </div>

          {/* Mensaje de error */}
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
              }}
            >
              {error}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
            {/* Nombre Completo */}
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
                Nombre Completo
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: colors.neutral[50],
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  transition: `border-color ${spacing.lg}`,
                }}
              >
                <MdPerson
                  size={20}
                  style={{
                    position: 'absolute',
                    left: spacing.md,
                    color: colors.neutral[400],
                  }}
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Juan García López"
                  style={{
                    flex: 1,
                    padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing['2xl']}`,
                    border: 'none',
                    background: 'transparent',
                    fontSize: typography.fontSize.sm.size,
                    color: colors.neutral[900],
                    outline: 'none',
                  }}
                  onFocus={e => e.target.parentElement.style.borderColor = config.theme.colors.primary}
                  onBlur={e => e.target.parentElement.style.borderColor = colors.neutral[200]}
                />
              </div>
            </div>

            {/* Email */}
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
                Correo Electrónico
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: colors.neutral[50],
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                  transition: `border-color ${spacing.lg}`,
                }}
              >
                <MdEmail
                  size={20}
                  style={{
                    position: 'absolute',
                    left: spacing.md,
                    color: colors.neutral[400],
                  }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  style={{
                    flex: 1,
                    padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing['2xl']}`,
                    border: 'none',
                    background: 'transparent',
                    fontSize: typography.fontSize.sm.size,
                    color: colors.neutral[900],
                    outline: 'none',
                  }}
                  onFocus={e => e.target.parentElement.style.borderColor = config.theme.colors.primary}
                  onBlur={e => e.target.parentElement.style.borderColor = colors.neutral[200]}
                />
              </div>
            </div>

            {/* Password */}
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
                Contraseña
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: colors.neutral[50],
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                }}
              >
                <MdLock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: spacing.md,
                    color: colors.neutral[400],
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    flex: 1,
                    padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing['2xl']}`,
                    border: 'none',
                    background: 'transparent',
                    fontSize: typography.fontSize.sm.size,
                    color: colors.neutral[900],
                    outline: 'none',
                  }}
                  onFocus={e => e.target.parentElement.style.borderColor = config.theme.colors.primary}
                  onBlur={e => e.target.parentElement.style.borderColor = colors.neutral[200]}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: spacing.md,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.neutral[400],
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            {/* Confirmar Password */}
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
                Confirmar Contraseña
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: colors.neutral[50],
                  border: `2px solid ${colors.neutral[200]}`,
                  borderRadius: borderRadius.md,
                }}
              >
                <MdLock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: spacing.md,
                    color: colors.neutral[400],
                  }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    flex: 1,
                    padding: `${spacing.md} ${spacing.md} ${spacing.md} ${spacing['2xl']}`,
                    border: 'none',
                    background: 'transparent',
                    fontSize: typography.fontSize.sm.size,
                    color: colors.neutral[900],
                    outline: 'none',
                  }}
                  onFocus={e => e.target.parentElement.style.borderColor = config.theme.colors.primary}
                  onBlur={e => e.target.parentElement.style.borderColor = colors.neutral[200]}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: spacing.md,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: colors.neutral[400],
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            {/* Términos y condiciones */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: spacing.sm,
                cursor: 'pointer',
                fontSize: typography.fontSize.sm.size,
              }}
            >
              <input
                type="checkbox"
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  marginTop: '4px',
                  flexShrink: 0,
                }}
              />
              <span style={{ color: colors.neutral[600] }}>
                Acepto los{' '}
                <a
                  href="#"
                  style={{
                    color: config.theme.colors.primary,
                    textDecoration: 'none',
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  términos y condiciones
                </a>
              </span>
            </label>

            {/* Botón Register */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: spacing.md,
                background: `linear-gradient(to right, ${config.theme.colors.primary}, ${config.theme.colors.secondary})`,
                color: colors.neutral[0],
                border: 'none',
                borderRadius: borderRadius.md,
                fontWeight: typography.fontWeight.semibold,
                fontSize: typography.fontSize.sm.size,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.3s',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => !loading && (e.target.style.opacity = '0.9')}
              onMouseLeave={e => !loading && (e.target.style.opacity = '1')}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Login */}
          <div
            style={{
              marginTop: spacing['2xl'],
              textAlign: 'center',
              fontSize: typography.fontSize.sm.size,
              color: colors.neutral[600],
            }}
          >
            ¿Ya tienes cuenta?{' '}
            <a
              href="/login"
              style={{
                color: config.theme.colors.primary,
                textDecoration: 'none',
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Inicia sesión
            </a>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Logo Grande y Degradado */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: `linear-gradient(135deg, ${config.theme.colors.primary}15, ${config.theme.colors.secondary}15, ${backgroundColor})`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decoración de fondo */}
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${config.theme.colors.primary}08 0%, transparent 70%)`,
            borderRadius: '50%',
            top: '-100px',
            right: '-100px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            background: `radial-gradient(circle, ${config.theme.colors.secondary}08 0%, transparent 70%)`,
            borderRadius: '50%',
            bottom: '-80px',
            left: '-80px',
          }}
        />

        {/* Logo Grande */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '750px',
            height: '750px',
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))',
          }}
        >
          <img
            src={VitaliaIcon}
            alt="Vitalia"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterLg;