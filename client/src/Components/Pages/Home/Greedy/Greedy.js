import React from 'react';

import FillContainer from '../../../Containers/FillContainer/FillContainer';
import FillContent from '../../../Containers/FillContainer/FillContent';
import FillFooter from '../../../Containers/FillContainer/FillFooter';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Container from "./Container";
import { Box } from './Box';




export default function({children}) {
  return <>
    <div className="full" style={{display:"block"}}>
      <DndProvider backend={HTML5Backend}>
        <FillContainer>
          <FillContent>
            {children}
            <Container/>
          </FillContent>
          <FillFooter>
            <FillContainer>
              <FillContent style={{textAlign: "center"}}>
                Actions
              </FillContent>
              <FillFooter>
                <Box><img src="/assets/cards/cash_1.png" style={{width: "100px", height: "150px"}}/></Box>
                <Box><img src="/assets/cards/cash_2.png" style={{width: "100px", height: "150px"}}/></Box>
                <Box><img src="/assets/cards/cash_3.png" style={{width: "100px", height: "150px"}}/></Box>
                <Box><img src="/assets/cards/cash_4.png" style={{width: "100px", height: "150px"}}/></Box>
                <Box><img src="/assets/cards/cash_5.png" style={{width: "100px", height: "150px"}}/></Box>
              </FillFooter>
            </FillContainer>
          </FillFooter>
        </FillContainer>
      </DndProvider>
    </div>
  </>
}