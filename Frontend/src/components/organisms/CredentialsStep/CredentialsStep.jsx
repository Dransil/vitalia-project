// src/components/organisms/CredentialsStep/CredentialsStep.jsx
import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import PasswordRequirements from '../../molecules/PasswordRequirements/PasswordRequirements';
import { useTheme } from '../../../Config/ThemeContext';

const CredentialsStep = ({ formData, onChange, passwordValidation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { spacing, colors, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', md: '16px' };
    return fallbacks[space] || '16px';
  };

  const confirmPasswordError =
    formData.confirmarContraseña &&
    formData.contraseña !== formData.confirmarContraseña;

  const primaryColor = '#3B82F6';

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: getSpacing('lg'),
          marginBottom: getSpacing('lg'),
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              fontSize: typography?.fontSize?.sm?.size || '14px',
              fontWeight: typography?.fontWeight?.semibold || 600,
              marginBottom: '4px',
            }}
          >
            Contraseña *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="contraseña"
              value={formData.contraseña || ''}
              onChange={onChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '16px 40px 16px 16px',
                border: `2px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = primaryColor)}
              onBlur={(e) => (e.target.style.borderColor = colors?.neutral?.[200] || '#E5E7EB')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors?.neutral?.[500] || '#6B7280',
              }}
            >
              {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: typography?.fontSize?.sm?.size || '14px',
              fontWeight: typography?.fontWeight?.semibold || 600,
              marginBottom: '4px',
            }}
          >
            Confirmar Contraseña *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmarContraseña"
              value={formData.confirmarContraseña || ''}
              onChange={onChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '16px 40px 16px 16px',
                border: `2px solid ${
                  confirmPasswordError
                    ? (colors?.error?.main || '#EF4444')
                    : (colors?.neutral?.[200] || '#E5E7EB')
                }`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = primaryColor)}
              onBlur={(e) => {
                e.target.style.borderColor = confirmPasswordError
                  ? (colors?.error?.main || '#EF4444')
                  : (colors?.neutral?.[200] || '#E5E7EB');
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors?.neutral?.[500] || '#6B7280',
              }}
            >
              {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
          {confirmPasswordError && (
            <p
              style={{
                color: colors?.error?.main || '#EF4444',
                fontSize: typography?.fontSize?.xs?.size || '12px',
                marginTop: '4px',
              }}
            >
              Las contraseñas no coinciden
            </p>
          )}
        </div>
      </div>

      {formData.contraseña && <PasswordRequirements validation={passwordValidation} />}
    </div>
  );
};

export default CredentialsStep;