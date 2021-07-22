import React, { useEffect } from 'react';
import { motion } from "framer-motion";
import { useDroppableContext } from './State';

export default function({dropZone, onDrop, children, style={}}) {
  const {
    internalizeDropZone,
    getHoveringId,
  } = useDroppableContext();
  
  if(dropZone && dropZone.id) {
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
        style={{ ...style, ...(isHovering ? {backgroundColor: "green"} : {})}}
      >
          <motion.div 
            key={dropZoneId} 
            className="noselect" 
          >
            {children}
        </motion.div>
      </div>
    </>;
  } else 
    return <>
      Please pass a valid dropZone item
    </>
}
