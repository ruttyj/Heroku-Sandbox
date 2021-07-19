import React from 'react';
import { NotFoundError } from 'rxjs';
import { useDroppableContext } from './State';

export default function({item, dropZones, children, dropZone, onMouseDown=null}) {

  const {
    onMouseMove,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
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

  const onDrop = () => {
    console.log('on drop')
  }

  return <>
    <div 
      className="draggable" 
      style={{
        backgroundColor: '#ffffff55',
      }}
      onMouseDown={onMouseDown}
      onTouchStart={(e) => {onTouchStart(e, {item, dropZone, dropZones})}}
      onTouchMove={(e) => {onTouchMove(e, {item, dropZone, dropZones})}}
      onTouchEnd={(e) => {onTouchEnd(e, {item, dropZone, dropZones, onDrop})}}
    >
      <div style={{pointerEvents: "none"}} className="noselect">
        {children}
      </div>
    </div>
  </>
}

