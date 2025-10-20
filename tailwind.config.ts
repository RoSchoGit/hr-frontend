const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ====== Brand Colors ======
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
          hover: '#1d4ed8',
          active: '#1e40af',
          disabled: '#93c5fd',
        },
        secondary: {
          DEFAULT: '#64748b',
          foreground: '#ffffff',
          hover: '#475569',
          active: '#334155',
          disabled: '#94a3b8',
        },

        // ====== Functional Colors ======
        success: {
          DEFAULT: '#16a34a',
          hover: '#15803d',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          foreground: '#ffffff',
        },
        error: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          foreground: '#ffffff',
        },

        // ====== Neutral / Background ======
        background: '#f8fafc',
        surface: '#ffffff',
        surfaceHover: '#f1f5f9',
        border: '#e2e8f0',
        muted: '#94a3b8',
        text: {
          DEFAULT: '#0f172a',
          muted: '#475569',
          disabled: '#94a3b8',
        },
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },

      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
