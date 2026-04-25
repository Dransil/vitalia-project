// src/components/organisms/CredentialsForm/CredentialsForm.jsx
import React from 'react';
import ToggleSwitch from '../../atoms/ToggleSwitch/ToggleSwitch';
import PasswordField from '../../molecules/PasswordField/PasswordField';
import PasswordRequirements from '../../molecules/PasswordRequirements/PasswordRequirements';
import { MdSecurity } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const CredentialsForm = ({
  cambiarPassword,
  onToggleCambiarPassword,
  formData,
  onChange,
  passwordValidation,
  confirmPasswordError,
}) => {
  const { colors, spacing, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', xl: '32px' };
    return fallbacks[space] || '24px';
  };

  return (
    <div>
      <ToggleSwitch
        checked={cambiarPassword}
        onChange={onToggleCambiarPassword}
        label="Cambiar contraseña"
        description={
          cambiarPassword
            ? 'Haz clic para cancelar el cambio'
            : 'Haz clic para establecer una nueva contraseña'
        }
      />

      {cambiarPassword && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: getSpacing('lg'),
            marginBottom: getSpacing('lg'),
            marginTop: getSpacing('lg'),
          }}
        >
          <PasswordField
            label="Nueva Contraseña *"
            name="nueva_contraseña"
            value={formData.nueva_contraseña || ''}
            onChange={onChange}
          />

          <PasswordField
            label="Confirmar Contraseña *"
            name="confirmar_contraseña"
            value={formData.confirmar_contraseña || ''}
            onChange={onChange}
            error={confirmPasswordError}
            errorMessage="Las contraseñas no coinciden"
          />
        </div>
      )}

      {cambiarPassword && formData.nueva_contraseña && (
        <PasswordRequirements validation={passwordValidation} />
      )}

      {!cambiarPassword && (
        <div
          style={{
            padding: getSpacing('xl'),
            textAlign: 'center',
            color: colors?.neutral?.[500] || '#6B7280',
            fontSize: typography?.fontSize?.sm?.size || '14px',
          }}
        >
          <MdSecurity
            size={40}
            style={{
              color: colors?.neutral?.[300] || '#D1D5DB',
              display: 'block',
              margin: '0 auto 12px',
            }}
          />
          La contraseña actual se mantiene sin cambios.
          <br />
          Activa la opcion de arriba para modificarla.
        </div>
      )}
    </div>
  );
};

export default CredentialsForm;