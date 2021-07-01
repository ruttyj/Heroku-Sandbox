import React, { useRef, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useGlobalContext  } from "../../../../state/globalContext";


const Wrapper = function({children}) {
  return <>
    <div className="full" style={{display:"block"}}>
      <div style={{position: 'relative'}}>
        {children}
      </div>
    </div>
  </>
}

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
        type: "container",
        contents: ["3", "4"],
      },
      '3': { 
        label: "Price",
        type: "number",
        value: 0,
      },
      '4': { 
        type: "container",
        contents: ["5"],
      },
      '5': { 
        label: "Name",
        type: "text",
        value: "Unnamed",
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
          case 'container':
            contents = <motion.div drag style={{'border': '1px solid white', 'padding': "10px"}}>
              <div>Container</div>
              <div>
                {item.contents.map(nodeId => {
                  const node = tree[nodeId];
                  return recursiveRender(node, [nodeId]);
                })}
              </div>
            </motion.div>
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