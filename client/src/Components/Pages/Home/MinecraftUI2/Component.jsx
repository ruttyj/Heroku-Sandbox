import React, { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useDroppableContext, DroppableContextProvider } from './State';
import Droppable from './Droppable';
import Draggable from './Draggable';
//import "style.css";

///////////////////////////////////////////////////////////////////
//                           Wrapper
///////////////////////////////////////////////////////////////////
const Wrapper = function ({ children }) {
  return <>
    <div className="full" style={{ display: "block" }}>
      <div className="full column" style={{ position: 'relative' }}>
        {children}
      </div>
    </div>
  </>
}

const DroppableArena = function ({ children }) {
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

for (let i = 0; i < 7 * 6; ++i) {
  addDropZone();
}

const initialDropZones = dropZones.reduce((all, current) => {
  all[current.id] = current;
  return all;
}, {});
const initialDropZoneOrder = Object.keys(initialDropZones);
initialDropZones['emptySet'] = {
  id: 'emptySet',
  dragItemId: null,
}

initialDropZones['hand'] = {
  id: 'hand',
  dragItemId: null,
}


initialDropZones['free'] = {
  id: 'free',
  dragItemId: null,
}

const initialDragItems = {
  1: {
    id: 1,
    children: <img src="/assets/cards/cash_1.png" style={{ width: '33px', height: '50px' }} />
  },
  2: {
    id: 2,
    children: <img src="/assets/cards/cash_2.png" style={{ width: '33px', height: '50px' }} />
  },
  3: {
    id: 3,
    children: <img src="/assets/cards/cash_3.png" style={{ width: '33px', height: '50px' }} />
  },
  4: {
    id: 4,
    children: <img src="/assets/cards/cash_4.png" style={{ width: '33px', height: '50px' }} />
  },
  5: {
    id: 5,
    children: <img src="/assets/cards/cash_5.png" style={{ width: '33px', height: '50px' }} />
  },
  10: {
    id: 10,
    children: <img src="/assets/cards/cash_10.png" style={{ width: '33px', height: '50px' }} />
  },
}
const initialDragItemOrder = Object.keys(initialDragItems);





const Grid = function ({ children }) {
  const {
    boundingBox,
    getDragItem,
    getDragItems,
    getDropZones,
    getCursorState,
    getGrabbingDragItemId,
    getIsGrabbing,
    onMouseMove,
    onMouseUp,
  } = useDroppableContext();

  const cursorState = getCursorState();
  const isGrabbing = getIsGrabbing();
  const grabbingId = getGrabbingDragItemId();


  let hoverPosLeft = 0;
  let hoverPosTop = 0;
  if (cursorState && cursorState.pos) {
    hoverPosLeft = cursorState.pos.x;
    hoverPosTop = cursorState.pos.y;
  }

  return <div className="full column">
    <div
      ref={boundingBox}
      className="full"
      style={{
        display: 'block',
        position: 'relative'
      }}
      onMouseUp={(e) => onMouseUp(e)}
      onMouseMove={onMouseMove}
    >
      {isGrabbing && <>
        <div
          style={{
            position: "absolute",
            top: hoverPosTop,
            left: hoverPosLeft,
            pointerEvents: "none"
          }} className="noselect"
        >
          {getDragItem(grabbingId).children}
        </div>
      </>}
      {children}
    </div>
  </div>;
}




///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function ({ children }) {

  const [items, setItems] = useState(initialDragItems);
  const [order, setOrder] = useState(initialDragItemOrder);
  const [dropZones, setDropZones] = useState(initialDropZones)
  const [dropZoneOrder, setDropDoneOrder] = useState(initialDropZoneOrder);


  let onDrop = ({ dragItem, dropZone }) => {
    const newDropZones = { ...dropZones };
    newDropZones[dropZone.id].dragItemId = dragItem.id;
    setDropZones(newDropZones);
  }


  return <>
    <DroppableArena>
      <Grid>
        <Droppable
          dropZone={dropZones['emptySet']}
          onDrop={onDrop}
        >
          <div style={{ padding: "10px", }}>
            {dropZoneOrder.map(dropZoneId => {
              const dropZone = dropZones[dropZoneId];
              const itemId = dropZone.dragItemId;
              const dragItem = items[itemId];

              return <div key={dropZoneId} style={{ display: "inline-block", backgroundColor: '#00000063', margin: '5px' }}>
                <Droppable
                  dropZone={dropZone}
                  onDrop={onDrop}
                  style={{ minWidth: '50px', minHeight: '50px', }}
                >
                  {dragItem && <>
                    <Draggable dragItem={dragItem}>
                      {dragItem.children}
                    </Draggable>
                  </>}
                </Droppable>
              </div>
            })}
          </div>
        </Droppable>


        {/* Hand */}
        <Droppable
          dropZone={dropZones['hand']}
          onDrop={onDrop}
        >
          {order.map(itemId => {
            let item = items[itemId];
            return <>
              <div key={itemId} style={{ display: "inline-block" }}>
                <Draggable dragItem={item}>
                  {item.children}
                </Draggable>
              </div>
            </>;
          })}
        </Droppable>




        {/* Free zone */}
        <Droppable
          dropZone={dropZones['free']}
          onDrop={onDrop}
        >
          Free zone
        </Droppable>
      </Grid>
    </DroppableArena>
  </>
}