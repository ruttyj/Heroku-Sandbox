import * as React from "react";
import { useState, useRef } from 'react';

const useBufferedState = () => {
  const boundingBox = useRef(null);

  // keep reference of the dragItems and dropZones
  const dragItems = useRef({});
  const dropZones = useRef({});
  const dropZoneCallbacksOnDrop = useRef({});


  const [cursorState, setCursorState] = useState(null);
  const getCursorState = () => cursorState;

  const [grabbingFromZoneId, setGrabbingFromZone] = useState(null);
  const getGrabbingFromZone = () => grabbingFromZoneId;

  const [isDragging, setIsDragging] = useState(false);
  const getIsDragging = () => isDragging;


  const [isGrabbing, setIsGrabbing] = useState(false);
  const getIsGrabbing = () => isGrabbing;

  const [grabbingDragItemId, setGrabbingDragItemId] = useState(null);
  const getGrabbingDragItemId = () => grabbingDragItemId;
  
  const [hoveringId, setHoveringId] = useState(null);
  const getHoveringId = () => hoveringId;
  
  //=============================

  //        Drag Items

  //=============================
  function internalizeDragItem(dragItem) 
  {
    let id = dragItem.id;
    dragItems.current[id] = dragItem;
  }

  function removeDragItem(dragItem)
  {
    let id = dragItem.id;
    delete dragItems.current[id];
  }

  function getDragItems() 
  {
    return dragItems.current;
  }

  function getDragItem(id)
  {
    return dragItems.current[id];
  }

  //=============================

  //        Drop Zones

  //=============================
  function internalizeDropZone(dropZone, onDrop)
  {
    if (dropZone) {
      let id = dropZone.id;
      dropZones.current[id] = dropZone;

      dropZoneCallbacksOnDrop.current[id] = onDrop;
    }
  }

  function getOnDrop(id)
  {
    return dropZoneCallbacksOnDrop.current[id]
  }

  function removeDropZone(dropZone)
  {
    let id = dropZone.id;
    delete dropZones.current[id];
  }

  function getDropZones() 
  {
    return dropZones.current;
  }

  function getDropZone(id)
  {
    return dropZones.current[id];
  }

  function getDropZoneByCoord(x, y)
  {
    const hoverElement = document.elementFromPoint(x, y);
    const closestDroppable = hoverElement.closest('.droppable');

    if(closestDroppable && closestDroppable.dataset) {
      return getDropZone(closestDroppable.dataset.id);
    } 

    return null;
  }

  //=============================

  //     Drag Item Overlay

  //=============================
  function moveDraggingItemToPos(x, y)
  {
    // Get bounding box of the dragable area
    let offset;
    if (boundingBox) {
      offset = boundingBox.current.getBoundingClientRect()
    } else {
      offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }
    }

    // Set State for grid
    // Position of (primary cursor dragging item) 
    setCursorState({
      ...getCursorState(),
      pos: {
        x: Math.max(offset.left, Math.min(x, offset.right))-offset.left,
        y: Math.max(offset.top, Math.min(y-20, offset.bottom))-offset.top,
      }
    });
  }

  function grabItem(id)
  {
    setIsGrabbing(true);
    setGrabbingDragItemId(id);
  }


  //=============================

  //     Touch Handeling

  //=============================
  function onTouchStart(e, {dragItem})
  {
    console.log('onTouchStart');
    if(!getIsDragging() && !getIsGrabbing()) {
      grabItem(dragItem.id);
      setIsDragging(true);


      let primaryTouch = e.touches[0];
      moveDraggingItemToPos(primaryTouch.clientX, primaryTouch.clientY);
    }
  }

  function onTouchMove(e, {dragItem})
  {
    if(getIsDragging()) {
      let primaryTouch = e.touches[0];
      moveDraggingItemToPos(primaryTouch.clientX, primaryTouch.clientY);

      let closestDroppable = getDropZoneByCoord(primaryTouch.clientX, primaryTouch.clientY);
      if(closestDroppable && closestDroppable.id) {
        setHoveringId(closestDroppable.id)
      } else {
        setHoveringId(null);
      }
    }
  }

  function onTouchEnd(e, {dragItem}) 
  {
    console.log('onTouchEnd');

    //getDragItem(getGrabbingDragItemId())
    //

    const dropZoneId = getHoveringId();
    if (dropZoneId) {
      const dropZone = getDropZone(dropZoneId);
      const onDrop = getOnDrop(dropZoneId);

      onDrop({
        dragItem,
        dropZone
      })
    }

    //getOnDrop
    setGrabbingDragItemId(null);
    setHoveringId(null);
    setIsGrabbing(false);
    setIsDragging(false);
  }


  //=============================

  //     Cursor Handeling

  //=============================
  const getHoverElementFromPos = (pos) => {
    const hoverElement = document.elementFromPoint(pos.clientX, pos.clientY);
    const closestDroppable = hoverElement.closest('.droppable');
    
    return closestDroppable;
  }

  function onMouseMove(e)
  {
    console.log('onMouseMove');
    if(getIsGrabbing()) {

      moveDraggingItemToPos(e.clientX, e.clientY);
      const closestDroppable = getHoverElementFromPos(e);
      if(closestDroppable) {
        setHoveringId(closestDroppable.dataset.id)
      } else {
        setHoveringId(null);
      }
    } else if(getHoveringId()) {
      setHoveringId(null);
    }
  }


  function onMouseDown(e, {dragItem})
  {
    if(!getIsGrabbing() && !getIsDragging()) {
      grabItem(dragItem.id);
      setIsDragging(true);
      moveDraggingItemToPos(e.clientX, e.clientY);
    }
  }

  function onMouseUp(e) {
    if(getIsGrabbing()){
      const dropZoneId = getHoveringId();
      if(dropZoneId) {
        const dropZone = getDropZone(dropZoneId);
        const onDrop = getOnDrop(dropZoneId);

        const dragItem = getDragItem(getGrabbingDragItemId());

        onDrop({
          dragItem,
          dropZone
        })

        setIsGrabbing(false);
        setGrabbingDragItemId(null);
      }
    }
    setIsDragging(false);
  }


  //=============================

  //      Cursor Click

  //=============================
  function onClick(e, {dragItem})
  {

  }
  
  /////////////////////////////////////////////////////////////////////////////////////

  //                                PUBLIC SCOPE

  /////////////////////////////////////////////////////////////////////////////////////
  const publicScope = {
    boundingBox,
    
    // Drag Items
    internalizeDragItem,
    removeDragItem,
    getDragItems,
    getDragItem,

    // Drop Zones
    internalizeDropZone,
    removeDropZone,
    getDropZones,

    // Cursor State
    getCursorState,
    setCursorState,
    getIsDragging,
    setIsDragging,
    getGrabbingDragItemId,
    getIsGrabbing,
    getHoveringId,

    // Handle Touch
    onTouchStart,
    onTouchMove,
    onTouchEnd,


    // Handle Cursor
    onMouseMove,
    onMouseDown,
    onMouseUp,
    onClick,
  }

 

  // Expose public ----------------
  return publicScope;
}

const DroppableContext = React.createContext(null);

// Expose the way to access the state
export const useDroppableContext = () => React.useContext(DroppableContext);

// Wrap components with the provider to allow access to state
export function DroppableContextProvider({children}) {
  return (
    <DroppableContext.Provider value={useBufferedState()}>
      {children}
    </DroppableContext.Provider>
  );
}
