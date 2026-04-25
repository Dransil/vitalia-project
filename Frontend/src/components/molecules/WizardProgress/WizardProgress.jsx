// src/components/molecules/WizardProgress/WizardProgress.jsx
import React from 'react';
import { useTheme } from '../../../Config/ThemeContext';

const WizardProgress = ({ currentStep, totalSteps, steps, currentIcon: CurrentIcon }) => {
  const { colors, spacing, typography, borderRadius, shadows, config } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', md: '16px', sm: '8px' };
    return fallbacks[space] || '16px';
  };

  const primaryColor = config?.theme?.colors?.primary || '#3B82F6';
  const secondaryColor = config?.theme?.colors?.secondary || '#14B8A6';
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div
      style={{
        background: colors?.neutral?.[0] || '#FFFFFF',
        border: `1px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
        borderRadius: borderRadius?.xl || '12px',
        padding: getSpacing('lg'),
        marginBottom: getSpacing('lg'),
        boxShadow: shadows?.sm,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: getSpacing('md'),
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: getSpacing('sm'),
            fontSize: typography?.fontSize?.sm?.size || '14px',
            fontWeight: typography?.fontWeight?.semibold || 600,
            color: colors?.neutral?.[700] || '#374151',
          }}
        >
          {CurrentIcon && <CurrentIcon size={20} style={{ color: primaryColor }} />}
          Paso {currentStep + 1} de {totalSteps}
        </div>
        <div
          style={{
            fontSize: typography?.fontSize?.sm?.size || '14px',
            fontWeight: typography?.fontWeight?.medium || 500,
            color: colors?.neutral?.[600] || '#4B5563',
          }}
        >
          {steps[currentStep]?.titulo}
        </div>
      </div>
      <div
        style={{
          height: '8px',
          background: colors?.neutral?.[200] || '#E5E7EB',
          borderRadius: borderRadius?.full || '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
            borderRadius: borderRadius?.full || '9999px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default WizardProgress;