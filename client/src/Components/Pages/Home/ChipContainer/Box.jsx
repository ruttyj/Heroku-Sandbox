import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
const style = {
  
    cursor: 'move',
    float: 'left',
};
export const Box = function Box({ children, item, type }) {
    const [{ isDragging }, drag] = useDrag({
        item: {...item, type},
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                alert(`You dropped ${item.name} into ${dropResult.name}!`);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    });
    const opacity = isDragging ? 0.4 : 1;
    return (<div ref={drag} role="Box" style={{ ...style, opacity }}>
			{children}
		</div>);
};
