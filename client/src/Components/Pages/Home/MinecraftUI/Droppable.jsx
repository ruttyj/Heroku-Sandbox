import React from 'react';
import { motion } from "framer-motion";
import { useDroppableContext } from './State';

export default function({dropZone, children, onTouchMove, onMouseDown, onDrop}) {
  const {
    grabbingFromZoneId,
    getHoveringId,
    onMouseUpWithinZone,
    
  } = useDroppableContext();
  
  const onTest = () => {
    console.log('onTest')
  }

  let hoveringId = getHoveringId();
  const dropZoneId = dropZone.id;
  return <>
    <div 
      className="droppable" 
      data-id={dropZoneId} 
      style={{display: 'inline-block', ...(hoveringId !== null && hoveringId == dropZoneId ? {backgroundColor: "green"} : {})}}
      onTest={onTest}
    >
        <motion.div 
          key={dropZoneId} 
          onMouseDown={onMouseDown}
          onMouseUp={(e) => onMouseUpWithinZone(e, {
            dropZoneId, dropZone, 
            onDrop, 
            grabbingFromZoneId
          })}
          className="noselect" 
          style={{display: 'inline-block', width: '50px', height: '50px', backgroundColor: '#00000063', margin: '5px'}}
        >
          {children}
      </motion.div>
    </div>
  </>;
}
