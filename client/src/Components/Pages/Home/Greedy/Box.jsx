import React from 'react';

import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
const style = {
    display: 'inline-block',
    cursor: 'move',
};
export const Box = ({children, dragItem={}}) => {
    const [, drag] = useDrag(({
       item: {
        ...dragItem,
        type: ItemTypes.BOX,
       }, 
      }));
    return (<div ref={drag} style={style}>
			{children}
		</div>);
};
