import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/composables/**/*.{js,ts}',
    './app.vue',
    './nuxt.config.{js,ts}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Palatino', 'Times New Roman', 'serif'],
      },
      colors: {
        brand: {
          50: '#fbf4f0',
          100: '#f6e8e0',
          200: '#efd1c1',
          300: '#e1af95',
          400: '#cf8a6f',
          500: '#b86f56',
          600: '#9f5f49',
          700: '#7f4c3b',
          800: '#6a4032',
          900: '#57362b',
          950: '#311e17',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
