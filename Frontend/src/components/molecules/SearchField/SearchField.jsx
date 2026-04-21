// src/components/molecules/SearchField/SearchField.jsx
import React from 'react';
import { MdSearch } from 'react-icons/md';
import Input from '../../atoms/Input/Input';
import { useTheme } from '../../../Config/ThemeContext';

const SearchField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: typography.fontSize.sm.size,
            fontWeight: typography.fontWeight.semibold,
            color: colors.neutral[900],
            marginBottom: spacing.sm,
          }}
        >
          {label}
        </label>
      )}
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon={MdSearch}
      />
    </div>
  );
};

export default SearchField;