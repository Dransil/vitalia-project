// src/components/organisms/ScheduleStep/ScheduleStep.jsx
import React from 'react';
import RadioCard from '../../atoms/RadioCard/RadioCard';
import DaySelector from '../../molecules/DaySelector/DaySelector';
import { MdAccessTime, MdCheck } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const ScheduleStep = ({ formData, onChange, onDayToggle, horarios = [] }) => {
  const { colors, spacing, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { xl: '32px', md: '16px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const horarioSeleccionado = horarios.find(
    (h) => String(h?.id_horario) === formData.id_horario
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
          Seleccione un Horario *
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: getSpacing('md'),
          }}
        >
          {horarios.map((horario) => {
            if (!horario) return null;
            return (
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
            );
          })}
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
              gap: getSpacing('sm'),
              marginBottom: getSpacing('sm'),
            }}
          >
            <MdCheck size={18} style={{ color: colors?.success?.dark || '#065F46' }} />
            <span
              style={{
                fontWeight: typography?.fontWeight?.semibold || 600,
                color: colors?.success?.dark || '#065F46',
              }}
            >
              Horario seleccionado: {horarioSeleccionado.nombre}
            </span>
          </div>
          <div
            style={{
              fontSize: typography?.fontSize?.sm?.size || '14px',
              color: colors?.success?.dark || '#065F46',
            }}
          >
            Horario: {horarioSeleccionado.horario_inicio?.substring(0, 5)} -{' '}
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
          Dias de Atencion * (Seleccione los dias que trabaja)
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
                gap: getSpacing('xs'),
              }}
            >
              <MdCheck size={14} /> Dias seleccionados: {formData.dias_atencion.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleStep;