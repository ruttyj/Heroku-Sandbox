import React from "react";
import WindowComponent from './Component';

export default function (windowManager, isFocused = true) {
  let title = "People List";
  let key = 'PeopleList';

  let window = windowManager.getWindowByKey(key);
  if (window) {
    windowManager.setFocused(window.id);
  } else {
    windowManager.createWindow({
      title: title,
      key: key,
      isFocused,
      position: {
        left: 1500,
        top: 350
      },
      size: {
        width: 500,
        height: 450
      },
      isFullSize: false,
      children: (props) => {
        return (
          <WindowComponent {...props} />
        )
      },
    });
  }

}
