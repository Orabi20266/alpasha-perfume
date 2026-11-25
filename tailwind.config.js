/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
        messiri: ['El Messiri', 'Cairo', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"El Messiri"', 'Georgia', 'serif'],
      },
      colors: {
        pasha: {
          50: '#fbf7f5',
          100: '#f4e9e5',
          200: '#e7d2cc',
          300: '#d3aa9f',
          400: '#bb7c70',
          500: '#a1544c',
          600: '#893b3d',
          700: '#712f33',
          800: '#5c282d',
          900: '#4a2227',
          950: '#281216',
        },
        gold: {
          50: '#fbf8ef',
          100: '#f5ecd5',
          200: '#edd9a8',
          300: '#e3c47c',
          400: '#d6ad5c',
          500: '#c09240',
          600: '#a27630',
          700: '#7f5a28',
          800: '#684a27',
          900: '#583f25',
          950: '#33210f',
        },
        ink: '#2b2320',
        ivory: '#f8f5ef',
        line: '#e8ded4',
      },
      boxShadow: {
        soft: '0 24px 60px -30px rgba(74, 34, 39, 0.28)',
        card: '0 10px 30px -18px rgba(74, 34, 39, 0.20)',
        lift: '0 32px 64px -32px rgba(40, 18, 22, 0.45)',
        glow: '0 0 36px rgba(214, 173, 92, 0.28)',
        innerSoft: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      },
      backgroundImage: {
        'pasha-gradient': 'linear-gradient(120deg, #281216 0%, #712f33 52%, #a1544c 100%)',
        'gold-sheen': 'linear-gradient(100deg, #7f5a28 0%, #d6ad5c 45%, #f5ecd5 70%, #c09240 100%)',
        'hero-night':
          'radial-gradient(circle at 78% 18%, rgba(214,173,92,0.20), transparent 42%), radial-gradient(circle at 18% 88%, rgba(161,84,76,0.28), transparent 48%), linear-gradient(125deg, #281216 0%, #4a2227 48%, #712f33 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(.94) translateY(12px)' },
          '60%': { opacity: '1' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-16px) rotate(1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(50%)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(214, 173, 92, 0.35)' },
          '70%': { boxShadow: '0 0 0 14px rgba(214, 173, 92, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(214, 173, 92, 0)' },
        },
        gridPan: {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '56px 56px, 56px 56px' },
        },
        pop: {
          '0%': { transform: 'scale(.8)', opacity: '0' },
          '60%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        drawCheck: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp .7s cubic-bezier(.22,1,.36,1) both',
        fadeIn: 'fadeIn .5s ease both',
        scaleIn: 'scaleIn .45s cubic-bezier(.22,1,.36,1) both',
        slideInLeft: 'slideInLeft .38s cubic-bezier(.22,1,.36,1) both',
        float: 'float 6s ease-in-out infinite',
        floatSlow: 'floatSlow 9s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        marquee: 'marquee 46s linear infinite',
        progress: 'progress 3.8s linear forwards',
        pulseRing: 'pulseRing 2.4s ease-out infinite',
        gridPan: 'gridPan 18s linear infinite',
        pop: 'pop .35s cubic-bezier(.22,1,.36,1) both',
        shake: 'shake .3s ease',
      },
    },
  },
  plugins: [],
};
