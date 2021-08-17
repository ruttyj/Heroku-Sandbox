import React, { useState, useEffect, useRef } from "react";
import Utils from "./Utils";
import { motion, AnimatePresence } from "framer-motion";
import { useOnMount, useOnUnmount } from 'react-hookedup';
import {
  FillContainer,
  FillContent,
  FillHeader,
  FillFooter,
  DragWindow,
  WindowContainer,
  DragListH,
  BlurredWrapper,
  AppSidebar,
  AppHeader,
  WindowManager,
  BugReportIcon,
  ArrowToolTip,
  wallpapers,
  PhotoSizeSelectActualIcon,
} from "../../Imports";
import createThreeJsWindow from './ThreeJsWindow';
import createDebugger from './DebugWindow';
import createChatWindow from './ChatWindow';
import createRoomLobby from './RoomLobby/Window';
import createWallpaperWindow from './BackgroundPicker';
import createSocketWindow from './SocketWindow';
import createGameWindow from './GameWindow';
import createDnDWindow from './DnDWindow';
import createGreedyWindow from './Greedy/Window';
import createTreeUIWindow from './TreeUI/Window';
import createRoomConfigWindow from './RoomConfig/Window';
import createP5Window from './P5/Window';
import createMyDetailsWindow from './MyDetails/Window';
import openPeopleListWindow from './PeopleList/Window';
import openSkipBoWindow from './SkipBo/Window';

import createMinecraftUI2 from './MinecraftUI2/Window';
import createClickerWindow from './Clicker/Window';
import createFramerMotionDrop from './FramerMotionDrop/Window';
import { useGlobalContext } from "../../../state/globalContext";
import { useConnectionContext } from "../../../state/connectionContext";
import ChatIcon from '@material-ui/icons/Chat';
import GitHubIcon from '@material-ui/icons/GitHub';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import SettingsIcon from '@material-ui/icons/Settings';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import CakeIcon from '@material-ui/icons/Cake';
import { getRandomAnimal } from '../../../Data/Animals';
import useDataHelper from '../../../state/StateHelper/roomHelper';

const {
  els,
  isDef,
  classes,
  setImmutableValue,
  setNestedValue,
  getNestedValue,
} = Utils;

function Home(props) {
  //console.log("#####################################################");
  const bufferedState = useGlobalContext();
  const { set, get, remove, windowManager } = bufferedState;

  // Socket Connection to serverside
  const { isConnected, getSocket } = useConnectionContext();
  const socket = getSocket();

  const {
    amIHost,
    getRoomConfigs,
    getGame,
    hasGame,
    addConnectionListeners,
    removeConnectionListeners,
    addRoomListeners,
    removeRoomListeners,
    joinRoom,
    registerInRoom,
  } = useDataHelper();


  useOnMount(() => {
    set([], {
      theme: {
        wallpaper: els(wallpapers[7], wallpapers[0]), // set default url
      }
    })
    windowManager.init();
    //createTreeUIWindow(windowManager, true);
    //createGreedyWindow(windowManager, true);
    //createFramerMotionDrop(windowManager, true);
    //createMinecraftUI2(windowManager, true);
    createMyDetailsWindow(windowManager, true);
    openPeopleListWindow(windowManager, true);
    //createRoomLobby(windowManager, true);
    //createClickerWindow(windowManager, true);
    createRoomConfigWindow(windowManager, true);
    createP5Window(windowManager, true);
    openSkipBoWindow(windowManager, true);
    //createChatWindow(windowManager, true);
    //createGameWindow(windowManager, true);
    //createSocketWindow(windowManager, true);
    //createDebugger(windowManager);
    //createDnDWindow(windowManager, true);
  })

  useOnUnmount(() => {
    // clear socket listners in case of hot reload / page navigation
    if (socket) {
      socket.off();
    }
  })



  // Set listeners
  useEffect(() => {
    if (isConnected) {
      addConnectionListeners();
      addRoomListeners();

      // Join room for testing purposes
      joinRoom('test');
      registerInRoom();

      setTimeout(() => {
        if (amIHost()) {
          const roomConfigs = getRoomConfigs();
          roomConfigs.updateFieldValue('GAME_TYPE', 'SKIPBO');
          const game = getGame();
          game.startGame();
        }
      }, 2000);
      
    } else if (socket) {
      removeRoomListeners();
      removeConnectionListeners();
    }
  }, [isConnected])


  const openDebuggerV2 = () => {
    let window = windowManager.getWindowByKey("debuggerV2");
    if (isDef(window)) {
      windowManager.setFocused(window.id);
    } else {
      createDebugger(windowManager);
    }
  };

  const openBackgroundPicker = () => {
    let window = windowManager.getWindowByKey("backgroundPicker");
    if (isDef(window)) {
      windowManager.setFocused(window.id);
    } else {
      createWallpaperWindow(windowManager);
    }
  };


  const openChatWindow = () => {
    let window = windowManager.getWindowByKey("chat");
    if (isDef(window)) {
      windowManager.setFocused(window.id);
    } else {
      createChatWindow(windowManager, true);
    }
  };


  // Create Task bar items
  let taskBarItems = {};
  windowManager.getOrderedWindows().forEach((window) => {
    let outterClasses = [];
    if (window.isOpen) outterClasses.push("open");
    if (window.isFocused) outterClasses.push("focused");

    taskBarItems[window.id] = (
      <ArrowToolTip title={window.title} placement="top">
        <div
          {...classes("button", "noselect", outterClasses)}
          key={window.id}
          onClick={() => windowManager.toggleWindow(window.id)}
        >
          <div {...classes("truncate-inner", "full-width")} key={window.id}>
            {window.title}
          </div>
          <a style={{ padding: "15px" }} onClick={() => {
            windowManager.removeWindow(window.id)
          }}>x</a>
        </div>
      </ArrowToolTip>
    );
  });

  let wallpaper = get(["theme", "wallpaper"]);
  const style = {
    "--bkgd-image": `url("${wallpaper}")`,
  };









  return (
    <motion.div {...classes("full", "row", "main-bkgd")} style={style}>
      <AppSidebar>


        <div {...classes("button")} onClick={() => window.open('https://github.com/ruttyj/Heroku-Sandbox', '_blank').focus()}>
          <GitHubIcon />
        </div>


        <div {...classes("button")} onClick={() => openBackgroundPicker()}>
          <PhotoSizeSelectActualIcon />
        </div>


        <div {...classes("button")} onClick={() => openDebuggerV2()}>
          <BugReportIcon />
        </div>


        <div {...classes("button")} onClick={() => createThreeJsWindow(windowManager, true)}>
          <GraphicEqIcon />
        </div>


        <div {...classes("button")} onClick={() => openChatWindow()}>
          <ChatIcon />
        </div>

        <div {...classes("button")} onClick={() => createSocketWindow(windowManager, true)}>
          <SettingsIcon />
        </div>


        <div {...classes("button")} onClick={() => createRoomConfigWindow(windowManager, true)}>
          <SettingsIcon />
        </div>

        <div {...classes("button")} onClick={() => createMinecraftUI2(windowManager, true)}>
          <VideogameAssetIcon />
        </div>

        <div {...classes("button")} onClick={() => createP5Window(windowManager, true)}>
          <CakeIcon />
        </div>



      </AppSidebar>
      <FillContainer>
        <FillContent>
          <WindowContainer
            windowManager={windowManager}
          >
            {({ containerSize }) => (
              <>
                {windowManager.getAllWindows().map((window) => {
                  const contents = (
                    <DragWindow
                      window={window}
                      windowManager={windowManager}
                      onSet={(path, value) =>
                        windowManager.setWindow(
                          window.id,
                          setImmutableValue(window, path, value)
                        )
                      }
                      onSetSize={(...args) =>
                        windowManager.setSize(window.id, ...args)
                      }
                      onSetPosition={(...args) => {
                        windowManager.setPosition(window.id, ...args);
                      }}
                      onClose={() => windowManager.removeWindow(window.id)}
                      onToggleWindow={() =>
                        windowManager.toggleWindow(window.id, true)
                      }
                      onSetFocus={(value) =>
                        windowManager.setFocused(window.id, value)
                      }
                      onDown={(window) => {
                        // allow dragging to be unaffected incase the other window prevents event propagation
                        windowManager.toggleOtherWindowsPointerEvents(
                          window.id,
                          true
                        );
                      }}
                      onDrag={(window) => {
                        window = windowManager.getWindow(window.id);

                        const setOnWindow = (window, path, value) => {
                          if (getNestedValue(window, path) !== value) {
                            setNestedValue(window, path, value);
                            windowManager.setWindow(window.id, window);
                            console.log('set');
                          }
                        }

                        if (window.position.left < 100) {
                          setOnWindow(window, 'backgroundColor', 'cyan');
                        } else {
                          setOnWindow(window, 'backgroundColor', null);
                        }

                      }}
                      onUp={(window) => {
                        // renable pointer events for other windows
                        windowManager.toggleOtherWindowsPointerEvents(
                          window.id,
                          false
                        );

                        console.log('window.position', window.position);


                      }}
                      title={window.title}
                      containerSize={containerSize}
                      children={window.children}
                      actions={window.actions}
                    />
                  );
                  return (
                    <AnimatePresence key={window.id}>
                      {contents}
                    </AnimatePresence>
                  );
                })}
              </>
            )}
          </WindowContainer>

        </FillContent>
        <FillFooter height={60}>
          <div {...classes("full")}>
            <BlurredWrapper>
              <div {...classes("taskbar", "full", "tinted-dark")}>
                <DragListH
                  items={taskBarItems}
                  order={windowManager.getTaskbarOrder()}
                  setOrder={(newOrder) => {
                    windowManager.setTaskbarOrder(newOrder);
                  }}
                />
                <div {...classes('system-clock')}>
                  {String(get(['time'])).split(" ")[0]}
                </div>
              </div>
            </BlurredWrapper>
          </div>
        </FillFooter>
      </FillContainer>
    </motion.div >
  );
}

export default Home;
