import React, { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useDroppableContext, DroppableContextProvider } from './State';
import Droppable from './Droppable';
import Draggable from './Draggable';

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

const DroppableArena = function({children}) {
  return <>
    <Wrapper>
      <DroppableContextProvider>
        {children}
      </DroppableContextProvider>
    </Wrapper>
  </>;
}



let topDropZoneId = 0;
const dropZones = [];
const addDropZone = () => {
  const id = ++topDropZoneId;
  dropZones.push({
    id,
    dragItemId: null,
  })
}

for(let i=0; i< 8*3; ++i){
  addDropZone();
}

const initialDropZones = dropZones.reduce((all, current) => {
  all[current.id] = current;
  return all;
}, {});
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





const Grid = function({children, items, order, dropZones, setDropZones}) {
  const {
    boundingBox,
    getIsGrabbing,
    getGrabbingId,
    getIsDragging,
    getCursorState,
    onMouseMove,
  } = useDroppableContext();

  const isGrabbing = getIsGrabbing();
  const grabbingId = getGrabbingId();
  const isDragging = getIsDragging();
  const cursorState = getCursorState();

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
      {children}
    </div>
  </div>;
}




///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function({children}) {

  const [items, setItems] = useState(initialDragItems);
  const [order, setOrder] = useState(initialDragItemOrder);
  const [dropZones, setDropZones] = useState(initialDropZones)
  const [dropZoneOrder, setDropDoneOrder] = useState(initialDropZoneOrder);
  
  return <>
    <DroppableArena>
      <Grid items={items} order={order} dropZoneOrder={dropZoneOrder} setDropDoneOrder={setDropDoneOrder}>

        {dropZoneOrder.map(dropZoneId => {
          const dropZone = dropZones[dropZoneId];
          const itemId = dropZone.dragItemId;

          let onDrop = ({dropZoneId, dropZone, grabbingId, grabbingFromZoneId}) => {
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
          }



          let item = items[itemId];
          return <Droppable 
            key={dropZoneId} 
            dropZone={dropZone}
            onDrop={onDrop}
          >
            {item && <>
              <Draggable item={item} dropZone={dropZone}>
                {item.children}
              </Draggable>
            </>}
          </Droppable>
        })}


        {order.map(itemId => {
          let item = items[itemId];
          return <>
            <div style={{display: "inline-block"}}>
              <Draggable itemId={itemId} item={item}>
                {item.children}
              </Draggable>
            </div>
          </>;
        })}
      </Grid>
    </DroppableArena>
  </>
}