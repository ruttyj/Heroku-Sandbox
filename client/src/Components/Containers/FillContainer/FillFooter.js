import React from "react";
import Utils from "../../../Utils";
const { classes } = Utils;
export default ({ children, height = 200, style = {}, classNames = [] }) => {
  return (
    <div
      style={{
        ...style,
      }}
      {...classes(classNames)}
    >
      {children}
    </div>
  );
};
