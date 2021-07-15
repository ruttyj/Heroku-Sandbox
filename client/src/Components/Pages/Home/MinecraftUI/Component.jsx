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


const DroppableArena = function() {
  return <>

  </>;
}


const Droppable = function({itemId, children}) {
  const { 
    boundingBox,
    isGrabbing, setIsGrabbing,
    grabbingId, setGrabbingId,
    isHoveringOverItem, setIsHoveringOverItem,
    hoveringId, setHoveringId,

    isDragging, setIsDragging,
    dump, setDump,
  } = useDroppableContext();
  
  return <>

  </>;
}


const Grid = function({items, setItems=()=>{}, order, setOrder=()=>{}}) {
  const { 
    boundingBox,
    isGrabbing, setIsGrabbing,
    grabbingId, setGrabbingId,
    isHoveringOverItem, setIsHoveringOverItem,
    hoveringId, setHoveringId,

    isDragging, setIsDragging,
    dump, setDump,
  } = useDroppableContext();


  const onItemRelease = (firstId, lastId) => {
    let firstIndex = order.indexOf(firstId);
    let lastIndex = order.indexOf(lastId);

    let newOrder = [...order]; 
    newOrder[firstIndex] = lastId;
    newOrder[lastIndex] = firstId;
    setOrder(newOrder);
  }

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


  const onClick = (...props) => {
    console.log('onClick', isGrabbing);

    if(!isGrabbing) {
      grabItem(...props)
    } else {
      releaseItem(...props)
    }
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
      <div className="droppable" data-id={itemId} style={{display: 'inline-block', ...(hoveringId == itemId ? {backgroundColor: "green"} : {})}}>
        <motion.div 
          key={itemId} 
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
          className="noselect" 
          style={{display: 'inline-block', width: '50px', height: '50px', backgroundColor: '#00000063', margin: '5px'}}
        >
          {item.children}
        </motion.div>
      </div>
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

///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function({children}) {
  const [items, setItems] = useState({
    0: {
      children: <Square>0</Square>
    },
    1: {
      children: <Square>1</Square>
    },
    2: {
      children: <Square>2</Square>
    }
  });
  const [order, setOrder] = useState([0, 1, 2]);
  return <>
    <Wrapper>
      <DroppableContextProvider>
        Minecraft UI
        <div className="full">
          <Grid
            items={items}
            order={order}
            setOrder={setOrder}
          />
        </div>
      </DroppableContextProvider>
    </Wrapper>
  </>
}