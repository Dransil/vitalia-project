// src/components/organisms/DoctorCard/DoctorCard.jsx
import React from 'react';
import Badge from '../../atoms/Badge/Badge';
import DoctorInfoRow from '../../molecules/DoctorInfoRow/DoctorInfoRow';
import ActionButtons from '../../molecules/ActionButtons/ActionButtons';
import { useTheme } from '../../../Config/ThemeContext';

const DoctorCard = ({ doctor, onEdit, onToggleEstado }) => {
  const { colors, spacing, typography, borderRadius, shadows, config } = useTheme();

  const sanitizedDoctor = {
    id: doctor.id_usuario || doctor.id || 0,
    nombre: doctor.nombre || 'Sin nombre',
    apellido: doctor.apellido || 'Sin apellido',
    email: doctor.email || 'Sin email',
    telefono: doctor.telefono || 'N/A',
    rol: doctor.rol || 'Sin rol',
    estado: doctor.estado || 'desconocido',
  };

  // Funciones seguras para obtener estilos
  const getFontSize = (size) => {
    if (typography?.fontSize?.[size]?.size) {
      return typography.fontSize[size].size;
    }
    // Fallbacks
    const fallbacks = {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
    };
    return fallbacks[size] || '16px';
  };

  const getSpacing = (space) => {
    if (spacing?.[space]) {
      return spacing[space];
    }
    // Fallbacks
    const fallbacks = {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '24px',
    };
    return fallbacks[space] || '12px';
  };

  const cardStyle = {
    background: colors?.neutral?.[50] || '#F9FAFB',
    border: `1px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
    borderRadius: borderRadius?.lg || '12px',
    padding: getSpacing('lg'),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: '0.3s all',
    cursor: 'pointer',
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.background = colors?.neutral?.[100] || '#F3F4F6';
    e.currentTarget.style.borderColor = config?.theme?.colors?.primary || '#3B82F6';
    if (shadows?.md) {
      e.currentTarget.style.boxShadow = shadows.md;
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.background = colors?.neutral?.[50] || '#F9FAFB';
    e.currentTarget.style.borderColor = colors?.neutral?.[200] || '#E5E7EB';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ flex: 1 }}>
        <h4
          style={{
            fontSize: getFontSize('md'),
            fontWeight: typography?.fontWeight?.bold || 'bold',
            color: colors?.neutral?.[900] || '#111827',
            margin: 0,
            marginBottom: getSpacing('sm'),
          }}
        >
          {sanitizedDoctor.nombre} {sanitizedDoctor.apellido}
        </h4>

        <DoctorInfoRow 
          email={sanitizedDoctor.email} 
          phone={sanitizedDoctor.telefono} 
        />

        <div
          style={{
            display: 'flex',
            gap: getSpacing('md'),
            marginTop: getSpacing('md'),
          }}
        >
          <Badge variant="primary" size="sm">
            {sanitizedDoctor.rol}
          </Badge>
          <Badge 
            variant={sanitizedDoctor.estado === 'activo' ? 'success' : 'error'} 
            size="sm"
          >
            {sanitizedDoctor.estado}
          </Badge>
        </div>
      </div>

      <ActionButtons
        doctorId={sanitizedDoctor.id}
        estado={sanitizedDoctor.estado}
        onEdit={onEdit}
        onToggleEstado={onToggleEstado}
      />
    </div>
  );
};

export default DoctorCard;