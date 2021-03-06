import React from "react";
import WindowComponent from './Component';

export default function (windowManager, isFocused = true) {
  let title = "Change My Name";
  let key = 'ChangeMyName';

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
        top: 0
      },
      size: {
        width: 400,
        height: 150
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
