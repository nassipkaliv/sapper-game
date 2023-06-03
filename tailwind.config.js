module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      margin: {
        '1px' : '1px',
      },
      borderWidth: {
        0.5: '0.5px',
      },
      minWidth: {
        8: '2rem',
      },
      minHeight: {
        8: '2rem',
      },
    },
  },
  plugins: [],
};