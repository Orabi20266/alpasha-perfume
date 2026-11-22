/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
        messiri: ['El Messiri', 'Cairo', 'system-ui', 'sans-serif'],
      },
      colors: {
        pasha: {
          50: '#fdf5f7',
          100: '#fbe8ee',
          200: '#f6cfdb',
          300: '#eda6bc',
          400: '#e0749a',
          500: '#cd4a78',
          600: '#b02f5e',
          700: '#93244e',
          800: '#7a2144',
          900: '#681f3c',
          950: '#3d0d22',
        },
        gold: {
          50: '#fdf9ec',
          100: '#f9efc9',
          200: '#f2dd8f',
          300: '#eac455',
          400: '#e3ac2d',
          500: '#d4911d',
          600: '#b76d16',
          700: '#924e15',
          800: '#793e18',
          900: '#673417',
          950: '#3c1a08',
        },
        sand: '#faf7f2',
      },
      boxShadow: {
        soft: '0 18px 45px -18px rgba(176, 47, 94, 0.35)',
        card: '0 4px 24px -6px rgba(61, 13, 34, 0.10)',
        glow: '0 0 28px rgba(205, 74, 120, 0.38)',
        innerSoft: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'pasha-gradient': 'linear-gradient(120deg, #3d0d22 0%, #93244e 55%, #cd4a78 100%)',
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
          '50%': { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-18px) rotate(1deg)' },
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
          '0%': { boxShadow: '0 0 0 0 rgba(205, 74, 120, 0.45)' },
          '70%': { boxShadow: '0 0 0 16px rgba(205, 74, 120, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(205, 74, 120, 0)' },
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
        float: 'float 5s ease-in-out infinite',
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        shimmer: 'shimmer 2.8s linear infinite',
        marquee: 'marquee 40s linear infinite',
        progress: 'progress 3.8s linear forwards',
        pulseRing: 'pulseRing 2s ease-out infinite',
        gridPan: 'gridPan 14s linear infinite',
        pop: 'pop .35s cubic-bezier(.22,1,.36,1) both',
        shake: 'shake .3s ease',
      },
    },
  },
  plugins: [],
};
