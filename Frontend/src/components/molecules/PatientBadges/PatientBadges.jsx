// src/components/molecules/PatientBadges/PatientBadges.jsx
import React from 'react';
import Badge from '../../atoms/Badge/Badge';
import { useTheme } from '../../../Config/ThemeContext';

const PatientBadges = ({ cedula, grupoSanguineo, estado }) => {
  const { spacing } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) {
      return spacing[space];
    }
    const fallbacks = {
      sm: '8px',
      md: '12px',
    };
    return fallbacks[space] || '8px';
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: getSpacing('md'),
        flexWrap: 'wrap',
        marginTop: getSpacing('md'),
      }}
    >
      <Badge variant="neutral" size="sm">
        Cedula: {cedula}
      </Badge>

      {grupoSanguineo !== 'No especificado' && (
        <Badge variant="error" size="sm">
          {grupoSanguineo}
        </Badge>
      )}

      <Badge 
        variant={estado === 'activo' ? 'success' : 'error'} 
        size="sm"
      >
        {estado}
      </Badge>
    </div>
  );
};

export default PatientBadges;