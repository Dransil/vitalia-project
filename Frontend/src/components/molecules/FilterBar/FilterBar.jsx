// src/components/molecules/FilterBar/FilterBar.jsx
import React from 'react';
import Button from '../../atoms/Button/Button';
import SearchField from '../SearchField/SearchField';
import { MdClose } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const FilterBar = ({
  searchName,
  onSearchNameChange,
  searchEmail,
  onSearchEmailChange,
  searchPhone,
  onSearchPhoneChange,
  onClearFilters,
}) => {
  const { spacing } = useTheme();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr auto',
        gap: spacing.lg,
        alignItems: 'flex-end',
      }}
    >
      <SearchField
        label="Nombre o Apellido"
        value={searchName}
        onChange={onSearchNameChange}
        placeholder="Buscar por nombre o apellido..."
      />
      
      <SearchField
        label="Email"
        type="email"
        value={searchEmail}
        onChange={onSearchEmailChange}
        placeholder="Buscar por email..."
      />
      
      <SearchField
        label="Teléfono"
        type="tel"
        value={searchPhone}
        onChange={onSearchPhoneChange}
        placeholder="Buscar por teléfono..."
      />
      
      <Button
        variant="secondary"
        onClick={onClearFilters}
        icon={MdClose}
      >
        Quitar Filtros
      </Button>
    </div>
  );
};

export default FilterBar;