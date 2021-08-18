import React from 'react';
import Sketch from 'react-p5';
import useParticleSystem from '../../../Sketches/Confetti/useParticleSystem';

///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default () => {
  const particleSystem = useParticleSystem();

  function setup(p5, parentRef) {
    p5.createCanvas(480, 600).parent(parentRef);
    particleSystem.setup(p5);
    particleSystem.setIsActive(true);
    setTimeout(() => {
      particleSystem.setIsActive(false);
    }, 1000)
  };

  function draw(p5) {
    particleSystem.render(p5);
  }

  let isSystemActive = particleSystem.getIsActive();
  const toggleSystem = () => particleSystem.setIsActive(!isSystemActive);

  const absolute = {
    position: 'absolute',
    width: '100%',
    height: '100%',
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
    }}>
      <div style={{
        ...absolute
      }}>
        <button onClick={toggleSystem}>{isSystemActive ? "System On" : "System Off"}</button>
      </div>
      <div style={{
        ...absolute,
        pointerEvents: 'none'
      }}>
        <Sketch setup={setup} draw={draw} />

      </div>
    </div>
  );
}