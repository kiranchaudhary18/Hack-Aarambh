/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#05070c',
          card: 'rgba(13, 18, 30, 0.45)',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: '#00ffd0',
          blue: '#00f2fe',
          pink: '#ec4899',
          purple: '#b026ff',
          neonGreen: '#39ff14',
          gray: '#8a99ad',
          muted: 'rgba(255, 255, 255, 0.05)',
        }
      },
      borderRadius: {
        '30px': '30px',
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 242, 254, 0.4), inset 0 0 15px rgba(0, 242, 254, 0.1)',
        'neon-green': '0 0 15px rgba(0, 255, 208, 0.4), inset 0 0 15px rgba(0, 255, 208, 0.1)',
        'neon-purple': '0 0 15px rgba(176, 38, 255, 0.4), inset 0 0 15px rgba(176, 38, 255, 0.1)',
        'neon-pink': '0 0 15px rgba(236, 72, 153, 0.4), inset 0 0 15px rgba(236, 72, 153, 0.1)',
        'clay-glass': 'inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -2px 6px rgba(0, 0, 0, 0.4), 0 10px 30px rgba(0, 0, 0, 0.5)',
        'clay-button': 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 255, 208, 0.3)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #070a13 0%, #0c1122 100%)',
        'neon-gradient': 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)',
        'glow-gradient': 'linear-gradient(90deg, #00ffd0 0%, #b026ff 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
