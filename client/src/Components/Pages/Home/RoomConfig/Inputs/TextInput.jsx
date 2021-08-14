import React, { useState, useEffect } from 'react';

export default function({label="", value="", onValueChange=()=>{}}) {
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
    <input type="button" onClick={(e) => onValueChange(inputValue)}/>
  </div>
}
 