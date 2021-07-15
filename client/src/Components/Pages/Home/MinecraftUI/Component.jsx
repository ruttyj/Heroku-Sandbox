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


const Droppable = function({itemId, children, onTouchMove, onMouseUp, onMouseDown}) {
  const { 
    hoveringId
  } = useDroppableContext();
  
  return <>
    <div className="droppable" data-id={itemId} style={{display: 'inline-block', ...(hoveringId == itemId ? {backgroundColor: "green"} : {})}}>
        <motion.div 
          key={itemId} 
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


const Grid = function({items, setItems=()=>{}, order, onItemRelease=()=>{}}) {
  const { 
    boundingBox,
    isGrabbing, setIsGrabbing,
    grabbingId, setGrabbingId,
    hoveringId, setHoveringId,

    isDragging, setIsDragging,
    dump, setDump,
  } = useDroppableContext();

  const grabItem = (id) => {
    console.log('grabItem');

    setIsGrabbing(true);
    setGrabbingId(id);
  }

  const releaseItem = (id) => {
    console.log('releaseItem');
    setIsGrabbing(false);
    onItemRelease(grabbingId, id);
    setGrabbingId(null);
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

  let contents = [];
  contents = order.map(itemId => {
    let item = items[itemId];
    return <>
      <Droppable 
        key={itemId} 
        itemId={itemId}
        onMouseDown={() => {
          if(!isDragging && !isGrabbing) {
            setIsDragging(true);
            grabItem(itemId);
          }
        }}
        onMouseUp={() => {
          setIsDragging(false);
          console.log('mouse up', itemId);
          if (isGrabbing && itemId !== grabbingId) {
            releaseItem(itemId);
          } else if(isDragging && itemId !== grabbingId) {
            releaseItem(itemId);
          } else if (!isDragging) {
            releaseItem(itemId);
          }
        }}
    
        onTouchMove={(e) => {
          const touch = e.touches[0];
          onMouseMove(touch);
        }}
        
      >
        {item.children}
      </Droppable>
    </>
  });



  let hoverPosLeft = 0;
  let hoverPosTop = 0;
  if (dump && dump.pos) {
    hoverPosLeft = dump.pos.x;
    hoverPosTop  = dump.pos.y;
  }

  return <div className="full column" >
    <div>
      {isGrabbing ? 'grabbing' : 'not grabbing'} {grabbingId}<br/>
      {isDragging ? 'Dragging' : 'not Dragging'}<br/>
    </div>
    <div ref={boundingBox} className="full " style={{display: 'block', position: 'relative'}} onMouseMove={onMouseMove}>
      {isGrabbing && <>
        <div style={{position: "absolute", top: hoverPosTop || 0, left: hoverPosLeft || 0, pointerEvents: "none"}} className="noselect" >{items[grabbingId].children}</div>
      </>}
      {contents}
    </div>
  </div>;
}




///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function({children}) {


  const [dropZones, setDropZones] = useState({
    0: {
      dropItemId: 0,
    },
    1: {
      dropItemId: 1,
    },
    2: {
      dropItemId: 2,
    },
  })

  const [items, setItems] = useState({
    0: {
      children: <Square>0</Square>
    },
    1: {
      children: <Square>1</Square>
    },
    2: {
      children: <Square>2</Square>
    },
  });
  const [order, setOrder] = useState([0, 1, 2]);

  const onItemRelease = (firstId, lastId) => {
    let firstIndex = order.indexOf(firstId);
    let lastIndex = order.indexOf(lastId);

    let newOrder = [...order]; 
    newOrder[firstIndex] = lastId;
    newOrder[lastIndex] = firstId;
    setOrder(newOrder);
  }


  //const order = Object.keys(items);

  return <>
    <DroppableArena>
      <Grid
        items={items}
        order={order}
        dropZones={dropZones}
        setDropZones={setDropZones}
        onItemRelease={onItemRelease}
      />
    </DroppableArena>
  </>
}