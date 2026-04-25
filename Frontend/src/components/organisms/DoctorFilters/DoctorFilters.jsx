// src/components/organisms/DoctorFilters/DoctorFilters.jsx
import React from 'react';
import FilterBar from '../../molecules/FilterBar/FilterBar';
import Button from '../../atoms/Button/Button';
import { MdAdd } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const DoctorFilters = ({
  searchName,
  onSearchNameChange,
  searchEmail,
  onSearchEmailChange,
  searchPhone,
  onSearchPhoneChange,
  onClearFilters,
  onCreateUser,
}) => {
  const { colors, spacing, borderRadius, shadows } = useTheme();

  return (
    <>
      <div
        style={{
          background: colors.neutral[0],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: borderRadius.xl,
          padding: spacing.lg,
          boxShadow: shadows.md,
          marginBottom: spacing.lg,
        }}
      >
        <FilterBar
          searchName={searchName}
          onSearchNameChange={onSearchNameChange}
          searchEmail={searchEmail}
          onSearchEmailChange={onSearchEmailChange}
          searchPhone={searchPhone}
          onSearchPhoneChange={onSearchPhoneChange}
          onClearFilters={onClearFilters}
        />
      </div>

      <div style={{ marginBottom: spacing.lg }}>
        <Button onClick={onCreateUser} icon={MdAdd}>
          Crear Nuevo Usuario
        </Button>
      </div>
    </>
  );
};

export default DoctorFilters;