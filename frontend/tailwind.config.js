/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'furia-black-piano': '#000000',
        'furia-white-ice':   '#F0F0F0',
        'furia-gray':        '#2A2A2A',
        'furia-white':       '#FFFFFF',
      }
    },
  },
  plugins: [],
}
