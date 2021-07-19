import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { useDroppableContext } from './State';

export default function({dropZone, onDrop, children}) {
  const {
    internalizeDropZone,
    getHoveringId,
  } = useDroppableContext();
  
  let isHovering;
  const hoveringId = getHoveringId();
  const dropZoneId = dropZone.id;
  isHovering = hoveringId !== null && hoveringId == dropZoneId;

  useEffect(() => {
    internalizeDropZone(dropZone, onDrop)
  }, [dropZone, onDrop]);
  
  return <>
    <div 
      className="droppable" 
      data-id={dropZoneId} 
      style={{display: 'inline-block', ...(isHovering ? {backgroundColor: "green"} : {})}}
    >
        <motion.div 
          key={dropZoneId} 
          className="noselect" 
          style={{display: 'inline-block', width: '50px', height: '50px', backgroundColor: '#00000063', margin: '5px'}}
        >
          {children}
      </motion.div>
    </div>
  </>;
}
