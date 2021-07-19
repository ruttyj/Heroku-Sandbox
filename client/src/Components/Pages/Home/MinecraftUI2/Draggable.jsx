import React, { useEffect } from 'react';
import { useDroppableContext } from './State';
import { useOnUnmount } from 'react-hookedup';

export default function({children, dragItem}) {

  const {
    internalizeDragItem,
    removeDragItem,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
  } = useDroppableContext();

  // Store drag item in context
  useEffect(() => {
    internalizeDragItem(dragItem);
    console.log('internalizeDragItem');
  }, [dragItem]);

  // Remove drag item from context
  useOnUnmount(() => {
    removeDragItem(dragItem);
  })
 
  return <>
    <div 
      className="draggable" 
      style={{
        backgroundColor: '#ffffff55',
        touchAction: 'none',
      }}
      onMouseDown={(e) => onMouseDown(e, {dragItem})}
      onTouchStart={(e) => onTouchStart(e, {dragItem})}
      onTouchMove={(e) => onTouchMove(e, {dragItem})}
      onTouchEnd={(e) => onTouchEnd(e, {dragItem})}
    >
      <div 
        className="noselect" 
        style={{pointerEvents: "none"}}
      >
        {children}
      </div>
    </div>
  </>
}

