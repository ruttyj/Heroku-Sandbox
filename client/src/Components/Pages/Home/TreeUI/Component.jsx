import React, { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useGlobalContext  } from "../../../../state/globalContext";
import DragListV from "../../../Containers/DragListV/index";


///////////////////////////////////////////////////////////////////
//                           Wrapper
///////////////////////////////////////////////////////////////////
const Wrapper = function({children}) {
  return <>
    <div className="full" style={{display:"block"}}>
      <div style={{position: 'relative'}}>
        {children}
      </div>
    </div>
  </>
}

///////////////////////////////////////////////////////////////////
//                          TextInput
///////////////////////////////////////////////////////////////////
const TextInput = function({label="", value="", onSubmit=()=>{}}) {
  const [inputValue, setValue] = useState(value);
  useEffect(() => {
    setValue(value)
  }, [value]);
  return <div>
    {label}
    <input 
      type="text" 
      name="value"
      value={inputValue}
      onChange={(e) => setValue(e.target.value)}
    />
    <input type="button" onClick={(e) => onSubmit(inputValue)}/>
  </div>
}

///////////////////////////////////////////////////////////////////
//                         InitialValues
///////////////////////////////////////////////////////////////////
const makeRandomColor = () => Math.floor(Math.random()*16777215).toString(16);
const makeRandomNumber = (min, max) => Math.random() * (max - min) + min;
const dragListItems = {};

let topId = 1;
const addItem = () => {
  dragListItems[++topId] = {
    color: `#${String(parseInt(topId%16, 16)).repeat(3)}`,
    height: 24
  }
}
addItem();
addItem();
addItem();
addItem();
addItem();
addItem();
addItem();

const dragListOrder = Object.keys(dragListItems);

///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default function({children}) {
  const itemRef = useRef([
    { 
      type: "number",
      value: 200,
    }
  ]);
  const items = itemRef.current;

  const {get, set, map} = useGlobalContext();
  const rootPath = ['tree'];
  let tree = get(rootPath, undefined);
  if (tree === undefined) {
    set(rootPath, {
      'root': {
        type: "column",
        contents: ["3", "4"],
      },
      '3': { 
        type: "text",
        label: "Search",
        value: 0,
      },
      '4': { 
        type: "row",
        contents: ["6", "5"],
      },
      '5': { 
        type: "text",
        label: "Name",
        value: "Unnamed",
      },
      '6': { 
        type: "DragListV",
        label: "Name",
        value: "Unnamed",
        items: dragListItems,
        order: dragListOrder,
      },
    })
  }
  tree = get([...rootPath]);

  

  function recursiveRender(item, path) {
    let contents = '';

    
    switch (item.type) {
      case 'number':
        contents = <>
          <TextInput label={item.label} value={item.value} onSubmit={(v) => set([...rootPath, ...path, 'value'], v)}/>
        </>
      break;
      case 'text':
        contents = <>
          <TextInput label={item.label} value={item.value} onSubmit={(v) => set([...rootPath, ...path, 'value'], v)}/>
        </>
      break;
      case 'column':
        contents = <motion.div style={{'border': '1px solid white', 'padding': "10px"}}>
          <div>
            {item.contents.map(nodeId => {
              const node = tree[nodeId];
              return recursiveRender(node, [nodeId]);
            })}
          </div>
        </motion.div>
      break;
      case 'row':
        contents = <motion.div style={{'border': '1px solid white', 'padding': "10px"}}>
          <div className={"row"}>
            {item.contents.map(nodeId => {
              const node = tree[nodeId];
              return recursiveRender(node, [nodeId]);
            })}
          </div>
        </motion.div>
      break;
      case 'DragListV':
        contents = <div style={{width: "100%"}}>
          <DragListV items={item.items} order={Object.keys(item.items)} onSetItemOrder={(newOrder) => set([...rootPath, ...path, "order"], newOrder)}/>
        </div>;
      break;

    }

    return contents
  }

  return <>
    <Wrapper>
      {recursiveRender(get([...rootPath, 'root']), ['root'])}
      <pre><xmp>{JSON.stringify(get(['tree']), null, 2)}</xmp></pre>
    </Wrapper>
  </>
}