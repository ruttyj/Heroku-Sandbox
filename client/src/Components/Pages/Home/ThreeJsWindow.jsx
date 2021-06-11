import React, { useState } from "react";
import Utils from "./Utils";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import FillHeader from "../../Containers/FillContainer/FillHeader";
import { useConnectionContext } from "../../../state/connectionContext";
import { useGlobalContext  } from '../../../state/globalContext';
import * as THREE from 'three';
import { Canvas, extend, useFrame, useLoader, useThree } from 'react-three-fiber';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Suspense, useCallback, useMemo, useRef } from 'react';
import circleImg from '../../../assets/particle.png';
extend({OrbitControls})
const { classes } = Utils;



function CameraControls(){
  const {
    camera,
    gl: {domElement}
  } = useThree();

  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update())

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, domElement]}
      autoRotate
      autoRotateSpeed={0}
    />
  );
}

function Points() {
  const imgTex = useLoader(THREE.TextureLoader, circleImg);
  const bufferRef = useRef();

  const time = useRef(0);
  let f = 0.002;
  let a = 3;
  const graph = (x, z) => {
    return Math.sin(f * (x ** 2 + z ** 2 + time.current)) * a;
  }

  const count = 100
  const sep = 3
  let positions = useMemo(() => {
    let positions = []

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);
        let y = graph(x, z);
        positions.push(x, y, z);
      }
    }

    return new Float32Array(positions);
  }, [count, sep, graph])

  useFrame(() => {
    time.current += 15
    
    const positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);

        positions[i + 1] = graph(x, z);
        i += 3;
      }
    }

    bufferRef.current.needsUpdate = true;
  })

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          ref={bufferRef}
          attachObject={['attributes', 'position']}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        attach="material"
        map={imgTex}
        color={0x00AAFF}
        size={1.0}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
}

function AnimationCanvas() {
  return (
    <Canvas
      colorManagement={false}
      camera={{ position: [100, 10, 0], fov: 75 }}
    >
      <Suspense fallback={null}>
        <Points />
      </Suspense>
      <CameraControls/>
    </Canvas>
  );
}


function WindowComponent(props) {
  const { size, position, containerSize } = props;
  const { set, get, remove } = useGlobalContext();

  const { 
    isConnected,
    getSocket,
  } = useConnectionContext();
  const socket = getSocket();

  return (
    <>
      <Suspense fallback={<div>Loading</div>}>
        <AnimationCanvas/>
      </Suspense>
    </>
  );
}

function createThreeJsWindow(windowManager, isFocused = true) {
  // Dragable Lists window
  windowManager.createWindow({
    title: "Particle wave",
    isFocused,
    isFullSize: true,
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
            <WindowComponent {...props}/>
          </FillContent>
        </FillContainer>
      )
    },
  });
}

export default createThreeJsWindow;
