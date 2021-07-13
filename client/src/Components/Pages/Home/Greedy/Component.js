import React, { useEffect, useState, useRef } from 'react';

import FillContainer from '../../../Containers/FillContainer/FillContainer';
import FillContent from '../../../Containers/FillContainer/FillContent';
import FillFooter from '../../../Containers/FillContainer/FillFooter';
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Container from "./Container";
import { Dustbin } from './Dustbin';
import { Box } from './Box';
import { isMobile } from "react-device-detect";


export default function({children}) {
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    if (isMobile) {
      setDeviceType("mobile");
    } else {
      setDeviceType("desktop");
    }
  }, [isMobile]);


  const onDrop = ({dragItem, dropZone}) => {
    console.log({dragItem, dropZone});
  }

  const backend = isMobile ? TouchBackend : HTML5Backend;
  const dragItemStyle = {width: "100px", height: "150px"};
  return <>
    <div className="full" style={{display:"block"}}>
      <DndProvider backend={backend}>
        <FillContainer>
          <FillContent>
            {children}
          </FillContent>
          <FillFooter>
            <FillContainer>
              <FillContent style={{textAlign: "center"}}>
                Actions
              </FillContent>
              <FillFooter>
                <div className="column">
                  <div className="row">
                    <Dustbin onDrop={onDrop} dropZone={{parent: true}}>
                      <Dustbin onDrop={onDrop} dropZone={{id: 'A'}}/>
                      <Dustbin onDrop={onDrop} dropZone={{id: 'B'}}/>
                    </Dustbin>
                  </div>
                  <div className="row">
                    <Box><img src="/assets/cards/cash_1.png" dragItem={{id:'1'}} style={dragItemStyle}/></Box>
                    <Box><img src="/assets/cards/cash_2.png" dragItem={{id:'2'}} style={dragItemStyle}/></Box>
                    <Box><img src="/assets/cards/cash_3.png" dragItem={{id:'3'}} style={dragItemStyle}/></Box>
                    <Box><img src="/assets/cards/cash_4.png" dragItem={{id:'4'}} style={dragItemStyle}/></Box>
                    <Box><img src="/assets/cards/cash_5.png" dragItem={{id:'5'}} style={dragItemStyle}/></Box>
                  </div>
                </div>
                
              </FillFooter>
            </FillContainer>
          </FillFooter>
        </FillContainer>
      </DndProvider>
    </div>
  </>
}