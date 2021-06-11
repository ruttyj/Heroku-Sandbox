import React from "react";
import RenameForm from "./RenameForm";
export default function (windowManager, {
  isFocused = true,
  
}) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "Change my name",
    key: 'change_my_name',
    isFocused,
    position: {
      left: 300,
      top: 50
    },
    size: {
      width: 400,
      height: 150
    },
    children: (props) => {
      return (
        <RenameForm {...props}/>
      )
    },
  });
}
