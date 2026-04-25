// src/components/organisms/DoctorList/DoctorList.jsx
import React from 'react';
import DoctorCard from '../DoctorCard/DoctorCard';
import LoadingSpinner from '../../atoms/LoadingSpinner/LoadingSpinner';
import Button from '../../atoms/Button/Button';
import { MdErrorOutline } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const DoctorList = ({
  doctores,
  isLoading,
  hasError,
  errorMsg,
  onRetry,
  onEditDoctor,
  onToggleEstado,
}) => {
  const { colors, spacing, typography, borderRadius, shadows } = useTheme();

  if (hasError) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: spacing['2xl'],
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            background: colors.error.light,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.lg,
          }}
        >
          <MdErrorOutline size={40} style={{ color: colors.error.main }} />
        </div>

        <h3
          style={{
            fontSize: typography.fontSize.lg.size,
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            margin: 0,
            marginBottom: spacing.md,
            textAlign: 'center',
          }}
        >
          No se pudo cargar los datos
        </h3>

        <p
          style={{
            fontSize: typography.fontSize.sm.size,
            color: colors.neutral[600],
            margin: 0,
            marginBottom: spacing.lg,
            textAlign: 'center',
            maxWidth: '300px',
          }}
        >
          {errorMsg || 'Parece que ocurrio un problema al intentar cargar la lista de doctores. Por favor, intenta mas tarde.'}
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
        <LoadingSpinner size="md" text="Cargando doctores..." />
      </div>
    );
  }

  if (doctores && doctores.length > 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.md,
        }}
      >
        {doctores.map((doctor) => (
          <DoctorCard
            key={doctor.id_usuario || doctor.id}
            doctor={doctor}
            onEdit={onEditDoctor}
            onToggleEstado={onToggleEstado}
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
        padding: spacing['2xl'],
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: spacing.lg }}>
        📋
      </div>

      <h3
        style={{
          fontSize: typography.fontSize.lg.size,
          fontWeight: typography.fontWeight.bold,
          color: colors.neutral[900],
          margin: 0,
          marginBottom: spacing.md,
          textAlign: 'center',
        }}
      >
        Sin doctores
      </h3>

      <p
        style={{
          fontSize: typography.fontSize.sm.size,
          color: colors.neutral[600],
          margin: 0,
          textAlign: 'center',
          maxWidth: '300px',
        }}
      >
        No hay doctores registrados. Crea uno para comenzar.
      </p>
    </div>
  );
};

export default DoctorList;