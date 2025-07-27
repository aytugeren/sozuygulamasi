// Font Konfigürasyon Sistemi
// Bu dosya tüm font bilgilerini merkezi olarak yönetir

export const FONT_CATEGORIES = {
  ROMANTIC: 'romantic',
  ELEGANT: 'elegant', 
  MODERN: 'modern',
  DECORATIVE: 'decorative',
  HANDWRITING: 'handwriting'
};

export const FONTS = {
  // Romantik Fontlar
  [FONT_CATEGORIES.ROMANTIC]: [
    {
      id: 'romantic',
      name: 'Great Vibes',
      category: 'Romantik',
      emoji: '💕',
      googleFont: 'Great+Vibes',
      fallback: 'cursive',
      description: 'Klasik romantik font'
    },
    {
      id: 'romantic2',
      name: 'Dancing Script',
      category: 'Romantik',
      emoji: '💝',
      googleFont: 'Dancing+Script:wght@400;700',
      fallback: 'cursive',
      description: 'Zarif el yazısı'
    },
    {
      id: 'romantic3',
      name: 'Pacifico',
      category: 'Romantik',
      emoji: '🌸',
      googleFont: 'Pacifico',
      fallback: 'cursive',
      description: 'Yumuşak ve sıcak'
    },
    {
      id: 'romantic4',
      name: 'Satisfy',
      category: 'Romantik',
      emoji: '🌹',
      googleFont: 'Satisfy',
      fallback: 'cursive',
      description: 'Doğal ve samimi'
    }
  ],

  // Klasik Fontlar
  [FONT_CATEGORIES.ELEGANT]: [
    {
      id: 'elegant',
      name: 'Playfair Display',
      category: 'Klasik',
      emoji: '📜',
      googleFont: 'Playfair+Display:wght@400;700;900',
      fallback: 'serif',
      description: 'Zarif serif font'
    },
    {
      id: 'elegant2',
      name: 'Cormorant Garamond',
      category: 'Klasik',
      emoji: '🏛️',
      googleFont: 'Cormorant+Garamond:wght@300;400;500;600;700',
      fallback: 'serif',
      description: 'Geleneksel klasik'
    },
    {
      id: 'elegant3',
      name: 'Libre Baskerville',
      category: 'Klasik',
      emoji: '📚',
      googleFont: 'Libre+Baskerville:wght@400;700',
      fallback: 'serif',
      description: 'Klasik serif'
    },
    {
      id: 'elegant4',
      name: 'Crimson Text',
      category: 'Klasik',
      emoji: '🎭',
      googleFont: 'Crimson+Text:wght@400;600;700',
      fallback: 'serif',
      description: 'Edebi ve zarif'
    }
  ],

  // Modern Fontlar
  [FONT_CATEGORIES.MODERN]: [
    {
      id: 'modern',
      name: 'Poppins',
      category: 'Modern',
      emoji: '⚡',
      googleFont: 'Poppins:wght@300;400;500;600;700',
      fallback: 'sans-serif',
      description: 'Temiz ve modern'
    },
    {
      id: 'modern2',
      name: 'Inter',
      category: 'Modern',
      emoji: '🚀',
      googleFont: 'Inter:wght@300;400;500;600;700',
      fallback: 'sans-serif',
      description: 'Okunabilir ve profesyonel'
    },
    {
      id: 'modern3',
      name: 'Roboto',
      category: 'Modern',
      emoji: '💻',
      googleFont: 'Roboto:wght@300;400;500;700',
      fallback: 'sans-serif',
      description: 'Google standart fontu'
    },
    {
      id: 'modern4',
      name: 'Open Sans',
      category: 'Modern',
      emoji: '🎯',
      googleFont: 'Open+Sans:wght@300;400;500;600;700',
      fallback: 'sans-serif',
      description: 'Açık ve net'
    }
  ],

  // Dekoratif Fontlar
  [FONT_CATEGORIES.DECORATIVE]: [
    {
      id: 'decorative',
      name: 'Abril Fatface',
      category: 'Dekoratif',
      emoji: '✨',
      googleFont: 'Abril+Fatface',
      fallback: 'cursive',
      description: 'Dramatik ve etkileyici'
    },
    {
      id: 'decorative2',
      name: 'Bebas Neue',
      category: 'Dekoratif',
      emoji: '🎨',
      googleFont: 'Bebas+Neue',
      fallback: 'cursive',
      description: 'Güçlü ve dikkat çekici'
    },
    {
      id: 'decorative3',
      name: 'Righteous',
      category: 'Dekoratif',
      emoji: '🔥',
      googleFont: 'Righteous',
      fallback: 'cursive',
      description: 'Enerjik ve dinamik'
    },
    {
      id: 'decorative4',
      name: 'Lobster',
      category: 'Dekoratif',
      emoji: '🦞',
      googleFont: 'Lobster',
      fallback: 'cursive',
      description: 'Eğlenceli ve renkli'
    }
  ],

  // El Yazısı Fontlar
  [FONT_CATEGORIES.HANDWRITING]: [
    {
      id: 'handwriting',
      name: 'Kalam',
      category: 'El Yazısı',
      emoji: '✍️',
      googleFont: 'Kalam:wght@300;400;700',
      fallback: 'cursive',
      description: 'Doğal el yazısı'
    },
    {
      id: 'handwriting2',
      name: 'Indie Flower',
      category: 'El Yazısı',
      emoji: '🌺',
      googleFont: 'Indie+Flower',
      fallback: 'cursive',
      description: 'Çiçekli ve zarif'
    },
    {
      id: 'handwriting3',
      name: 'Architects Daughter',
      category: 'El Yazısı',
      emoji: '🏠',
      googleFont: 'Architects+Daughter',
      fallback: 'cursive',
      description: 'Teknik el yazısı'
    },
    {
      id: 'handwriting4',
      name: 'Caveat',
      category: 'El Yazısı',
      emoji: '📝',
      googleFont: 'Caveat:wght@400;500;600;700',
      fallback: 'cursive',
      description: 'Modern el yazısı'
    }
  ]
};

// Tüm fontları düz bir array olarak al
export const getAllFonts = () => {
  return Object.values(FONTS).flat();
};

// Font ID'sine göre font bilgisini al
export const getFontById = (fontId) => {
  const allFonts = getAllFonts();
  return allFonts.find(font => font.id === fontId);
};

// Kategoriye göre fontları al
export const getFontsByCategory = (category) => {
  return FONTS[category] || [];
};

// Font seçeneklerini dropdown için formatla
export const getFontOptions = () => {
  return getAllFonts().map(font => ({
    value: font.id,
    label: `${font.emoji} ${font.name} (${font.category})`
  }));
};

// Tailwind CSS için font family mapping'i
export const getTailwindFontMapping = () => {
  const mapping = {};
  getAllFonts().forEach(font => {
    mapping[font.id] = [`'${font.name}'`, font.fallback];
  });
  return mapping;
};

// Google Fonts URL'lerini al
export const getGoogleFontsUrls = () => {
  const fonts = getAllFonts();
  return fonts.map(font => 
    `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`
  );
};

// Varsayılan fontlar
export const DEFAULT_FONTS = {
  title: 'romantic',
  subtitle: 'sans',
  altText: 'sans'
};

// Font kategorilerini al
export const getFontCategories = () => {
  return Object.keys(FONTS).map(category => ({
    id: category,
    name: FONTS[category][0]?.category || category,
    count: FONTS[category].length
  }));
}; 