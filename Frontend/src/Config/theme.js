// Variables globales de color
export const colors = {
  // Primarios
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
    950: '#051e3e',
  },

  // Secundarios
  secondary: {
    50: '#f0fdfa',
    100: '#d1faf6',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#134e4a',
    900: '#0f2f2e',
    950: '#05201c',
  },

  success: {
    light: '#d1fae5',
    main: '#10b981',
    dark: '#059669',
  },
  error: {
    light: '#fee2e2',
    main: '#dc2626',
    dark: '#991b1b',
  },
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#d97706',
  },
  info: {
    light: '#dbeafe',
    main: '#3b82f6',
    dark: '#1d4ed8',
  },


  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Fondos
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
    gradient: 'linear-gradient(to bottom right, #f0f9ff, #e0f2fe, #f0fdfa)',
  },

  // Sombras
  shadow: {
    light: 'rgba(14, 165, 233, 0.1)',
    medium: 'rgba(14, 165, 233, 0.15)',
    dark: 'rgba(14, 165, 233, 0.25)',
  },
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
};

export const borderRadius = {
  none: '0',
  xs: '0.25rem',    // 4px
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
};

export const typography = {
  fontFamily: {
    sans: '"Segoe UI", Roboto, sans-serif',
    display: '"Poppins", sans-serif',
    mono: '"Courier New", monospace',
  },
  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' },           // 12px
    sm: { size: '0.875rem', lineHeight: '1.25rem' },       // 14px
    base: { size: '1rem', lineHeight: '1.5rem' },          // 16px
    lg: { size: '1.125rem', lineHeight: '1.75rem' },       // 18px
    xl: { size: '1.25rem', lineHeight: '1.75rem' },        // 20px
    '2xl': { size: '1.5rem', lineHeight: '2rem' },         // 24px
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' },    // 30px
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' },      // 36px
    '5xl': { size: '3rem', lineHeight: '1.1' },            // 48px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  medical: '0 10px 30px rgba(14, 165, 233, 0.1)',
  'medical-lg': '0 20px 40px rgba(14, 165, 233, 0.15)',
};

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
};

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const componentStyles = {
  button: {
    primary: {
      background: `linear-gradient(to right, ${colors.primary[600]}, ${colors.primary[500]})`,
      color: colors.neutral[0],
      hover: `linear-gradient(to right, ${colors.primary[700]}, ${colors.primary[600]})`,
      active: `linear-gradient(to right, ${colors.primary[800]}, ${colors.primary[700]})`,
      disabled: colors.neutral[300],
    },
    secondary: {
      background: `linear-gradient(to right, ${colors.secondary[500]}, ${colors.secondary[400]})`,
      color: colors.neutral[0],
      hover: `linear-gradient(to right, ${colors.secondary[600]}, ${colors.secondary[500]})`,
      active: `linear-gradient(to right, ${colors.secondary[700]}, ${colors.secondary[600]})`,
      disabled: colors.neutral[300],
    },
    ghost: {
      background: 'transparent',
      color: colors.primary[600],
      hover: colors.primary[50],
      active: colors.primary[100],
      disabled: colors.neutral[300],
    },
  },
  card: {
    background: colors.neutral[0],
    border: colors.neutral[200],
    shadow: shadows.md,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  input: {
    background: colors.neutral[0],
    border: colors.neutral[200],
    borderFocus: colors.primary[500],
    placeholder: colors.neutral[400],
    text: colors.neutral[900],
  },
};

// Tema completo
export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  transitions,
  breakpoints,
  componentStyles,
};

export default theme;