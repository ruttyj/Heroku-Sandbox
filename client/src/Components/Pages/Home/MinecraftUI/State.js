import { initial } from "lodash";
import * as React from "react";
import { useState, useRef } from 'react';
import useStateManager from '../../../../state/StateManager';

/**
 * Buffered Context
 * 
 * This context stores all its information in a ref and pushes the data to state after 1 ms of inactivity.
 * This is ment to batch state changes together and prevent excessive rendering.
 */
const useBufferedState = () => {
  
  /////////////////////////////////////////////////////////////////////////////////////

  //                                  VARIABLES

  /////////////////////////////////////////////////////////////////////////////////////
  
  const boundingBox = useRef(null);

  const [state, setState] = useState({})
  const bufferedState = useRef({});
  const manager = useStateManager(state, setState, bufferedState);


  const useCursorManager = function(manager, rootPath) 
  {
    const set = (path, value)    => manager.set([...rootPath, ...path], value);
    const get = (path, fallback) => manager.get([...rootPath, ...path], fallback);



    return {

    }
  }



  const [isGrabbing, setIsGrabbing] = useState(false);
  const getIsGrabbing = () => isGrabbing;
  
  const [grabbingId, setGrabbingId] = useState(null);
  const getGrabbingId = () => grabbingId;

  const [grabbingFromZoneId, setGrabbingFromZone] = useState(null);
  const getGrabbingFromZone = () => grabbingFromZoneId;

  const setIsHoveringOverItem = (...a) => manager.set(['isHoveringOverItem'], ...a);
  const getIsHoveringOverItem = (...a) => manager.get(['isHoveringOverItem'], false);

  const setHoveringId = (...a) => manager.set(['hoveringId'], ...a);
  const getHoveringId = (...a) => manager.get(['hoveringId'], null);

  const setIsDragging = (...a) => manager.set(['isDragging'], ...a);
  const getIsDragging = (...a) => manager.get(['isDragging'], false);

  const setCursorState = (...a) => manager.set(['cursorState'], ...a);
  const getCursorState = (...a) => manager.get(['cursorState'], null);



  const onMouseMove = (e) => {
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
    } else if(getHoveringId()) {
      setHoveringId(null);
    }
  }

  const grabItem = (id) => {
    console.log('grabItem');

    setIsGrabbing(true);
    setGrabbingId(id);
  }

  let onMouseDown = (e, {item, dropZone}) => {
    if(!getIsDragging() && !getIsGrabbing()) {
      grabItem(item.id);
      setIsDragging(true);
      setGrabbingFromZone(dropZone.id);
    }
    onMouseMove(e);
  }

  let onMouseUp = (e, {onDrop, dropZoneId, dropZone}) => {
    if(getIsDragging() && getGrabbingFromZone() === dropZoneId) {

    } else {
      if(getIsGrabbing()) {
        onDrop({dropZoneId: dropZoneId, dropZone, grabbingId: getGrabbingId(), grabbingFromZoneId: getGrabbingFromZone()});
        setIsGrabbing(false);
        setGrabbingId(null);
        setGrabbingFromZone(null);
      }
    }
    setIsDragging(false);
  }

  

  /////////////////////////////////////////////////////////////////////////////////////

  //                                PUBLIC SCOPE

  /////////////////////////////////////////////////////////////////////////////////////
  const publicScope = {
    
    boundingBox,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    grabItem,
    setIsGrabbing, getIsGrabbing,
    setGrabbingId, getGrabbingId,
    setGrabbingFromZone, getGrabbingFromZone,
    setIsHoveringOverItem, getIsHoveringOverItem,
    setHoveringId, getHoveringId,
    setIsDragging, getIsDragging,
    setCursorState, getCursorState,
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
