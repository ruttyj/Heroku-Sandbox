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

  reinit(p5)
  {
    this.y = 0; 
    this.position = p5.createVector(0, 0);//this.parent.position.copy();
    this.position.y = p5.random(-20, -100);
    this.position.x = p5.random(0, p5.width);
    this.velocite = p5.createVector(p5.random(-6, 6), p5.random(-10, 2));
    this.friction = p5.random(0.995, 0.98);
    this.taille = p5.round(p5.random(5, 15));
    this.moitie = this.taille / 2;
    this.couleur = p5.color(p5.random(themeColors));
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

class ParticleSystem 
{
  constructor(p5, parent) {
    this.y = 0;
    this.x = 0;

    this.parent = parent;
    this.gravite = p5.createVector(0, 0.1);//parent.gravite;
    this.reinit();
    this.forme = p5.round(p5.random(0, 1));
    this.etape = 0;
    this.prise = 0;
    this.priseFacteur = p5.random(-0.02, 0.02);
    this.multFacteur = p5.random(0.01, 0.08);
    this.priseAngle = 0;
    this.priseVitesse = 0.05;
  }

  reinit(p5)
  {
    this.y = 0; 

    this.position = this.parent.position.copy();
    this.position.y = p5.random(-20, -100);
    this.position.x = p5.random(0, p5.width);
    this.velocite = p5.createVector(p5.random(-6, 6), p5.random(-10, 2));
    this.friction = p5.random(0.995, 0.98);
    this.taille = p5.round(p5.random(5, 15));
    this.moitie = this.taille / 2;
    this.couleur = p5.color(p5.random(themeColors));
  }

  update(p5)
  {
    if (this.y > p5.height) {
      this.reinit(p5);
    }
    else {
      this.y += 8;
    }

    this.velocite.add(this.gravite);
    this.velocite.x += this.prise;
    this.velocite.mult(this.friction);
    this.position.add(this.velocite);
    if (this.position.y > p5.height) {
      this.reinit();
    }

    if (this.position.x < 0) {
      this.reinit();
    }
    if (this.position.x > p5.width + 10) {
      this.reinit();
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

function useParticleSystem() {
  const y = useRef(0);
  const mParticles = useRef([]);

 
  function setup(p5)
  {
    mParticles.current = [];
    for (let i=0; i< 200; ++i) {
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
    p5.createCanvas(480, 600).parent(parentRef);
    particleSystem.setup(p5);
  };


  return (
    <div>
      <Sketch setup={setup} draw={particleSystem.draw} />
    </div>
  );
}