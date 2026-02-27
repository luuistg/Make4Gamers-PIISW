/** @type {import('tailwindcss').Config} */
module.exports = {
  // Busca clases en App.js y cualquier archivo dentro de src/ (si creas esa carpeta)
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}" // Si tienes carpeta components en la raíz
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
