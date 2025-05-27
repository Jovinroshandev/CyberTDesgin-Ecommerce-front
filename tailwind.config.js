/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '360px',        // Extra small phones
        'sm': '640px',        // Small phones
        'md': '768px',        // Tablets (portrait)
        'md-lg': '900px',     // Tablets (landscape)
        'lg': '1024px',       // Laptops
        'xl': '1280px',       // Desktops
        '2xl': '1536px',      // Large desktops
        '3xl': '1920px',      // Full HD screens
        '4xl': '2560px',      // 2K and above
      },
    },
  },
  plugins: [],
}

