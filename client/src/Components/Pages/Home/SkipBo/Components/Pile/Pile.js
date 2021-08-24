
import React, { useState } from 'react';
import { motion, useMotionValue } from "framer-motion";

export default function Pile({children, color='#0871bc'}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);


  function getDropZoneByCoord(x, y) {
    const hoverElement = document.elementFromPoint(x, y);
    const closestDroppable = hoverElement.closest('.droppable');

    if (closestDroppable && closestDroppable.dataset) {
      console.log('closestDroppable', closestDroppable);
    }

    return null;
  }
  const [hsh, setHash] = useState(0);

  const onDragEnd = (e, info) => {
  
    x.set(0);
    y.set(0);
    setHash(hsh+1);
    console.log(e);
    getDropZoneByCoord(e.clientX, e.clientY);
  }
  
  return <>
    <div
      className="droppable"
      style={{
        display: 'inline-block',
        height: '61px',
        width: '41px',
        backgroundColor: '#00000050',
        margin: "3px",
        content: "",
      }}
    >
      <motion.div 
        drag
        onPanEnd={onDragEnd}
        dragMomentum={false}
        style={{
          x,
          y,
          display: 'inline-block',
          height: '55px',
          width: '35px',
          backgroundColor: color,
          margin: "3px",
          content: "",
      }}>
        {children}
      </motion.div>
    </div>
  </>
}
