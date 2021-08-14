import React, { useRef } from 'react';
import Sketch from 'react-p5';

// Attempting to reproduct https://codepen.io/Gthibaud/pen/ENzXbp
let themeColors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722'
];

class Particle {
  constructor(p5, parent) {
    this.y = 0;
    this.x = 0;
  }

  reinit(p5)
  {
    this.y = 0; 
  }

  update(p5)
  {
    if (this.y > p5.height) {
      this.reinit(p5);
    }
    else {
      this.y += 8;
    }
  }

  draw(p5)
  {
    let y = this.y;
    let x = this.x;
    let color = [255, y * 1.3, 0];
    let position = [x, y];
    let size = 7;


    p5.fill(color);
    p5.rect(...position, size, size);
  }
}

function useParticleSystem() {
  const y = useRef(0);
  const mParticles = useRef([]);

 
  function setup(p5)
  {
    mParticles.current = [];
    for (let i=0; i< 10; ++i) {
      mParticles.current.push(makeParticle(p5));
    }
  }

  function makeParticle(p5)
  {
    let particle = new Particle(p5);
    particle.y = 0;
    particle.x = p5.random(0, p5.width);

    return particle;
  }

  function update(p5)
  {
    getParticles().forEach(particle => {
      particle.update(p5);
    })
  }

  function draw(p5)
  {
    update(p5);
    p5.clear();
    getParticles().forEach(particle => {
      particle.draw(p5);
    })
  }

  function getParticles()
  {
    return mParticles.current;
  }


  function getPublic()
  {
    return {
      setup,
      update,
      draw,
    }
  }
  
  return getPublic();
}


///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default () => {
  const particleSystem = useParticleSystem();
  
  function setup (p5, parentRef) {
    p5.createCanvas(200, 200).parent(parentRef);
    particleSystem.setup(p5);
  };


  return (
    <div className="App">
      <h1>react-p5</h1>
      <Sketch setup={setup} draw={particleSystem.draw} />
    </div>
  );
}