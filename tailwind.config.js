module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Romantik fontlar
        romantic: ["'Great Vibes'", "cursive"],
        romantic2: ["'Dancing Script'", "cursive"],
        romantic3: ["'Pacifico'", "cursive"],
        romantic4: ["'Satisfy'", "cursive"],
        
        // Klasik fontlar
        elegant: ["'Playfair Display'", "serif"],
        elegant2: ["'Cormorant Garamond'", "serif"],
        elegant3: ["'Libre Baskerville'", "serif"],
        elegant4: ["'Crimson Text'", "serif"],
        
        // Modern fontlar
        modern: ["'Poppins'", "sans-serif"],
        modern2: ["'Inter'", "sans-serif"],
        modern3: ["'Roboto'", "sans-serif"],
        modern4: ["'Open Sans'", "sans-serif"],
        
        // Dekoratif fontlar
        decorative: ["'Abril Fatface'", "cursive"],
        decorative2: ["'Bebas Neue'", "cursive"],
        decorative3: ["'Righteous'", "cursive"],
        decorative4: ["'Lobster'", "cursive"],
        
        // Handwriting fontlar
        handwriting: ["'Kalam'", "cursive"],
        handwriting2: ["'Indie Flower'", "cursive"],
        handwriting3: ["'Architects Daughter'", "cursive"],
        handwriting4: ["'Caveat'", "cursive"],
        
        // Varsayılan
        sans: ["ui-sans-serif", "system-ui"],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}


