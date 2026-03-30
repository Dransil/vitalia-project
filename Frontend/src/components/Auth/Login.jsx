import React, { useState } from 'react';
import { useTheme } from '../../Config/ThemeContext';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import VitaliaIcon from '../../assets/Vitalia_Icon.png';

const Login = () => {
  const { config, colors, spacing, typography, borderRadius } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Login attempt:', { email, password });
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
              Bienvenido
            </h1>
            <p
              style={{
                fontSize: typography.fontSize.sm.size,
                color: colors.neutral[500],
                margin: 0,
              }}
            >
              Inicia sesión para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
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
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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

            {/* Recordarme */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  cursor: 'pointer',
                  fontSize: typography.fontSize.sm.size,
                }}
              >
                <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <span style={{ color: colors.neutral[600] }}>Recuérdame</span>
              </label>
              <a
                href="#"
                style={{
                  fontSize: typography.fontSize.sm.size,
                  color: config.theme.colors.primary,
                  textDecoration: 'none',
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón Login */}
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
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Registrarse */}
          <div
            style={{
              marginTop: spacing['2xl'],
              textAlign: 'center',
              fontSize: typography.fontSize.sm.size,
              color: colors.neutral[600],
            }}
          >
            ¿No tienes cuenta?{' '}
            <a
              href="/Register_Signup"
              style={{
                color: config.theme.colors.primary,
                textDecoration: 'none',
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Regístrate aquí
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

export default Login;