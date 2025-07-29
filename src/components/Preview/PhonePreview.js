import React from 'react';

const PhonePreview = ({
  slug,
  title,
  subtitle,
  altText,
  titleFont,
  titleColor,
  subtitleFont,
  subtitleColor,
  altFont,
  altColor
}) => (
  <div className="block w-full max-w-[320px] h-[600px] bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-white">
    <div className="h-full flex flex-col">
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <p
          className={`text-sm mb-8 italic ${subtitleFont ? `font-${subtitleFont}` : 'font-sans'}`}
          style={{ color: subtitleColor }}
        >
          {subtitle || 'Sözümüze Hoşgeldiniz...'}
        </p>
        <h1
          className={`text-3xl font-bold mb-8 ${titleFont ? `font-${titleFont}` : 'font-sans'}`}
          style={{ color: titleColor }}
        >
          {title || 'Burcu & Fatih'}
        </h1>
        <p
          className={`text-sm mb-8 ${altFont ? `font-${altFont}` : 'font-sans'}`}
          style={{ color: altColor }}
        >
          {altText || 'Bizimkisi bir aşk hikayesi..'}
        </p>
      </div>
      <div className="p-4 text-center border-t">
        <p className="text-xs text-gray-500">
          {slug ? `${window.location.origin}/${slug}` : 'sayfa-url.com/slug'}
        </p>
      </div>
    </div>
  </div>
);

export default PhonePreview;
