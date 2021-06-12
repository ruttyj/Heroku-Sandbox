import React from "react";
import Utils from "../../../Utils/";
import BlurredWrapper from "../../../Components/Containers/BlurredWrapper/";
const { classes } = Utils;

const screenfull = require('screenfull');

class MyComponent extends React.Component {
  componentDidMount() {
    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        console.log('Am I fullscreen?', screenfull.isFullscreen ? 'Yes' : 'No');
      });
    }
  }

  // enabling fullscreen has to be done after some user input
  toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  render() {
    return (
      <button onClick={this.toggleFullScreen}>{
        screenfull.isFullscreen ? ('v') : ('^')
      }</button>
    )
  }
}


function AppHeader(props) {
  return (
    <div {...classes("app-header")}>
      <BlurredWrapper>
        <div
          {...classes(
            "full",
            "tinted-light",
            "space-between",
            "v-align-center"
          )}
        >
          <ToolbarButton>L</ToolbarButton>
          <ToolbarButton>C</ToolbarButton>
          <ToolbarButton><MyComponent/></ToolbarButton>
        </div>
      </BlurredWrapper>
    </div>
  );
}

function ToolbarButton(props = {}) {
  const { classNames = [], style = {}, children } = props;
  return (
    <div
      {...classes("flex", "center-center", classNames)}
      style={{ width: "75px", height: "75px", ...style }}
    >
      {children}
    </div>
  );
}

export default AppHeader;
