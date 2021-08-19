import * as React from "react";
import { useState, useRef } from 'react';

const useRefState = () => {
 

  


  /////////////////////////////////////////////////////////////////////////////////////

  //                                PUBLIC SCOPE

  /////////////////////////////////////////////////////////////////////////////////////
  return {
   
  };
}

const RefContextProvider = React.createContext(null);

// Expose the way to access the state
export const useContextProvider = () => React.useContext(RefContextProvider);

// Wrap components with the provider to allow access to state
export function ContextWrapper({ children }) {
  return (
    <RefContextProvider.Provider value={useRefState()}>
      {children}
    </RefContextProvider.Provider>
  );
}
