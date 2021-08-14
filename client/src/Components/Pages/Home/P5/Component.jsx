import React, { useRef, useState } from 'react';
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

    this.mActive = true;
    this.mDead = false;

    this.parent = parent;
    this.gravite = p5.createVector(0, 0.1);//parent.gravite;
    this.reinit(p5);
    this.forme = p5.round(p5.random(0, 1));
    this.etape = 0;
    this.prise = 0;
    this.priseFacteur = p5.random(-0.02, 0.02);
    this.multFacteur = p5.random(0.01, 0.08);
    this.priseAngle = 0;
    this.priseVitesse = 0.05;
  }

  _setDead(val)
  {
    this.mDead = val;
  }

  isDead()
  {
    return this.mDead;
  }

  setActive(val)
  {
    this.mActive = val;
    if (val) {
      this._setDead(false);
    }
  }

  isActive()
  {
    return this.mActive;
  }

  reinit(p5)
  {
    if(this.isActive()){
      this.y = 0; 
      this.position = p5.createVector(0, 0);//this.parent.position.copy();
      this.position.y = p5.random(-20, -100);
      this.position.x = p5.random(0, p5.width);
      this.velocite = p5.createVector(p5.random(-6, 6), p5.random(-10, 2));
      this.friction = p5.random(0.995, 0.98);
      this.taille = p5.round(p5.random(5, 15));
      this.moitie = this.taille / 2;
      this.couleur = p5.color(p5.random(themeColors));
    } else {
      this._setDead(true);
    }
  }

  update(p5)
  {
    this.velocite.add(this.gravite);
    this.velocite.x += this.prise;
    this.velocite.mult(this.friction);
    this.position.add(this.velocite);
    if (this.position.y > p5.height) {
      this.reinit(p5);
    }

    if (this.position.x < 0) {
      this.reinit(p5);
    }
    if (this.position.x > p5.width + 10) {
      this.reinit(p5);
    }
  }

  draw(p5)
  {
    if(!this.isDead()) {
      this.etape = 0.5 + Math.sin(this.velocite.y * 20) * 0.5;
      this.prise = this.priseFacteur + Math.cos(this.priseAngle) * this.multFacteur;
      this.priseAngle += this.priseVitesse;
      p5.translate(this.position.x, this.position.y);
      p5.rotate(this.velocite.x * 2);
      p5.scale(1, this.etape);
      p5.noStroke();
      p5.fill(this.couleur);
  
      if (this.forme === 0) {
        p5.rect(-this.moitie, -this.moitie, this.taille, this.taille);
      } else {
        p5.ellipse(0, 0, this.taille, this.taille);
      }
  
      p5.resetMatrix();
    }
  }

}

class ParticleSystem {
  constructor(p5, maxNumber, position, gravity) {
    //-----------------------------------------
    this.isActive = true;
    this.position = position.copy();
    this.maxNumber = maxNumber;
    this.gravity = gravity;
    this.friction = 0.98;
    this.particles = [];
    for (var i = 0; i < this.maxNumber; i++) {
      this.particles.push(new Particle(p5, this));
    }
  }

  setActive(val)
  {
    this.isActive = val;
    this.particles.forEach(particle => {
      particle.setActive(this.isActive);
    })
  }

  isActive()
  {
    return this.isActive;
  }

  update(p5)
  {
    this.particles.forEach(particle => {
      particle.setActive(this.isActive);
      particle.update(p5);
    })
  }

  draw(p5)
  {
    this.particles.forEach(particle => {
      particle.draw(p5);
    })
  }

}

function useParticleSystem() {
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


///////////////////////////////////////////////////////////////////
//                          COMPONENT
///////////////////////////////////////////////////////////////////
export default () => {
  const particleSystem = useParticleSystem();
  
  function setup (p5, parentRef) {
    p5.createCanvas(480, 600).parent(parentRef);
    particleSystem.setup(p5);
  };


  let isSystemActive = particleSystem.getIsActive();
  const toggleSystem = () => particleSystem.setIsActive(!isSystemActive);
  return (
    <div>
      <Sketch setup={setup} draw={particleSystem.render} />
      <button onClick={toggleSystem}>{isSystemActive ? "System On" : "System Off"}</button>
    </div>
  );
}