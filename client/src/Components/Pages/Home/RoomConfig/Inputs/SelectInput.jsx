import React from 'react';

export default function({label="", value="", options=[], readOnly=false, onValueChange=()=>{}}) {
  return <div>
    {label}
    <select
        checked={value ? true : false}
        value={value}
        disabled={readOnly}
        onChange={(e) => {
          console.log(e.target.value);
          onValueChange(e.target.value);
        }}
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      >
        {options.map((value) => {
          return <>
            <option key={value} value={value}>{value}</option>
          </>
        })}
      </select>
  </div>
}