// src/components/organisms/PersonalInfoForm/PersonalInfoForm.jsx
import React from 'react';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import { useTheme } from '../../../Config/ThemeContext';

const PersonalInfoForm = ({ formData, onChange }) => {
  const { spacing } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px' };
    return fallbacks[space] || '24px';
  };

  const fields = [
    { label: 'Nombre *', name: 'nombre', type: 'text', placeholder: 'Nombre del doctor' },
    { label: 'Apellido *', name: 'apellido', type: 'text', placeholder: 'Apellido del doctor' },
    { label: 'Email *', name: 'email', type: 'email', placeholder: 'doctor@email.com' },
    { label: 'Cedula *', name: 'cedula', type: 'text', placeholder: '12345678' },
    { label: 'Telefono *', name: 'telefono', type: 'tel', placeholder: '0999999999' },
  ];

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: getSpacing('lg'),
        }}
      >
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        ))}

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            Estado
          </label>
          <Select
            name="estado"
            value={formData.estado || 'activo'}
            onChange={onChange}
            options={[
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;