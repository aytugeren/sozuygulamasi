import React, { useState, useRef, useEffect } from 'react';

const DraggableEditableText = ({
  text,
  onChange,
  className,
  style,
  pos = { x: 0, y: 0 },
  onPosChange,
  centerX = false,
  placeholder = '',
  touched = false,
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

  const isDefault = position.x === 0 && position.y === 0;

  return (
    <span
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setEditing(true)}
      style={{
        position: 'absolute',
        left: centerX ? position.x : isDefault ? '50%' : position.x,
        top: isDefault ? '50%' : position.y,
        transform: [
          centerX && 'translateX(-50%)',
          isDefault && 'translateY(-50%)',
          !centerX && isDefault && 'translateX(-50%)',
        ]
          .filter(Boolean)
          .join(' '),
        cursor: editing ? 'text' : 'move',
        ...style,
      }}
      className={className}
    >
      {editing ? (
        <input
          value={text}
          placeholder={placeholder}
          autoFocus
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          className="border border-gray-300 rounded px-1"
        />
      ) : (
        text || (!touched && placeholder)
      )}
    </span>
  );
};

export default DraggableEditableText;


