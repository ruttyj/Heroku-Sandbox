import Particle from './Particle';

export default class ParticleSystem {
  constructor(p5, maxNumber, position, gravity) {
    //-----------------------------------------
    this.mIsActive = true;
    this.mPosition = position.copy();
    this.mMaxNumber = maxNumber;
    this.mGravity = gravity;
    this.mFriction = 0.98;
    this.mParticles = [];
    for (var i = 0; i < this.mMaxNumber; i++) {
      this.mParticles.push(new Particle(p5, this));
    }
  }

  getPosition()
  {
    return this.mPosition.copy();
  }

  setActive(val)
  {
    this.mIsActive = val;
    this.mParticles.forEach(particle => {
      particle.setActive(this.mIsActive);
    })
  }

  isActive()
  {
    return this.mIsActive;
  }

  update(p5)
  {
    this.mParticles.forEach(particle => {
      particle.setActive(this.mIsActive);
      particle.update(p5);
    })
  }

  draw(p5)
  {
    this.mParticles.forEach(particle => {
      particle.draw(p5);
    })
  }

}
