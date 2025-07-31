import React from 'react';
import DraggableEditableText from '../DraggableEditableText';

const PhonePreview = React.forwardRef(({ 
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
  <div ref={ref} className="block w-full max-w-[375px] h-[700px] bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-white relative">
    <div className="h-full flex flex-col">
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative">
        <DraggableEditableText
          text={subtitle}
          placeholder="Sözümüze Hoşgeldiniz..."
          touched={subtitleTouched}
          onChange={onSubtitleChange}
          className={`mb-8 italic ${subtitleFont ? `font-${subtitleFont}` : 'font-sans'}`}
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
          className={`font-bold mb-8 ${titleFont ? `font-${titleFont}` : 'font-sans'}`}
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
          className={`${altFont ? `font-${altFont}` : 'font-sans'} mb-8`}
          style={{ color: altColor, fontSize: altTextSize }}
          size={altTextSize}
          onSizeChange={onAltTextSizeChange}
          pos={altTextPos}
          onPosChange={onAltTextPosChange}
          centerX
        />
      </div>
      <div className="p-4 text-center border-t">
        <p className="text-xs text-gray-500">
          {slug ? `${window.location.origin}/${slug}` : 'sayfa-url.com/slug'}
        </p>
      </div>
    </div>
  </div>
));

export default PhonePreview;
