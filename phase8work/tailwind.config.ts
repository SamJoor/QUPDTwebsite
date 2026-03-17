import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './types/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        fraternity: {
          burgundy: '#7DB9E8',
          burgundyDeep: '#4D8FC5',
          cream: '#F7F1E8',
          parchment: '#EFE6D8',
          charcoal: '#1F1F1F',
          slate: '#4B5563',
          gold: '#9EB8D1'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Arial', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(31, 31, 31, 0.08)'
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top, rgba(125,185,232,0.22), transparent 40%)'
      }
    }
  },
  plugins: []
};

export default config;
