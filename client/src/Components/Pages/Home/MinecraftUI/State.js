import * as React from "react";
import { useState, useRef } from 'react';
import useStateManager from './StateManager';

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


  /////////////////////////////////////////////////////////////////////////////////////

  //                                PUBLIC SCOPE

  /////////////////////////////////////////////////////////////////////////////////////
  const publicScope = {
    boundingBox,
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
