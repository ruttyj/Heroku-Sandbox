import React, { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useGlobalContext  } from "../../../../state/globalContext";
import DragListV from "../../../Containers/DragListV/index";
import { setNestedValue } from '../../../../Utils/index';
import move from "array-move";

import { useDroppableContext, DroppableContextProvider } from './State';
import { ConnectableObservable } from 'rxjs';

///////////////////////////////////////////////////////////////////
//                           Wrapper
///////////////////////////////////////////////////////////////////
const Wrapper = function({children}) {
  return <>
    <div className="full" style={{display:"block"}}>
      <div className="full column" style={{position: 'relative'}}>
        {children}
      </div>
    </div>
  </>
}

const Square = function ({children}) {
  return <>
    <motion.div 
      className="noselect" 
      style={{display: 'inline-block', width: '40px', height: '40px', backgroundColor: '#ffffff55', margin: '5px'}}
    >
      {children}
    </motion.div>
  </>
}

const DroppableArena = function({children}) {
  return <>
    <Wrapper>
      <DroppableContextProvider>
        {children}
      </DroppableContextProvider>
    </Wrapper>
  </>;
}


const Droppable = function({dropZoneId, children, onTouchMove, onMouseUp, onMouseDown}) {
  const {
    getHoveringId,
  } = useDroppableContext();
  
  let hoveringId = getHoveringId();
  return <>
    <div className="droppable" data-id={dropZoneId} style={{display: 'inline-block', ...(hoveringId !== null && hoveringId == dropZoneId ? {backgroundColor: "green"} : {})}}>
        <motion.div 
          key={dropZoneId} 
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchMove={onTouchMove}
          className="noselect" 
          style={{display: 'inline-block', width: '50px', height: '50px', backgroundColor: '#00000063', margin: '5px'}}
        >
          {children}
      </motion.div>
    </div>
  </>;
}

const Draggable = function({item, zone, onMouseDown}) {
  const itemId = item.id;
  return <>
    <div 
      className="draggable" 
      style={{
        backgroundColor: '#ffffff55',
      }}
      onMouseDown={onMouseDown}
    >
      <div style={{pointerEvents: "none"}} className="noselect">
        {item.children}
      </div>
    </div>
  </>
}


const initialDropZones = {
  0: {
    id: 0,
    dragItemId: null,
  },
  1: {
    id: 1,
    dragItemId: null,
  },
  2: {
    id: 2,
    dragItemId: null,
  },
  3: {
    id: 3,
    dragItemId: null,
  },
  4: {
    id: 4,
    dragItemId: null,
  },
}
const initialDropZoneOrder = Object.keys(initialDropZones);


const initialDragItems = {
  1: {
    id: 1,
    children: <img src="/assets/cards/cash_1.png" style={{width: '33px', height: '50px'}}/>
  },
  2: {
    id: 2,
    children: <img src="/assets/cards/cash_2.png" style={{width: '33px', height: '50px'}}/>
  },
  3: {
    id: 3,
    children: <img src="/assets/cards/cash_3.png" style={{width: '33px', height: '50px'}}/>
  },
  4: {
    id: 4,
    children: <img src="/assets/cards/cash_4.png" style={{width: '33px', height: '50px'}}/>
  },
  5: {
    id: 5,
    children: <img src="/assets/cards/cash_5.png" style={{width: '33px', height: '50px'}}/>
  },
  10: {
    id: 10,
    children: <img src="/assets/cards/cash_10.png" style={{width: '33px', height: '50px'}}/>
  },
}
const initialDragItemOrder = Object.keys(initialDragItems);





const Grid = function() {
  const {
    boundingBox,
    setIsGrabbing, getIsGrabbing,
    setGrabbingId, getGrabbingId,
    setGrabbingFromZone, getGrabbingFromZone,
    setHoveringId, getHoveringId,
    setIsDragging, getIsDragging,
    setCursorState, getCursorState,
  } = useDroppableContext();

  const isGrabbing = getIsGrabbing();
  const grabbingId = getGrabbingId();
  const grabbingFromZoneId = getGrabbingFromZone();
  const hoveringId = getHoveringId();
  const isDragging = getIsDragging();
  const cursorState = getCursorState();
  const [dropZones, setDropZones] = useState(initialDropZones)
  const [dropZoneOrder, setDropDoneOrder] = useState(initialDropZoneOrder);

  const [items, setItems] = useState(initialDragItems);
  const [order, setOrder] = useState(initialDragItemOrder);

  const grabItem = (id) => {
    console.log('grabItem');

    setIsGrabbing(true);
    setGrabbingId(id);
  }

  const onMouseMove = (e) => {
    const offset = boundingBox.current.getBoundingClientRect()
    
    
    // Set State for grid
    // Position of (primary cursor dragging item) 
    setCursorState({
      ...cursorState,
      pos: {
        x: Math.max(offset.left, Math.min(e.clientX, offset.right))-offset.left,
        y: Math.max(offset.top, Math.min(e.clientY-20, offset.bottom))-offset.top,
      }
    });

    if(isGrabbing){
      const hoverElement = document.elementFromPoint(e.clientX, e.clientY);
      const closestDroppable = hoverElement.closest('.droppable');
      if(closestDroppable) {
        setHoveringId(closestDroppable.dataset.id)
      } else {
        setHoveringId(null);
      }
    } else if(hoveringId) {
      setHoveringId(null);
    }
  }

  let droppableContents = [];
  droppableContents = dropZoneOrder.map(dropZoneId => {
    const dropZone = dropZones[dropZoneId];
    
    const itemId = dropZone.dragItemId;
    

    let onMouseDown = (e) => {
      if(!isDragging && !isGrabbing) {
        grabItem(itemId);
        setIsDragging(true);
        setGrabbingFromZone(dropZoneId);
      }
      onMouseMove(e);
    }

    let onMouseUp = () => {
      
      if(isDragging && grabbingFromZoneId === dropZoneId) {

      } else {
        if(isGrabbing) {
          const newDropZones = {...dropZones};
  
          if(grabbingFromZoneId !== null) {
            newDropZones[grabbingFromZoneId].dragItemId = null;
          }
  
          if(itemId) {
            console.log('has item', itemId);
            newDropZones[dropZoneId].dragItemId = grabbingId;
          } else {
            console.log('no item', grabbingId);
            newDropZones[dropZoneId].dragItemId = grabbingId;
          }
          
  
          console.log({grabbingFromZoneId, grabbingId});
          setDropZones(newDropZones);
          setIsGrabbing(false);
          setGrabbingId(null);
          setGrabbingFromZone(null);
        }
      }
      

      setIsDragging(false);
    }

    let contents = null;
    let item = items[itemId];
    if (item) {
      contents = <>
        <Draggable item={item} zone={dropZone} onMouseDown={onMouseDown}>
          {item.children}
        </Draggable>
      </>
    }
    return <Droppable 
      key={dropZoneId} 
      dropZoneId={dropZoneId}
      onMouseUp={onMouseUp}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        onMouseMove(touch);
      }}
    >
      {contents}
    </Droppable>
  });


  let draggableContents = [];
  draggableContents = order.map(itemId => {
    let item = items[itemId];
    
    let onMouseDown = () => {
      if(!isDragging && !isGrabbing) {
        setIsDragging(true);
        grabItem(itemId);
      }
    }

    return <>
      <Draggable item={item} onMouseDown={onMouseDown}>
        {item.children}
      </Draggable>
    </>;
  })

  let hoverPosLeft = 0;
  let hoverPosTop = 0;
  if (cursorState && cursorState.pos) {
    hoverPosLeft = cursorState.pos.x;
    hoverPosTop  = cursorState.pos.y;
  }

  return <div className="full column">
    <div>
      {isGrabbing ? 'grabbing' : 'not grabbing'} {grabbingId}<br/>
      {isDragging ? 'Dragging' : 'not Dragging'}<br/>
    </div>
    <div 
      ref={boundingBox} 
      className="full" 
      style={{
        display: 'block', 
        position: 'relative'
      }} 
      onMouseMove={onMouseMove}>
      {isGrabbing && <>
        <div 
          style={{
            position: "absolute", 
            top: hoverPosTop, 
            left: hoverPosLeft, 
            pointerEvents: "none"
          }} className="noselect"
        >
          {items[grabbingId].children}
        </div>
      </>}
      {droppableContents}
      {draggableContents}
    </div>
  </div>;
}




///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function({children}) {
  return <>
    <DroppableArena>
      <Grid/>
    </DroppableArena>
  </>
}