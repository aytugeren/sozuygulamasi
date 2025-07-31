import React, { useState, useEffect } from 'react';

const DraggableText = ({ children, style, className, pos = { x: 0, y: 0 }, onPosChange, ...rest }) => {
  const [internalPos, setInternalPos] = useState(pos);

  useEffect(() => {
    setInternalPos(pos);
  }, [pos]);

  const startDrag = (clientX, clientY) => {
    const startX = clientX - internalPos.x;
    const startY = clientY - internalPos.y;

    const onMove = (moveEvent) => {
      const x = moveEvent.clientX !== undefined ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const y = moveEvent.clientY !== undefined ? moveEvent.clientY : moveEvent.touches[0].clientY;
      const newPos = { x: x - startX, y: y - startY };
      setInternalPos(newPos);
      if (onPosChange) onPosChange(newPos);
    };

    const endMove = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', endMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', endMove);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', endMove);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', endMove);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ position: 'relative', left: internalPos.x, top: internalPos.y, cursor: 'move', ...style }}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
};

export default DraggableText;
