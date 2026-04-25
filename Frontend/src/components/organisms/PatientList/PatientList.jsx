// src/components/organisms/PatientList/PatientList.jsx
import React from 'react';
import PatientCard from '../PatientCard/PatientCard';
import LoadingSpinner from '../../atoms/LoadingSpinner/LoadingSpinner';
import Button from '../../atoms/Button/Button';
import { MdErrorOutline } from 'react-icons/md';
import { IoPersonOutline } from 'react-icons/io5';
import { useTheme } from '../../../Config/ThemeContext';

const PatientList = ({
  pacientes,
  isLoading,
  hasError,
  errorMsg,
  onRetry,
  onEditPatient,
  onViewHistory,
}) => {
  const { colors, spacing, typography } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) {
      return spacing[space];
    }
    const fallbacks = {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '24px',
    };
    return fallbacks[space] || '12px';
  };

  const getFontSize = (size) => {
    if (typography?.fontSize?.[size]?.size) {
      return typography.fontSize[size].size;
    }
    const fallbacks = {
      sm: '14px',
      lg: '18px',
    };
    return fallbacks[size] || '14px';
  };

  if (hasError) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: getSpacing('2xl'),
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            background: colors?.error?.light || '#FEE2E2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: getSpacing('lg'),
          }}
        >
          <MdErrorOutline size={40} style={{ color: colors?.error?.main || '#EF4444' }} />
        </div>

        <h3
          style={{
            fontSize: getFontSize('lg'),
            fontWeight: typography?.fontWeight?.bold || 'bold',
            color: colors?.neutral?.[900] || '#111827',
            margin: 0,
            marginBottom: getSpacing('md'),
            textAlign: 'center',
          }}
        >
          No se pudo cargar los datos
        </h3>

        <p
          style={{
            fontSize: getFontSize('sm'),
            color: colors?.neutral?.[600] || '#4B5563',
            margin: 0,
            marginBottom: getSpacing('lg'),
            textAlign: 'center',
            maxWidth: '300px',
          }}
        >
          {errorMsg || 'Parece que ocurrio un problema al intentar cargar la lista de pacientes. Por favor, intenta mas tarde.'}
        </p>

        <Button onClick={onRetry} variant="error">
          Reintentar
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <LoadingSpinner size="md" text="Cargando pacientes..." />
      </div>
    );
  }

  if (pacientes && pacientes.length > 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: getSpacing('md'),
        }}
      >
        {pacientes.map((paciente) => (
          <PatientCard
            key={paciente.id_paciente || paciente.id}
            patient={paciente}
            onEdit={onEditPatient}
            onViewHistory={onViewHistory}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: getSpacing('2xl'),
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: getSpacing('lg') }}>
        <IoPersonOutline size={48} />
      </div>

      <h3
        style={{
          fontSize: getFontSize('lg'),
          fontWeight: typography?.fontWeight?.bold || 'bold',
          color: colors?.neutral?.[900] || '#111827',
          margin: 0,
          marginBottom: getSpacing('md'),
          textAlign: 'center',
        }}
      >
        Sin pacientes
      </h3>

      <p
        style={{
          fontSize: getFontSize('sm'),
          color: colors?.neutral?.[600] || '#4B5563',
          margin: 0,
          textAlign: 'center',
          maxWidth: '300px',
        }}
      >
        No hay pacientes registrados. Crea uno para comenzar.
      </p>
    </div>
  );
};

export default PatientList;