import * as React from "react";
import { useState, useRef, useEffect } from 'react';
import utils from '../Utils/';
import { debounce } from "lodash";
import WindowManager from '../Utils/WindowManager';
const {
  isDef,
  isFunc,
  isArr,
  isObj,
  inRange,
  identity,
  getNestedValue,
  setImmutableValue,
  deleteImmutableValue,
} = utils;

/**
 * Buffered Context
 * 
 * This context stores all its information in a ref and pushes the data to state after 1 ms of inactivity.
 * This is ment to batch state changes together and prevent excessive rendering.
 */
const useBufferedState = () => {

  // used to trigger state change
  const [state, setState] = useState({});
  
  // values will be primarily read from this buffer
  const bufferedState = useRef({});
  
  /**
   * Flush consolidates all the updates within a time frame into a single setState
   */
  const _flush = debounce(async function() {
    flush();
  }, 1);

  function flush() 
  {
    setState(bufferedState.current);
  }

  function get(path=[], fallback=undefined)
  {
    return getNestedValue(bufferedState.current, path, fallback)
  }

  function set(path, value) 
  {
    bufferedState.current = setImmutableValue(bufferedState.current, path, value);
    _flush();
  }

  function remove(path)
  {
    bufferedState.current = deleteImmutableValue(bufferedState.current, path);
    _flush();
  }

  function inc(path=[], value=1)
  {
    set(path, parseFloat(get(path, 0)) + value);
    _flush();
  }

  function dec(path=[], value=1)
  {
    set(path, parseFloat(get(path, 0)) - value);
    _flush();
  }

  function is(A, B = undefined, C = undefined)
  {
    let path, op, value;

    if (isDef(A) && !isDef(B) && !isDef(C)) {
      path = A;
      op = "===";
      value = true;
    } else {
      if (isDef(A) && isDef(B) && !isDef(C)) {
        path = A;
        op = "===";
        value = B;
      } else if (isDef(A) && isDef(B) && isDef(C)) {
        path = A;
        op = B;
        value = C;
      }
    }

    let nestedVal = get(path);
    switch (op) {
      case "===":
        return nestedVal === value;
      default:
        return nestedVal === op;
    }
  }

  function push(path = [], value = undefined)
  {
    if (value !== undefined) {
      let pointer = getNestedValue(bufferedState.current, path, undefined);
      let newValue = pointer;
      if (isArr(pointer)) {
        newValue = [...pointer, value];
      } else {
        newValue = [value];
      }
      bufferedState.current = setImmutableValue(bufferedState.current, path, newValue);
    } else {
      // You mean delete right, or keep same value?????
    }
    _flush();
  }
  function swap(path = [], key1, key2)
  {
    let pointer = getNestedValue(bufferedState.current, path, undefined);
    if (isDef(pointer)) {
      if (isArr(pointer)) {
        let newValue = [...pointer];
        let index1 = parseInt(key1, 10);
        let index2 = parseInt(key2, 10);
        if (
          inRange(0, index1, newValue.length) &&
          inRange(0, index1, newValue.length)
        ) {
          let temp1 = getNestedValue(pointer, index1);
          let temp2 = getNestedValue(pointer, index2);
          newValue = setImmutableValue(newValue, index1, temp2);
          newValue = setImmutableValue(newValue, temp2, temp1);
          bufferedState.current = setImmutableValue(bufferedState.current, path, newValue);
        }
      }
    } else if (isObj(pointer)) {
      let newValue = { ...pointer };
      if (isDef(pointer[key1]) && isDef(pointer[key2])) {
        let temp1 = getNestedValue(pointer, key1);
        let temp2 = getNestedValue(pointer, key2);
        newValue = setImmutableValue(newValue, key1, temp2);
        newValue = setImmutableValue(newValue, key2, temp1);
        bufferedState.current = setImmutableValue(bufferedState.current, path, newValue);
      }
    }

    console.log("bufferedState.current", bufferedState.current);
  }

  function forEach(path = [], fn = identity)
  {
    let iterable = getNestedValue(bufferedState.current, path, []);
    if (isDef(iterable)) {
      if (isArr(iterable) || isFunc(iterable.map)) {
        iterable.forEach(fn);
      } else if (isFunc(iterable.forEach)) {
        iterable.forEach((item, key, whole) => {
          fn(item, key, whole);
        });
      } else if (isObj(iterable)) {
        let keys = Object.keys(iterable);
        if (keys.length > 0) {
          return keys.map(key => {
            let value = iterable[key];
            fn(value, key, iterable);
          });
        }
      }
    }
  }

  function map(path = [], fn = identity)
  {
    let result = [];
    forEach(path, (...props) => {
      result.push(fn(...props));
    });
    return result;
  }
  

  const publicScope = {
    get, 
    set, 
    inc,
    dec,
    remove,
    is,
    swap,
    push,
    forEach,
    map,
    state,
  }

  const windowManagerRef = useRef(WindowManager(publicScope));
  const windowManager = windowManagerRef.current;
  publicScope.windowManager = windowManager;


  // Expose public ----------------
  return publicScope;
}

const GlobalContext = React.createContext(null);

// Expose the way to access the state
export const useGlobalContext = () => React.useContext(GlobalContext);

// Wrap components with the provider to allow access to state
export function GlobalContextProvider({children}) {
  return (
    <GlobalContext.Provider value={useBufferedState()}>
      {children}
    </GlobalContext.Provider>
  );
}
