import * as React from "react";
import { useState, useRef, useEffect } from 'react';
import utils from '../utils/';

const useBufferedState = () => {
  const [isMounted, setMounted] = useState(false);

  // used to trigger state change
  const [state, setState] = useState({});
  
  // values will be primarily read from this buffer
  const bufferedState = useRef({});
  
  function flush() 
  {
    setState(bufferedState.current);
  }

  function get(path=[], fallback=undefined)
  {
    return utils.getNestedValue(bufferedState.current, path, fallback)
  }

  function set(path, value) 
  {
    bufferedState.current = utils.setImmutableValue(bufferedState.current, path, value);
    flush();
  }

  function remove(path)
  {
    bufferedState.current = utils.deleteImmutableValue(bufferedState.current, path);
    flush();
  }

  // On mount ---------------------
  function onMount() 
  {
    
  }
  useEffect(() => {
    if (!isMounted) {
      onMount();
    }
    setMounted(true);
  }, [isMounted]);

  // Expose public ----------------
  return {
    get, set, remove,
    state,
  }
}

const BufferedStateContext = React.createContext(null);

// Expose the way to access the state
export const useBufferedStateContext = () => React.useContext(BufferedStateContext);

// Wrap components with the provider to allow access to state
export function BufferedStateProvider({children}) {
  return (
    <BufferedStateContext.Provider value={useBufferedState()}>
      {children}
    </BufferedStateContext.Provider>
  );
}
