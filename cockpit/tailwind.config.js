/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Chassis (cool gray-blue, Spectra One alignment)
        'pc-chassis': '#E7EBEF',
        'pc-chassis-2': '#F4F6F8',
        'pc-chassis-edge': '#C9CFD5',
        'pc-chassis-warm': '#F2EEE7',
        // Text
        'pc-text': '#1A1A24',
        'pc-text-dim': '#6B6B7A',
        'pc-text-faint': '#A8A8B4',
        // Module accents
        'pc-pim': '#5B8DEF',
        'pc-mdm': '#9E7BD9',
        'pc-dam': '#F38B6C',
        'pc-cdp': '#7BC9A7',
        'pc-dxp': '#A06CD5',
        'pc-commerce': '#E8B547',
        // Platform
        'pc-purple': '#5924AB',
        'pc-purple-bright': '#8B5BD6',
        'pc-gold': '#F5C842',
        'pc-gold-amber': '#E8B547',
        // Knob materials
        'pc-metal-light': '#FAFAFB',
        'pc-metal-mid': '#D6D6DC',
        'pc-metal-edge': '#9A9AA4',
        'pc-metal-dark': '#5A5A66',
        // Status
        'pc-red': '#D94A4A',
        'pc-green': '#58B389',
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widest2: '0.12em',
        widest3: '0.20em',
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: '1' },
          '15%': { opacity: '0.4' },
          '30%': { opacity: '1' },
          '45%': { opacity: '0.6' },
        },
        chassisGlow: {
          '0%,100%': { opacity: '0' },
          '40%': { opacity: '1' },
        },
      },
      animation: {
        flicker: 'flicker 0.6s ease-in-out 1',
        'chassis-glow': 'chassisGlow 400ms ease-in-out 1',
      },
    },
  },
  plugins: [],
}
