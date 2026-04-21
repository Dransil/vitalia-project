// src/components/molecules/PasswordRequirements/PasswordRequirements.jsx
import React from 'react';
import { MdCheck, MdClose } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const PasswordRequirements = ({ validation }) => {
  const { colors, spacing, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const requirements = [
    { key: 'mayuscula', label: 'Una mayuscula (A-Z)' },
    { key: 'minuscula', label: 'Una minuscula (a-z)' },
    { key: 'numero', label: 'Un numero (0-9)' },
    { key: 'caracterEspecial', label: 'Caracter especial (!@#$%)' },
    { key: 'minimo8', label: 'Minimo 8 caracteres' },
  ];

  return (
    <div
      style={{
        padding: getSpacing('md'),
        background: colors?.neutral?.[50] || '#F9FAFB',
        border: `1px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
        borderRadius: '6px',
      }}
    >
      <p
        style={{
          margin: 0,
          marginBottom: getSpacing('md'),
          fontWeight: typography?.fontWeight?.semibold || 600,
          fontSize: typography?.fontSize?.sm?.size || '14px',
          color: colors?.neutral?.[900] || '#111827',
        }}
      >
        Requisitos:
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: getSpacing('md'),
        }}
      >
        {requirements.map((req) => (
          <div key={req.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {validation[req.key] ? (
              <MdCheck size={16} style={{ color: colors?.success?.main || '#10B981' }} />
            ) : (
              <MdClose size={16} style={{ color: colors?.error?.main || '#EF4444' }} />
            )}
            <span
              style={{
                fontSize: typography?.fontSize?.xs?.size || '12px',
                color: colors?.neutral?.[600] || '#4B5563',
              }}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
