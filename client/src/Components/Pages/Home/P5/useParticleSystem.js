import { useRef, useState } from 'react';

import ParticleSystem from './Sketch/ParticleSystem';

export default function useParticleSystem() {
  const mConfetti = useRef();
  const [mActive, mSetIsActive] = useState(true);

  function setup(p5)
  {
    const gravity = p5.createVector(0, 0.1);
    const position = p5.createVector(p5.width / 2, -20);
    mConfetti.current = new ParticleSystem(p5, 500, position, gravity);
    mConfetti.current.setActive(mActive);
  }

  function update(p5)
  {
    getConfetti().update(p5);
  }

  function draw(p5)
  {
    p5.clear();
    getConfetti().draw(p5);
  }

  function getConfetti()
  {
    return mConfetti.current;
  }

  function setIsActive(value)
  {
    mSetIsActive(value);
    mConfetti.current.setActive(value);
  }

  function render(p5)
  {
    update(p5);
    draw(p5);
  }

  function getIsActive()
  {
    return mActive;
  }


  function getPublic()
  {
    return {
      setup,
      update,
      draw,
      render,
      //------------------
      getIsActive,
      setIsActive,
    }
  }
  
  return getPublic();
}