/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-plum': '#9F6D90',
        'theme-blue': '#3D84A8',
        'theme-light-plum': '#B9A6B2',
        'theme-light-blue': '#7CB3CF', 
        'theme-extralight-plum': '#ccc2c8',
        'theme-extralight-blue': '#c3dce8', 
      },
    },
  },
  plugins: [],
}
