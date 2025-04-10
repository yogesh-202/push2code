// Theme configuration for the application
// This includes color schemes, spacing, and component styles

const theme = {
  // Main colors
  colors: {
    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1', // Indigo-600, our primary color
      600: '#4F46E5',
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
    },
    secondary: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6', // Purple-600
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    success: {
      50: '#ECFDF5',
      100: '#D1FAE5',
      500: '#10B981', // Green-600
      600: '#059669',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      500: '#F59E0B', // Yellow-600
      600: '#D97706',
    },
    danger: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      500: '#EF4444', // Red-600
      600: '#DC2626',
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  
  // Spacing scale
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  
  // Breakpoints for responsive design
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Typography
  fonts: {
    sans: [
      'Inter',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
  },
  
  // Font sizes
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  
  // Component-specific theme settings
  components: {
    // Button variants
    button: {
      primary: {
        base: 'bg-indigo-600 text-white',
        hover: 'hover:bg-indigo-700',
        active: 'active:bg-indigo-800',
        disabled: 'disabled:bg-indigo-400 disabled:cursor-not-allowed',
      },
      secondary: {
        base: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        hover: 'hover:bg-gray-300 dark:hover:bg-gray-600',
        active: 'active:bg-gray-400 dark:active:bg-gray-500',
        disabled: 'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
      },
      danger: {
        base: 'bg-red-600 text-white',
        hover: 'hover:bg-red-700',
        active: 'active:bg-red-800',
        disabled: 'disabled:bg-red-400 disabled:cursor-not-allowed',
      },
    },
    
    // Card styles
    card: {
      base: 'bg-white dark:bg-gray-800 rounded-lg shadow-md',
      hover: 'hover:shadow-lg',
      active: 'active:shadow-md',
    },
    
    // Input styles
    input: {
      base: 'w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
      focus: 'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
      error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
      disabled: 'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
    },
  },
};

export default theme;
