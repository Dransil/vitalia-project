// src/components/molecules/WizardNavigation/WizardNavigation.jsx
import React from 'react';
import { MdArrowBack, MdArrowForward, MdCheck } from 'react-icons/md';
import Button from '../../atoms/Button/Button';
import { useTheme } from '../../../Config/ThemeContext';

const WizardNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  isLastStep,
  isFormValid,
}) => {
  const { spacing } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', md: '16px', sm: '8px', '2xl': '48px' };
    return fallbacks[space] || '16px';
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: getSpacing('md'),
        marginTop: getSpacing('2xl'),
        paddingTop: getSpacing('lg'),
        borderTop: '1px solid #E5E7EB',
      }}
    >
      {currentStep > 0 && (
        <Button variant="secondary" onClick={onPrevious} icon={MdArrowBack}>
          Atras
        </Button>
      )}

      {!isLastStep ? (
        <Button
          variant="primary"
          onClick={onNext}
          icon={MdArrowForward}
          style={{ marginLeft: 'auto' }}
        >
          Siguiente
        </Button>
      ) : (
        <Button
          type="submit"
          variant="primary"
          onClick={onSubmit}
          disabled={!isFormValid || isSubmitting}
          icon={MdCheck}
          style={{ marginLeft: 'auto' }}
        >
          {isSubmitting ? 'Creando...' : 'Crear Doctor'}
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;