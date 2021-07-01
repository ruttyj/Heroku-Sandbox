import React from 'react';
import { motion } from "framer-motion";



const DragItem = function({children}) {
  const onMouseUp = (e) => {
    console.log('onMouseUp');
  }
  
  return (
    <motion.div drag 
      onMouseUp={onMouseUp}
    >
      {children}
    </motion.div>
  )
}

const DropContainer = function({children, dropProps}) {

  const style = {
    height: "12vh",
    width: "12vh",
  };

  const onMouseUp = (e) => {
    console.log('onMouseUp', dropProps);
  }

  return (
      <motion.div style={style} onMouseUp={onMouseUp}>
      {children}
    </motion.div>
  )
}



export default function({children}) {
  
  
  return <>
    <div className="full" style={{display:"block"}}>
      <div style={{position: 'relative'}}>
       
        <DragItem>
          Hi
        </DragItem>

        <DropContainer dropProps={{key: 'A'}}>
          A
        </DropContainer>

        <DropContainer dropProps={{key: 'B'}}>
          B
        </DropContainer>
      </div>
    </div>
  </>
}