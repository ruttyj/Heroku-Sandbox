import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { findIndex, Position } from "./find-index";
import move from "array-move";
import useLongPress from "../../../Utils/useLongPress"
import "./DragListV.scss";
import DragHandle from "../../Functional/DragHandle/DragHandle";

const DragListVItem = ({ style = {}, setPosition, onMoveItem, i }) => {
  const [isDragging, setDragging] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);

  
  // We'll use a `ref` to access the DOM element that the `motion.li` produces.
  // This will allow us to measure its height and position, which will be useful to
  // decide when a dragging element should switch places with its siblings.
  const ref = useRef(null);

  // By manually creating a reference to `dragOriginY` we can manipulate this value
  // if the user is dragging this DOM element while the drag gesture is active to
  // compensate for any movement as the items are re-positioned.
  const dragOriginY = useMotionValue(0);

  // Update the measured position of the item so we can calculate when we should rearrange.
  useEffect(() => {
    setPosition(i, {
      height: ref.current.offsetHeight,
      top: ref.current.offsetTop,
    });
  });


  const onLongPress = () => {
    console.log('longpress is triggered');
    setIsDraggable(true)
    setTimeout(() => {
      setIsDraggable(false)
    }, 1000)
  };

  const onClick = () => {
      console.log('click is triggered')
  }

  const defaultOptions = {
      shouldPreventDefault: true,
      delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);


  return (
    <motion.li
      ref={ref}
      initial={false}
      // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
      animate={isDragging || isDragging ? onTop : flat}
      style={{
        ...style,
        ...(isDraggable || isDragging ? {
          border: "1px solid white"
        } : {}) 
      }}
      {...longPressEvent}
      drag={isDraggable ? "y" : null}
      dragOriginY={dragOriginY}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={1}
      onMouseDown={() => {
        setIsDraggable(true)
      }}
      onDragStart={() => {
          setDragging(true)
      }}
      onDragEnd={() => setDragging(false)}
      onDrag={(e, { point }) => {
        console.log('drag');
        if(isDraggable || isDragging) {
          onMoveItem(i, point.y)
        }
      }}
      positionTransition={({ delta }) => {
        if (isDragging) {
          // If we're dragging, we want to "undo" the items movement within the list
          // by manipulating its dragOriginY. This will keep the item under the cursor,
          // even though it's jumping around the DOM.
          dragOriginY.set(dragOriginY.get() + delta.y);
        }

        // If `positionTransition` is a function and returns `false`, it's telling
        // Motion not to animate from its old position into its new one. If we're
        // dragging, we don't want any animation to occur.
        return !isDragging;
      }}
    />
  );
};

// Spring configs
const onTop = { zIndex: 1 };
const flat = {
  zIndex: 0,
  transition: { delay: 0.3 },
};


const makeRandomColor = () => Math.floor(Math.random()*16777215).toString(16);
const makeRandomNumber = (min, max) => Math.random() * (max - min) + min;





const DragListV = ({items, order, onSetItemOrder=()=>{}}) => {
  const [itemOrder, setItemOrder] = useState(order);
  const [prevIndex, setPrevIndex] = useState(null); // remember previous hover index to reduce unnessary state setting
 


  // We need to collect an array of height and position data for all of this component's
  // `DragListVItem` children, so we can later us that in calculations to decide when a dragging
  // `DragListVItem` should swap places with its siblings.
  const positions = useRef([]).current;
  const setPosition = (i, offset) => (positions[i] = offset);

  // Find the ideal index for a dragging item based on its position in the array, and its
  // current drag offset. If it's different to its current index, we swap this item with that
  // sibling.
  const moveItem = (i, dragOffset) => {
    const targetIndex = findIndex(i, dragOffset, positions);
    if (targetIndex !== i ) {
      
      const newOrder = move(itemOrder, i, targetIndex);
      console.log(i);
      onSetItemOrder(newOrder)
      setItemOrder(newOrder);
    }
  };

  return (
    <ul className={"drag-list-v"}>
      {itemOrder.map((itemKey, i) => {
        const item = items[itemKey];
        const color = item.color;
        const height = item.height;
        
        return <DragListVItem
          key={itemKey}
          i={i}
          style={{ background: color, height: height }}
          setPosition={setPosition}
          onMoveItem={moveItem}
        >
          {color} <DragHandle>Drag</DragHandle>
        </DragListVItem>
      })}
    </ul>
  );
};

export default DragListV;
