import { useMemo } from 'react';
import { 
  getAllFonts, 
  getFontById, 
  getFontsByCategory, 
  getFontOptions, 
  getFontCategories,
  DEFAULT_FONTS 
} from '../config/fonts';

// Font sistemini kullanan React hook'u
export const useFonts = () => {
  const fonts = useMemo(() => getAllFonts(), []);
  const categories = useMemo(() => getFontCategories(), []);
  const options = useMemo(() => getFontOptions(), []);

  // Font ID'sine göre font bilgisini al
  const getFont = (fontId) => {
    return getFontById(fontId);
  };

  // Kategoriye göre fontları al
  const getFontsInCategory = (category) => {
    return getFontsByCategory(category);
  };

  // Font seçeneklerini al (dropdown için)
  const getOptions = () => {
    return options;
  };

  // Kategoriye göre font seçeneklerini al
  const getOptionsByCategory = (category) => {
    const categoryFonts = getFontsInCategory(category);
    return categoryFonts.map(font => ({
      value: font.id,
      label: `${font.emoji} ${font.name} (${font.category})`
    }));
  };

  // Font class'ını al (Tailwind için)
  const getFontClass = (fontId) => {
    const font = getFont(fontId);
    return font ? `font-${fontId}` : 'font-sans';
  };

  // Font style'ını al (inline style için)
  const getFontStyle = (fontId) => {
    const font = getFont(fontId);
    return font ? {
      fontFamily: `'${font.name}', ${font.fallback}`
    } : {};
  };

  // Varsayılan fontları al
  const getDefaultFonts = () => {
    return DEFAULT_FONTS;
  };

  return {
    fonts,
    categories,
    options,
    getFont,
    getFontsInCategory,
    getOptions,
    getOptionsByCategory,
    getFontClass,
    getFontStyle,
    getDefaultFonts
  };
}; 