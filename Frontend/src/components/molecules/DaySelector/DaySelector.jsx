// src/components/molecules/DaySelector/DaySelector.jsx
import React from 'react';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import { useTheme } from '../../../Config/ThemeContext';

const DIAS_SEMANA = [
  { id: 'Lun', nombre: 'Lunes' },
  { id: 'Mar', nombre: 'Martes' },
  { id: 'Mie', nombre: 'Miercoles' },
  { id: 'Jue', nombre: 'Jueves' },
  { id: 'Vie', nombre: 'Viernes' },
  { id: 'Sab', nombre: 'Sabado' },
  { id: 'Dom', nombre: 'Domingo' },
];

const DaySelector = ({ selectedDays, onDayToggle }) => {
  const { spacing } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { md: '16px' };
    return fallbacks[space] || '16px';
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: getSpacing('md'),
      }}
    >
      {DIAS_SEMANA.map((dia) => (
        <Checkbox
          key={dia.id}
          checked={selectedDays.includes(dia.id)}
          onChange={() => onDayToggle(dia.id)}
          label={dia.nombre}
        />
      ))}
    </div>
  );
};

export default DaySelector;