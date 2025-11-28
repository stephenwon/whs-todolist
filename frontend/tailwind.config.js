/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // GitHub 스타일 색상 시스템 (docs/9-style-guide.md 참조)
        primary: {
          DEFAULT: '#2DA44E',
          dark: '#2C974B',
          darker: '#298E46',
        },
        dark: {
          canvas: {
            default: '#0D1117',
            subtle: '#161B22',
          },
          border: {
            default: '#30363D',
            muted: '#21262D',
          },
          fg: {
            default: '#C9D1D9',
            muted: '#8B949E',
            subtle: '#6E7681',
          },
        },
        gray: {
          canvas: '#F6F8FA',
          border: '#D0D7DE',
          fg: '#57606A',
        },
        status: {
          success: '#1A7F37',
          warning: '#BF8700',
          error: '#D1242F',
          info: '#0969DA',
        },
        todo: {
          active: '#FB8500',
          completed: '#1A7F37',
          deleted: '#BDBDBD',
        },
        holiday: '#CF222E',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Noto Sans"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        '18': '4.5rem',
      },
      borderRadius: {
        'sm': '3px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(27, 31, 36, 0.12)',
        'md': '0 3px 8px rgba(27, 31, 36, 0.15)',
        'lg': '0 8px 24px rgba(140, 149, 159, 0.2)',
        'xl': '0 16px 48px rgba(27, 31, 36, 0.3)',
      },
    },
  },
  plugins: [],
}
