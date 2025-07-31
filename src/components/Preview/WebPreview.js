import React from 'react';
import DraggableEditableText from '../DraggableEditableText';

const WebPreview = React.forwardRef(({ 
  slug,
  title,
  subtitle,
  altText,
  titleFont,
  titleColor,
  titleSize,
  subtitleFont,
  subtitleColor,
  subtitleSize,
  altFont,
  altColor,
  altTextSize,
  onTitleSizeChange,
  onSubtitleSizeChange,
  onAltTextSizeChange,
  titleTouched,
  subtitleTouched,
  altTextTouched,
  onTitleChange,
  onSubtitleChange,
  onAltTextChange,
  titlePos,
  subtitlePos,
  altTextPos,
  onTitlePosChange,
  onSubtitlePosChange,
  onAltTextPosChange,
}, ref) => (
  <div ref={ref} className="flex flex-col w-full max-w-[640px] h-[720px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
    <div className="bg-gray-100 flex items-center px-4 py-2 space-x-1 border-b">
      <span className="w-3 h-3 bg-red-500 rounded-full" />
      <span className="w-3 h-3 bg-yellow-500 rounded-full" />
      <span className="w-3 h-3 bg-green-500 rounded-full" />
      <p className="flex-1 text-xs text-gray-500 text-center">
        {slug ? `${window.location.origin}/${slug}` : 'sayfa-url.com/slug'}
      </p>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center text-center px-10 relative">
      <DraggableEditableText
        text={subtitle}
        placeholder="Sözümüze Hoşgeldiniz..."
        touched={subtitleTouched}
        onChange={onSubtitleChange}
        className={`italic mb-4 ${subtitleFont ? `font-${subtitleFont}` : 'font-sans'}`}
        style={{ color: subtitleColor, fontSize: subtitleSize }}
        size={subtitleSize}
        onSizeChange={onSubtitleSizeChange}
        pos={subtitlePos}
        onPosChange={onSubtitlePosChange}
        centerX
      />
      <DraggableEditableText
        text={title}
        placeholder="Burcu & Fatih"
        touched={titleTouched}
        onChange={onTitleChange}
        className={`font-bold mb-3 ${titleFont ? `font-${titleFont}` : 'font-sans'}`}
        style={{ color: titleColor, fontSize: titleSize }}
        size={titleSize}
        onSizeChange={onTitleSizeChange}
        pos={titlePos}
        onPosChange={onTitlePosChange}
        centerX
      />
      <DraggableEditableText
        text={altText}
        placeholder="Bizimkisi bir aşk hikayesi.."
        touched={altTextTouched}
        onChange={onAltTextChange}
        className={`${altFont ? `font-${altFont}` : 'font-sans'} mt-4`}
        style={{ color: altColor, fontSize: altTextSize }}
        size={altTextSize}
        onSizeChange={onAltTextSizeChange}
        pos={altTextPos}
        onPosChange={onAltTextPosChange}
        centerX
      />
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
));

export default WebPreview;
