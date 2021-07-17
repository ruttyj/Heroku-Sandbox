import React from 'react';
import { motion } from "framer-motion";
import { useDroppableContext } from './State';

export default function({dropZone, children, onTouchMove, onMouseDown, onDrop}) {
  const {
    grabbingFromZoneId,
    getHoveringId,
    onMouseUp,
    onMouseMove,
  } = useDroppableContext();
  
  let hoveringId = getHoveringId();
  const dropZoneId = dropZone.id;
  return <>
    <div className="droppable" data-id={dropZoneId} style={{display: 'inline-block', ...(hoveringId !== null && hoveringId == dropZoneId ? {backgroundColor: "green"} : {})}}>
        <motion.div 
          key={dropZoneId} 
          onMouseDown={onMouseDown}
          onMouseUp={(e) => onMouseUp(e, {dropZoneId, dropZone, onDrop, grabbingFromZoneId})}
          onTouchMove={onTouchMove}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            onMouseMove(touch);
          }}
          className="noselect" 
          style={{display: 'inline-block', width: '50px', height: '50px', backgroundColor: '#00000063', margin: '5px'}}
        >
          {children}
      </motion.div>
    </div>
  </>;
}
