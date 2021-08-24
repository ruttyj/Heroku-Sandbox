
import React from 'react';

export default ({ children }) => {
  // Display the combined contents
  return <>
    <div style={{
      position: 'relative',
      width:    '100%',
      height:   '100%',
    }}>
      {children}
    </div>
  </>  
}
