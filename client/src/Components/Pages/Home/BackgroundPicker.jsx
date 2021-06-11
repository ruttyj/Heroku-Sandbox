import React, { useState } from "react";
import Utils from "./Utils";
import wallpapers from "../../../Data/Wallpapers";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import RegisterForm from "./RegisterForm";
import JoinRoomForm from "./JoinRoomForm";
import ChatForm from "./ChatForm";
import { useConnectionContext } from "../../../state/connectionContext";
import { useGlobalContext  } from '../../../state/globalContext';


const { classes } = Utils;

function WindowAComponent(props) {
  const { size, position, containerSize } = props;
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

  return (
    <div>
      Hello World!
      <br/>
      <RegisterForm/>
      <JoinRoomForm/>
      <ChatForm/>
    </div>
  );
}

function createWallpaperWindow(windowManager, isFocused = true) {
  const ChooseWallpaper = props => {
    return (
      <div {...classes("full", "v-fit-content", "wrap")}>
        {wallpapers.map(url => {
          return (
            <div
            key={url}
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                content: "",
                width: "25%",
                height: "150px",
                cursor: "pointer"
              }}
              onClick={() => {
                let state = windowManager.getState();
                state.set(["theme", "wallpaper"], url);
              }}
            />
          );
        })}
      </div>
    );
  };

  // Dragable Lists window
  windowManager.createWindow({
    title: "Background Picker",
    key: "backgroundPicker",
    isFocused,
    position: {
      left: 300,
      top: 50
    },
    size: {
      width: 700,
      height: 400
    },
    children: ChooseWallpaper
  });
}

function createWindowA(windowManager, isFocused = true) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "Window A",
    isFocused,
    position: {
      left: 300,
      top: 50
    },
    size: {
      width: 700,
      height: 700
    },
    children: (props) => {
      return (
        <FillContainer>
          <FillContent
            classNames={[
              "window-content",
              "tint-bkgd",
              "column",
            ]}
          >
            <WindowAComponent {...props}/>
          </FillContent>
          <FillFooter
            height={40}
            classNames={["footer", "actions", "center-center"]}
          >
            <div {...classes("spacer")} />
            <div {...classes("button", "not-allowed")}>Cancel</div>
            <div {...classes("button", "not-allowed")}>Confirm</div>
          </FillFooter>
        </FillContainer>
      )
    },
  });
}

export default createWallpaperWindow;
