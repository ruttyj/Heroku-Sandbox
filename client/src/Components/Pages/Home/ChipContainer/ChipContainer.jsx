import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import { motion, AnimatePresence } from "framer-motion";
import { useOnMount, useOnUnmount } from 'react-hookedup';
import { useGlobalContext  } from "../../../../state/globalContext";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Container from "./Container";


export default function({children}) {
  return <>
    <div className="full" style={{display:"block"}}>
      <div>
        <DndProvider backend={HTML5Backend}>
          {children}
          <Container/>
        </DndProvider>
      </div>
    </div>
  </>
}