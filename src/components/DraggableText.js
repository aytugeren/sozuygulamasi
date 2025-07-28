import React, { useState } from 'react';

const DraggableText = ({ children, style, className, ...rest }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const startDrag = (clientX, clientY) => {
    const startX = clientX - pos.x;
    const startY = clientY - pos.y;

    const onMove = (moveEvent) => {
      const x = moveEvent.clientX !== undefined ? moveEvent.clientX : moveEvent.touches[0].clientX;
      const y = moveEvent.clientY !== undefined ? moveEvent.clientY : moveEvent.touches[0].clientY;
      setPos({ x: x - startX, y: y - startY });
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
      style={{ position: 'relative', left: pos.x, top: pos.y, cursor: 'move', ...style }}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
};

export default DraggableText;
