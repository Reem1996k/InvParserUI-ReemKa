import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oracle: {
          50: '#f5f7fa',
          100: '#eaeef5',
          200: '#d5dde8',
          300: '#b3c1d9',
          400: '#8fa1c4',
          500: '#6f82b3',
          600: '#5a6a9a',
          700: '#4a5580',
          800: '#3d4569',
          900: '#2f3650',
          950: '#1f2333',
        },
      },
    },
  },
  plugins: [],
}
export default config
