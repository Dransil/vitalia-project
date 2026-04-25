// src/components/molecules/ActionButtons/ActionButtons.jsx
import React from 'react';
import { MdEdit, MdBlock, MdCheck } from 'react-icons/md';
import Button from '../../atoms/Button/Button';
import { useTheme } from '../../../Config/ThemeContext';

const ActionButtons = ({ 
  doctorId, 
  estado, 
  onEdit, 
  onToggleEstado 
}) => {
  const { spacing } = useTheme();

  return (
    <div style={{ display: 'flex', gap: spacing.md, marginLeft: spacing.lg }}>
      <Button
        size="sm"
        variant="primary"
        onClick={() => onEdit(doctorId)}
        icon={MdEdit}
      >
        Editar
      </Button>
      
      <Button
        size="sm"
        variant={estado === 'activo' ? 'error' : 'success'}
        onClick={() => onToggleEstado(doctorId, estado)}
        icon={estado === 'activo' ? MdBlock : MdCheck}
      >
        {estado === 'activo' ? 'Desactivar' : 'Activar'}
      </Button>
    </div>
  );
};

export default ActionButtons;