// src/components/templates/FormPageTemplate/FormPageTemplate.jsx
import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useTheme } from '../../../Config/ThemeContext';

const FormPageTemplate = ({
  title,
  subtitle,
  onBack,
  children,
  error,
  success,
}) => {
  const { colors, spacing, typography, borderRadius, shadows } = useTheme();

  const getSpacing = (space) => {
    if (spacing?.[space]) return spacing[space];
    const fallbacks = { lg: '24px', xl: '32px', sm: '8px', md: '16px' };
    return fallbacks[space] || '24px';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: colors?.neutral?.[50] || '#F9FAFB',
        overflow: 'auto',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      <div
        style={{
          background: colors?.neutral?.[0] || '#FFFFFF',
          borderBottom: `1px solid ${colors?.neutral?.[200] || '#E5E7EB'}`,
          padding: getSpacing('lg'),
          boxShadow: shadows?.sm,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: getSpacing('md'),
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: colors?.neutral?.[600] || '#4B5563',
              display: 'flex',
              alignItems: 'center',
              padding: getSpacing('sm'),
              borderRadius: borderRadius?.md || '6px',
            }}
          >
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1
              style={{
                fontSize: typography?.fontSize?.['2xl']?.size || '24px',
                fontWeight: typography?.fontWeight?.bold || 700,
                color: colors?.neutral?.[900] || '#111827',
                margin: 0,
                lineHeight: 1,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  margin: 0,
                  fontSize: typography?.fontSize?.xs?.size || '12px',
                  color: colors?.neutral?.[500] || '#6B7280',
                  marginTop: '2px',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: getSpacing('xl'),
        }}
      >
        {error && (
          <div
            style={{
              padding: getSpacing('md'),
              marginBottom: getSpacing('lg'),
              backgroundColor: colors?.error?.light || '#FEE2E2',
              border: `2px solid ${colors?.error?.main || '#EF4444'}`,
              color: colors?.error?.dark || '#991B1B',
              borderRadius: borderRadius?.lg || '8px',
              fontWeight: typography?.fontWeight?.semibold || 600,
              fontSize: typography?.fontSize?.sm?.size || '14px',
              display: 'flex',
              alignItems: 'center',
              gap: getSpacing('md'),
            }}
          >
            <MdArrowBack size={20} style={{ transform: 'rotate(180deg)' }} />
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: getSpacing('md'),
              marginBottom: getSpacing('lg'),
              backgroundColor: colors?.success?.light || '#D1FAE5',
              border: `2px solid ${colors?.success?.main || '#10B981'}`,
              color: colors?.success?.dark || '#065F46',
              borderRadius: borderRadius?.lg || '8px',
              fontWeight: typography?.fontWeight?.semibold || 600,
              fontSize: typography?.fontSize?.sm?.size || '14px',
              display: 'flex',
              alignItems: 'center',
              gap: getSpacing('md'),
            }}
          >
            <MdArrowBack size={20} style={{ transform: 'rotate(180deg)' }} />
            {success}
          </div>
        )}

        {children}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default FormPageTemplate;