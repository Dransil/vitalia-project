// src/components/molecules/PatientActionButtons/PatientActionButtons.jsx
import React from 'react';
import { MdEdit } from 'react-icons/md';
import { RiFolderUserFill } from 'react-icons/ri';
import Button from '../../atoms/Button/Button';
import { useTheme } from '../../../Config/ThemeContext';

const PatientActionButtons = ({ 
  patientId, 
  onEdit, 
  onViewHistory 
}) => {
  const { spacing } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) {
      return spacing[space];
    }
    const fallbacks = {
      sm: '8px',
      md: '12px',
      lg: '16px',
    };
    return fallbacks[space] || '12px';
  };

  return (
    <div style={{ display: 'flex', gap: getSpacing('md'), marginLeft: getSpacing('lg') }}>
      <Button
        size="sm"
        variant="primary"
        onClick={() => onEdit(patientId)}
        icon={MdEdit}
      >
        Editar
      </Button>

      <Button
        size="sm"
        variant="primary"
        onClick={() => onViewHistory(patientId)}
        icon={RiFolderUserFill}
      >
        Ver historial
      </Button>
    </div>
  );
};

export default PatientActionButtons;