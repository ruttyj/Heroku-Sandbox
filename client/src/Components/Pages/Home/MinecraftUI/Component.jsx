import React, { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useGlobalContext  } from "../../../../state/globalContext";
import DragListV from "../../../Containers/DragListV/index";
import { setNestedValue } from '../../../../Utils/index';
import move from "array-move";

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


const Grid = function({items, setItems=()=>{}, order, setOrder=()=>{}}) {
  const numRows = 3*9;

  const [isMounted, setIsMounted] = useState(false);
  const boundingBox = useRef(null);

  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [grabbingId, setGrabbingId] = useState(null);
  const [dump, setDump] = useState(null);
  
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



  let contents = [];
  contents = order.map(itemId => {
    let item = items[itemId];
    return <motion.div 
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
      className="noselect" 
      style={{display: 'inline-block', width: '50px', height: '50px'}}
    >
      {item.children}
    </motion.div>
  });


  const onMouseMove = (e) => {
    const offset = boundingBox.current.getBoundingClientRect()
    
    setDump({
      pos: {
        x: Math.max(offset.left, Math.min(e.clientX-10, offset.right))-offset.left,
        y: Math.max(offset.top, Math.min(e.clientY-10, offset.bottom))-offset.top,
      }
    });
  }

  return <div className="full column" >
    <div>
      {isGrabbing ? 'grabbing' : 'not grabbing'} {grabbingId}<br/>
      {isDragging ? 'Dragging' : 'not Dragging'}<br/>
    </div>
    <div ref={boundingBox} className="full " style={{display: 'block', position: 'relative'}} onMouseMove={onMouseMove}>
      {isGrabbing && <>
        <div style={{position: "absolute", top: dump.pos.y || 0, left: dump.pos.x || 0, pointerEvents: "none"}} className="noselect" >{items[grabbingId].children}</div>
      </>}
      {contents}
    </div>
  </div>;
}


///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function({children}) {
  const [order, setOrder] = useState([0, 1]);
  return <>
    <Wrapper>
      Minecraft UI
      <div className="full">
        <Grid
          items={{
            0: {
              children: <>0</>
            },
            1: {
              children: <>1</>
            }
          }}
          order={order}
          setOrder={setOrder}
        />
      </div>
    </Wrapper>
  </>
}