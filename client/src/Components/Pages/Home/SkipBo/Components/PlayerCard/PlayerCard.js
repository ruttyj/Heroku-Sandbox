
import React from 'react';
import Pile from '../Pile/Pile';

export default function PlayerCard() {
  return <>
    <div className="row" 
      style={{
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "#00000070",
        marginTop: "6px",
      }}
    >
      <div>
        Name
      </div>
      <div>
        <Pile></Pile>
        <Pile></Pile>
        <Pile></Pile>
        <Pile></Pile>
      </div>
      <Pile></Pile>
    </div>
  </>
}
