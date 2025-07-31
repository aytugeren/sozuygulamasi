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
  size,
  onSizeChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState(false);
  const [position, setPosition] = useState(pos);
  const start = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!wrapperRef.current?.contains(e.target)) {
        setSelected(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setPosition(pos);
  }, [pos]);

  const handleMouseDown = (e) => {
    if (editing) return;
    setSelected(true);
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
      ref={wrapperRef}
      onMouseDown={handleMouseDown}
      onClick={() => setSelected(true)}
      onDoubleClick={() => {
        setEditing(true);
        setSelected(true);
      }}
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
      className={`${className} relative ${selected ? 'outline outline-1 outline-dashed outline-blue-500' : ''}`}
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
      {selected && !editing && (
        <span className="absolute -top-5 right-0 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSizeChange?.((size || parseInt(style?.fontSize) || 0) + 2);
            }}
            className="bg-white border rounded text-xs px-1"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSizeChange?.(Math.max((size || parseInt(style?.fontSize) || 0) - 2, 1));
            }}
            className="bg-white border rounded text-xs px-1"
          >
            -
          </button>
        </span>
      )}
    </span>
  );
};

export default DraggableEditableText;


