import React from 'react';
import { useFonts } from '../hooks/useFonts';

const FontSelector = ({ 
  value, 
  onChange, 
  label, 
  placeholder = "Font seçin...",
  className = "",
  showCategory = true,
  showPreview = true 
}) => {
  const { getOptions, getFont } = useFonts();
  const options = getOptions();

  const selectedFont = getFont(value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {showPreview && selectedFont && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Önizleme:</p>
          <p 
            className={`text-lg ${showCategory ? selectedFont.category : ''}`}
            style={{ fontFamily: `'${selectedFont.name}', ${selectedFont.fallback}` }}
          >
            {selectedFont.name} - {selectedFont.description}
          </p>
        </div>
      )}
    </div>
  );
};

// Kategoriye göre font seçici
export const CategoryFontSelector = ({ 
  value, 
  onChange, 
  label, 
  category,
  className = "",
  showPreview = true 
}) => {
  const { getOptionsByCategory, getFont } = useFonts();
  const options = getOptionsByCategory(category);

  const selectedFont = getFont(value);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
      >
        <option value="">Font seçin...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {showPreview && selectedFont && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Önizleme:</p>
          <p 
            className="text-lg"
            style={{ fontFamily: `'${selectedFont.name}', ${selectedFont.fallback}` }}
          >
            {selectedFont.name} - {selectedFont.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default FontSelector; 