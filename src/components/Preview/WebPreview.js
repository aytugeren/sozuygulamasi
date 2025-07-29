import React from 'react';

const WebPreview = ({
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
  <div className="flex flex-col w-full max-w-xl h-[600px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
    <div className="bg-gray-100 flex items-center px-4 py-2 space-x-1 border-b">
      <span className="w-3 h-3 bg-red-500 rounded-full" />
      <span className="w-3 h-3 bg-yellow-500 rounded-full" />
      <span className="w-3 h-3 bg-green-500 rounded-full" />
      <p className="flex-1 text-xs text-gray-500 text-center">
        {slug ? `${window.location.origin}/${slug}` : 'sayfa-url.com/slug'}
      </p>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center text-center px-10 relative">
      <p
        className={`italic text-xl mb-4 ${subtitleFont ? `font-${subtitleFont}` : 'font-sans'}`}
        style={{ color: subtitleColor }}
      >
        {subtitle || 'Sözümüze Hoşgeldiniz...'}
      </p>
      <h1
        className={`text-5xl font-bold mb-3 ${titleFont ? `font-${titleFont}` : 'font-sans'}`}
        style={{ color: titleColor }}
      >
        {title || 'Burcu & Fatih'}
      </h1>
      <p
        className={`text-base mt-4 ${altFont ? `font-${altFont}` : 'font-sans'}`}
        style={{ color: altColor }}
      >
        {altText || 'Bizimkisi bir aşk hikayesi..'}
      </p>
      <svg
        className="w-8 h-8 text-gray-500 absolute bottom-4 animate-bounce"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

export default WebPreview;
