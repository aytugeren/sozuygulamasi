import React, { useState, useRef, useEffect } from 'react';

const DraggableEditableText = ({
  text,
  onChange,
  className,
  style,
  pos = { x: 0, y: 0 },
  onPosChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [position, setPosition] = useState(pos);
  const start = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition(pos);
  }, [pos]);

  const handleMouseDown = (e) => {
    if (editing) return;
    start.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    const handleMouseMove = (e2) => {
      const newPos = {
        x: e2.clientX - start.current.x,
        y: e2.clientY - start.current.y,
      };
      setPosition(newPos);
      onPosChange?.(newPos);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <span
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setEditing(true)}
      style={{ position: 'absolute', left: position.x, top: position.y, cursor: editing ? 'text' : 'move', ...style }}
      className={className}
    >
      {editing ? (
        <input
          value={text}
          autoFocus
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          className="border border-gray-300 rounded px-1"
        />
      ) : (
        text
      )}
    </span>
  );
};

export default DraggableEditableText;


