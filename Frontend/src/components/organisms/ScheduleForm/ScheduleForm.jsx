// src/components/organisms/ScheduleForm/ScheduleForm.jsx
import React from 'react';
import RadioCard from '../../atoms/RadioCard/RadioCard';
import DaySelector from '../../molecules/DaySelector/DaySelector';
import { MdAccessTime, MdCheck } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const HORARIOS_DEFAULT = [
  { id_horario: 1, nombre: 'Manana', horario_inicio: '08:00:00', horario_fin: '12:00:00' },
  { id_horario: 2, nombre: 'Tarde', horario_inicio: '14:00:00', horario_fin: '18:00:00' },
  { id_horario: 3, nombre: 'Completo', horario_inicio: '08:00:00', horario_fin: '18:00:00' },
];

const ScheduleForm = ({ formData, onChange, onDayToggle, horarios = HORARIOS_DEFAULT }) => {
  const { colors, spacing, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { xl: '32px', md: '16px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const horarioSeleccionado = horarios.find(
    (h) => String(h.id_horario) === formData.id_horario
  );

  return (
    <div>
      <div style={{ marginBottom: getSpacing('xl') }}>
        <label
          style={{
            display: 'block',
            marginBottom: getSpacing('sm'),
            fontSize: typography?.fontSize?.sm?.size || '14px',
            fontWeight: typography?.fontWeight?.semibold || 600,
          }}
        >
          Turno *
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: getSpacing('md'),
          }}
        >
          {horarios.map((horario) => (
            <RadioCard
              key={horario.id_horario}
              name="id_horario"
              value={String(horario.id_horario)}
              checked={formData.id_horario === String(horario.id_horario)}
              onChange={onChange}
              title={horario.nombre}
              subtitle={`${horario.horario_inicio?.substring(0, 5)} - ${horario.horario_fin?.substring(0, 5)}`}
              icon={MdAccessTime}
            />
          ))}
        </div>
      </div>

      {horarioSeleccionado && (
        <div
          style={{
            padding: getSpacing('md'),
            background: colors?.success?.light || '#D1FAE5',
            borderRadius: '6px',
            marginBottom: getSpacing('xl'),
            border: `1px solid ${colors?.success?.main || '#10B981'}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px',
            }}
          >
            <MdCheck size={16} style={{ color: colors?.success?.dark || '#065F46' }} />
            <span
              style={{
                fontWeight: 600,
                color: colors?.success?.dark || '#065F46',
                fontSize: typography?.fontSize?.sm?.size || '14px',
              }}
            >
              Turno seleccionado: {horarioSeleccionado.nombre}
            </span>
          </div>
          <div
            style={{
              fontSize: typography?.fontSize?.sm?.size || '14px',
              color: colors?.success?.dark || '#065F46',
            }}
          >
            {horarioSeleccionado.horario_inicio?.substring(0, 5)} -{' '}
            {horarioSeleccionado.horario_fin?.substring(0, 5)}
          </div>
        </div>
      )}

      <div>
        <label
          style={{
            display: 'block',
            marginBottom: getSpacing('md'),
            fontSize: typography?.fontSize?.sm?.size || '14px',
            fontWeight: typography?.fontWeight?.semibold || 600,
          }}
        >
          Dias de Atencion *
        </label>
        <DaySelector selectedDays={formData.dias_atencion || []} onDayToggle={onDayToggle} />

        {formData.dias_atencion && formData.dias_atencion.length > 0 && (
          <div
            style={{
              marginTop: getSpacing('md'),
              padding: getSpacing('sm'),
              background: colors?.success?.light || '#D1FAE5',
              borderRadius: '6px',
              display: 'inline-block',
            }}
          >
            <span
              style={{
                fontSize: typography?.fontSize?.xs?.size || '12px',
                color: colors?.success?.dark || '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <MdCheck size={13} /> Dias: {formData.dias_atencion.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleForm;