// src/components/organisms/ProfessionalInfoForm/ProfessionalInfoForm.jsx
import React from 'react';
import Select from '../../atoms/Select/Select';
import { useTheme } from '../../../Config/ThemeContext';

const ProfessionalInfoForm = ({
  formData,
  onChange,
  especialidades = [],
  consultorios = [],
}) => {
  const { spacing, colors, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', xs: '4px' };
    return fallbacks[space] || '24px';
  };

  const especialidadesOptions = especialidades.map((esp) => ({
    value: String(esp.id_especialidad || esp.id),
    label: esp.nombre || 'Sin nombre',
  }));

  const consultoriosOptions = consultorios.map((cons) => ({
    value: String(cons.id_consultorio || cons.id),
    label: cons.nombre || 'Sin nombre',
  }));

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: getSpacing('lg'),
        }}
      >
        <div>
          <label
            style={{
              display: 'block',
              fontSize: typography?.fontSize?.sm?.size || '14px',
              fontWeight: typography?.fontWeight?.semibold || 600,
              marginBottom: getSpacing('xs'),
            }}
          >
            Especialidad *
          </label>
          <Select
            name="id_especialidad"
            value={formData.id_especialidad || ''}
            onChange={onChange}
            options={especialidadesOptions}
            placeholder="Selecciona una especialidad"
          />
          {especialidades.length === 0 && (
            <p
              style={{
                color: colors?.error?.main || '#EF4444',
                fontSize: typography?.fontSize?.xs?.size || '12px',
                marginTop: getSpacing('xs'),
              }}
            >
              No hay especialidades activas.
            </p>
          )}
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: typography?.fontSize?.sm?.size || '14px',
              fontWeight: typography?.fontWeight?.semibold || 600,
              marginBottom: getSpacing('xs'),
            }}
          >
            Consultorio *
          </label>
          <Select
            name="id_consultorio"
            value={formData.id_consultorio || ''}
            onChange={onChange}
            options={consultoriosOptions}
            placeholder="Selecciona un consultorio"
          />
          {consultorios.length === 0 && (
            <p
              style={{
                color: colors?.error?.main || '#EF4444',
                fontSize: typography?.fontSize?.xs?.size || '12px',
                marginTop: getSpacing('xs'),
              }}
            >
              No hay consultorios activos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoForm;