import React, { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useGlobalContext  } from "../../../../state/globalContext";
import DragListV from "../../../Containers/DragListV/index";
import { setNestedValue } from '../../../../Utils/index';
import move from "array-move";

import { useDroppableContext, DroppableContextProvider } from './State';

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
    hoveringId
  } = useDroppableContext();
  
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

const Draggable = function({item, onMouseDown}) {
  const itemId = item.id;
  return <>
    <div 
      className="draggable" 
      style={{
        backgroundColor: '#ffffff55',
      }}
      onMouseDown={onMouseDown}
    >
      {item.children}
    </div>
  </>
}

const Grid = function() {
  const { 
    boundingBox,
    isGrabbing, setIsGrabbing,
    grabbingId, setGrabbingId,
    hoveringId, setHoveringId,

    isDragging, setIsDragging,
    dump, setDump,
  } = useDroppableContext();

  const [dropZones, setDropZones] = useState({
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
  })
  const [dropZoneOrder, setDropDoneOrder] = useState([0, 1, 2, 3]);

  const [items, setItems] = useState({
    0: {
      id: 0,
      children: <Square>0</Square>
    },
    1: {
      id: 1,
      children: <Square>1</Square>
    },
    2: {
      id: 2,
      children: <Square>2</Square>
    },
  });
  const [order, setOrder] = useState([0, 1, 2]);

  const onItemRelease = (firstId, lastId) => {
    let newDropZones = {...dropZones};

    //newDropZones[firstIndex].dragItemId = lastId;
    //newDropZones[lastIndex].dragItemId = firstId;
    setDropZones(newDropZones);
  }

  const grabItem = (id) => {
    console.log('grabItem');

    setIsGrabbing(true);
    setGrabbingId(id);
  }

  const releaseItem = ({dropZone, dragItem}) => {
    console.log('releaseItem');
    setIsGrabbing(false);
    //onItemRelease(grabbingId, id);
    console.log({dropZone, dragItem})
    if(dropZone) {
      dropZones[dropZone.id].dragItemId = dragItem.id;
    }

    setGrabbingId(undefined);
  }

  const onMouseMove = (e) => {
    const offset = boundingBox.current.getBoundingClientRect()
    
    if(isGrabbing){
      const hoverElement = document.elementFromPoint(e.clientX, e.clientY);

      const closestDroppable = hoverElement.closest('.droppable');

      if(closestDroppable) {
        setHoveringId(closestDroppable.dataset.id)
      } else {
        setHoveringId(null);
      }

      setDump({
        pos: {
          x: Math.max(offset.left, Math.min(e.clientX, offset.right))-offset.left,
          y: Math.max(offset.top, Math.min(e.clientY-20, offset.bottom))-offset.top,
        }
      });
    } else if(hoveringId) {
      setHoveringId(null);
    }
  }

  let droppableContents = [];
  droppableContents = dropZoneOrder.map(dropZoneId => {
    const dropZone = dropZones[dropZoneId];
    
    const itemId = dropZone.dragItemId;
    

    let onMouseDown = () => {
      if(!isDragging && !isGrabbing) {
        setIsDragging(true);
        grabItem(itemId);
      }
    }

    let contents = null;
    let item = items[itemId];
    if (item) {
      contents = <>
        <Draggable item={item} onMouseDown={onMouseDown}>
          {item.children}
        </Draggable>
      </>
    }
    return <Droppable 
      key={dropZoneId} 
      dropZoneId={dropZoneId}
      onMouseUp={() => {
        setIsDragging(false);
        
        if(isGrabbing) {
          const newDropZones = {...dropZones};
          if(itemId) {
            console.log('has item', itemId);

            let dzList = Object.keys(dropZones).map(dzId => dropZones[dzId])

            console.log({dzList, grabbingId})
            newDropZones[dropZoneId].dragItemId = grabbingId;

          } else {
            console.log('no item', grabbingId);
  
            newDropZones[dropZoneId].dragItemId = grabbingId;
          }

          setDropZones(newDropZones);
          setIsGrabbing(false);
          setGrabbingId(null);
        }
       
        /*
        console.log('mouse up', itemId);
        if (isGrabbing && itemId !== grabbingId) {
          releaseItem({dropZone, dragItem: items[grabbingId]});
        } else if(isDragging && itemId !== grabbingId) {
          releaseItem({dropZone, dragItem: item});
        } else if (!isDragging) {
          releaseItem({dropZone, dragItem: item});
        }
        */
      }}
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
  if (dump && dump.pos) {
    hoverPosLeft = dump.pos.x;
    hoverPosTop  = dump.pos.y;
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