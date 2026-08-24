import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1B3A57',
        gold: '#C9A227',
        cream: '#F7F3E8',
        pine: '#2D5F4E',
        paper: '#E8E1D1',
        ember: '#B85C38',
      },
      boxShadow: {
        royal: '0 12px 30px rgba(27, 58, 87, 0.12)',
      },
      backgroundImage: {
        'royal-pattern': 'linear-gradient(135deg, rgba(27,58,87,0.96), rgba(201,162,39,0.22))',
      },
    },
  },
  plugins: [],
};

export default config;
