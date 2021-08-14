import React from 'react';
import Switch from '@material-ui/core/Switch';

export default function({label="", value="", readOnly=false, onValueChange=()=>{}}) {
  return <div>
    {label}
    <Switch
        checked={value ? true : false}
        value={value}
        disabled={readOnly}
        onChange={(e) => {
          onValueChange(!value);
        }}
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
  </div>
}