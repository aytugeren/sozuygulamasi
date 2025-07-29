import React from 'react';
import DraggableEditableText from '../DraggableEditableText';

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
  altColor,
  onTitleChange,
  onSubtitleChange,
  onAltTextChange,
  titlePos,
  subtitlePos,
  altTextPos,
  onTitlePosChange,
  onSubtitlePosChange,
  onAltTextPosChange,
}) => (
  <div className="block w-full max-w-[320px] h-[600px] bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-white relative">
    <div className="h-full flex flex-col">
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative">
        <DraggableEditableText
          text={subtitle || 'Sözümüze Hoşgeldiniz...'}
          onChange={onSubtitleChange}
          className={`text-sm mb-8 italic ${subtitleFont ? `font-${subtitleFont}` : 'font-sans'}`}
          style={{ color: subtitleColor }}
          pos={subtitlePos}
          onPosChange={onSubtitlePosChange}
        />
        <DraggableEditableText
          text={title || 'Burcu & Fatih'}
          onChange={onTitleChange}
          className={`text-3xl font-bold mb-8 ${titleFont ? `font-${titleFont}` : 'font-sans'}`}
          style={{ color: titleColor }}
          pos={titlePos}
          onPosChange={onTitlePosChange}
        />
        <DraggableEditableText
          text={altText || 'Bizimkisi bir aşk hikayesi..'}
          onChange={onAltTextChange}
          className={`text-sm mb-8 ${altFont ? `font-${altFont}` : 'font-sans'}`}
          style={{ color: altColor }}
          pos={altTextPos}
          onPosChange={onAltTextPosChange}
        />
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
