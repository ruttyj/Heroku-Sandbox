
import React from 'react';

export default function DrawButton({children, onClick, color='#2d8c0e'})
{
  return <>
    <div
      onCLick={(e) => onClick(e)} 
      onTap={(e) => onClick(e)} 
      style={{
        padding: "10px",
        height: '55px',
        width: '70px',
        backgroundColor: color,
        textAlign: 'center',
      }}
    >
      Draw
    </div>
  </>
}
