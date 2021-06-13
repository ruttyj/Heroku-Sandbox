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
import createWallpaperWindow from './BackgroundPicker';
import createSocketWindow from './SocketWindow';
import { useGlobalContext  } from "../../../state/globalContext";
import { useConnectionContext } from "../../../state/connectionContext";
import GamesIcon from '@material-ui/icons/Games';
import ChatIcon from '@material-ui/icons/Chat';
import ExtensionIcon from '@material-ui/icons/Extension';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import SettingsIcon from '@material-ui/icons/Settings';
import DnD from './DnD';
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
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();


  useOnMount(() => {
    set([], {
      theme: {
        wallpaper: els(wallpapers[4], wallpapers[0]), // set default url
      }
    })
    windowManager.init();
    createChatWindow(windowManager, true);
    //createSocketWindow(windowManager, true);
    //createDebugger(windowManager);
  })
  
  useOnUnmount(() => {
    // clear socket listners in case of hot reload / page navigation
    socket.off();
  })



  // Set listeners
  useEffect(() => {
    if (isConnected) {
      
      socket.on('time', (timeString) => {
        set(['time'], timeString);
      });


      socket.on('chat_transcript', (transcript) => {
        let chatMessages = transcript.messages;
        set(['chat_messages'], chatMessages);
      })

      socket.on('connection', (data) => {
        set(['connection'], data);
      })

      socket.on('debug', (data) => {
        console.log('debug', data);
      })

      socket.on('leave_room', (data) => {
        console.log('left room');
      })
      

      socket.on('room', (data) => {
        console.log('room', data);
        set(['room'], data);
      })

      socket.on('connection_type', (data) => {
        set(['connection_type'], data);
      })

      socket.on('me', (data) => {
        console.log('me', (data));
        set(['me'], data);
      })

      socket.on('room_list', (payload) => {
        set(['room_list'], payload.data);
      })


      socket.on('room_people_all_keyed', (payload) => {
        console.log('room_people_all_keyed', payload);
        set(['people'], payload);
      })
      
      socket.emit('join_room', 'test');
      socket.emit('register_in_room', 'Smith');
      
    } else if (socket) {
      socket.off('time');
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
          <a style={{padding: "15px"}} onClick={() => {
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
        <div {...classes("button")} onClick={() => openBackgroundPicker()}>
          <PhotoSizeSelectActualIcon />
        </div>
       
        <div {...classes("button")} onClick={() => openDebuggerV2()}>
          <BugReportIcon />
        </div>
        
        <div {...classes("button")} onClick={() => createSocketWindow(windowManager, true)}>
          <SettingsIcon />
        </div>

        <div {...classes("button")} onClick={() => createThreeJsWindow(windowManager, true)}>
          <GraphicEqIcon />
        </div>
        <div {...classes("button")} onClick={() => openChatWindow()}>
          <ChatIcon />
        </div>

        
        
      </AppSidebar>
      <FillContainer>
        <FillHeader>
          <AppHeader />
        </FillHeader>
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
    </motion.div>
  );
}

export default Home;
