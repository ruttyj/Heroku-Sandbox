import React, { useState, useEffect, useRef } from "react";
import Utils from "./Utils";
import { motion, AnimatePresence } from "framer-motion";
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
  createDebugger,
  createWindowA,
  createWallpaperWindow,
} from "../../Imports";
import { useBufferedStateContext  } from "../../../state/bufferedContext";
import { useConnectionContext } from "../../../state/connectionContext";

const {
  els,
  isDef,
  classes,
  setImmutableValue,
} = Utils;

function Home(props) {
  //console.log("#####################################################");
  const [isMounted, setMounted] = useState(false);
  const bufferedState = useBufferedStateContext();
  const { set, get, remove } = bufferedState;

  const windowManagerRef = useRef(WindowManager(bufferedState));
  const windowManager = windowManagerRef.current;


  // Socket Connection to serverside
  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();
  
  useEffect(() => {
    if (!isMounted) {
      //-------------------
      
      set([], {
        theme: {
          wallpaper: els(wallpapers[9], wallpapers[0]), // set default url
        }
      })
      windowManager.init();
      createWindowA(windowManager, true);
      createWallpaperWindow(windowManager, false);
      //-------------------
      setMounted(true);
    }
  }, [isMounted]);


  // Set listeners
  useEffect(() => {
    if (isConnected) {
      
      socket.on('time', (timeString) => {
        set(['time'], timeString);
      });

      socket.on('message', (messageModel) => {
        console.log('message', messageModel);
        let chatMessages = get(['chat_messages'], []);
        chatMessages = [...chatMessages, messageModel];
        set(['chat_messages'], chatMessages);
      });


      socket.on('chat_transcript', (transcript) => {
        let chatMessages = transcript.messages;
        set(['chat_messages'], chatMessages);
      })

      socket.on('connection', (data) => {
        set(['connection'], data);
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
        set(['me'], data);
      })

      socket.on('room_list', (payload) => {
        set(['room_list'], payload.data);
      })


      socket.on('room_people_all_keyed', (payload) => {
        console.log('room_people_all_keyed', payload);
        set(['people'], payload);
      })
      

      socket.emit("get_connection_type");
      
      socket.emit('register_person', 'Tyler');
      socket.emit('join_room', 'test');
      
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
          <div {...classes("truncate-inner")} key={window.id}>
            {window.title} 
          </div>
          <a onClick={() => {
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
      </AppSidebar>
      <FillContainer>
        <FillHeader>
          <AppHeader />
        </FillHeader>
        <FillContent>
          <WindowContainer
            windowManager={windowManager}
            children={({ containerSize }) => (
              <>
                {windowManager.getAllWindows().map((window) => {
                  const contents = (
                    <DragWindow
                      window={window}
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
                      onUp={(window) => {
                        // renable pointer events for other windows
                        windowManager.toggleOtherWindowsPointerEvents(
                          window.id,
                          false
                        );
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
          />
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
                {get(['time'])}
              </div>
            </BlurredWrapper>
          </div>
        </FillFooter>
      </FillContainer>
    </motion.div>
  );
}

export default Home;
