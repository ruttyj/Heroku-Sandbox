import React, { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";

///////////////////////////////////////////////////////////////////
//                           Wrapper
///////////////////////////////////////////////////////////////////
const Wrapper = function({children}) {
  return <>
    <div className="full" style={{display:"block"}}>
      <div className="full column" style={{position: 'relative'}}>
        {children}
      </div>
    </div>
  </>
}

///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function({children}) {
  const onClickerClick = (e) => {

  }
  return <>
    <Wrapper>
      <div onClick={onClickerClick}>Clicker</div>
      <motion.div drag>Item 1</motion.div>
      <motion.div drag>Item 1</motion.div>
      <motion.div drag>Item 1</motion.div>
      <motion.div drag>Item 1</motion.div>
      <motion.div drag>Item 1</motion.div>
    </Wrapper>
  </>
}