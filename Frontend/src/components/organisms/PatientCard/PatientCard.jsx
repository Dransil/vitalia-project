// src/components/organisms/PatientCard/PatientCard.jsx
import React from 'react';
import PatientInfoRow from '../../molecules/PatientInfoRow/PatientInfoRow';
import PatientBadges from '../../molecules/PatientBadges/PatientBadges';
import PatientActionButtons from '../../molecules/PatientActionButtons/PatientActionButtons';
import { useTheme } from '../../../Config/ThemeContext';

const PatientCard = ({ patient, onEdit, onViewHistory }) => {
  const { colors, spacing, typography, borderRadius, shadows, config } = useTheme();

  const sanitizedPatient = {
    id: patient.id_paciente || patient.id || 0,
    nombre: patient.nombre || 'Sin nombre',
    apellido: patient.apellido || 'Sin apellido',
    email: patient.email || 'Sin email',
    telefono: patient.telefono || 'N/A',
    cedula: patient.cedula || 'N/A',
    estado: patient.estado || 'desconocido',
    fecha_nacimiento: patient.fecha_nacimiento || null,
    grupo_sanguineo: patient.grupo_sanguineo || 'No especificado',
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

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

  const getFontSize = () => {
    if (typography?.fontSize?.md?.size) {
      return typography.fontSize.md.size;
    }
    return '16px';
  };

  const edad = calcularEdad(sanitizedPatient.fecha_nacimiento);

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
            fontSize: getFontSize(),
            fontWeight: typography?.fontWeight?.bold || 'bold',
            color: colors?.neutral?.[900] || '#111827',
            margin: 0,
            marginBottom: getSpacing('sm'),
          }}
        >
          {sanitizedPatient.nombre} {sanitizedPatient.apellido}
        </h4>

        <PatientInfoRow
          email={sanitizedPatient.email}
          phone={sanitizedPatient.telefono}
          age={edad}
        />

        <PatientBadges
          cedula={sanitizedPatient.cedula}
          grupoSanguineo={sanitizedPatient.grupo_sanguineo}
          estado={sanitizedPatient.estado}
        />
      </div>

      <PatientActionButtons
        patientId={sanitizedPatient.id}
        onEdit={onEdit}
        onViewHistory={onViewHistory}
      />
    </div>
  );
};

export default PatientCard;