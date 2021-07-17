import React from 'react';
import { useDroppableContext } from './State';

export default function({item, children, dropZone, onMouseDown=null}) {

  const {
    onMouseMove,
    setIsDragging, getIsDragging,
    setIsGrabbing, getIsGrabbing,
    setGrabbingFromZone,
    setGrabbingId, 
  } = useDroppableContext();

  const grabItem = (id) => {
    setIsGrabbing(true);
    setGrabbingId(id);
  }

  if(!onMouseDown) {
    onMouseDown = (e) => {
      if(!getIsDragging() && !getIsGrabbing()) {
        grabItem(item.id);
        setIsDragging(true);
        if(dropZone) {
          setGrabbingFromZone(dropZone.id);
        }
      }
      onMouseMove(e);
    }
  }

  return <>
    <div 
      className="draggable" 
      style={{
        backgroundColor: '#ffffff55',
      }}
      onMouseDown={onMouseDown}
    >
      <div style={{pointerEvents: "none"}} className="noselect">
        {children}
      </div>
    </div>
  </>
}

