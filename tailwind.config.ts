import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [
    'bg-accent', 'bg-earth', 'bg-fire',
    'bg-wood-el', 'bg-water', 'bg-metal',
  ],
  theme: {
    extend: {
      colors: {
        parchment: { DEFAULT: '#F5F0E8', surface: '#EDE5D8' },
        wood:      { DEFAULT: '#8B6F47', light: '#A88B6A' },
        ink:       { DEFAULT: '#2C2416', muted: '#6B5B45' },
        accent:    '#C17B3F',
        fire:      '#D4521A',
        water:     '#3A7CA5',
        metal:     '#7A7A7A',
        earth:     '#B8860B',
        'wood-el': '#4A7C59',
      },
      fontFamily: {
        serif: ['"Noto Serif TC"', 'serif'],
        sans:  ['"Noto Sans TC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
