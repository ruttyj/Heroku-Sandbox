// Attempting to reproduct https://codepen.io/Gthibaud/pen/ENzXbp
let themeColors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722'
];

export default class Particle {
  constructor(p5, parent) {
    this.mActive = true;
    this.mDead = true;

    this.mParent = parent;
    this.mGravity = parent.gravite ? parent.gravite : p5.createVector(0, 0.1);
    this.reinit(p5);
    this.mForm = p5.round(p5.random(0, 1));
    this.mVerticalScale = 0;
    this.prise = 0;
    this.priseFacteur = p5.random(-0.02, 0.02);
    this.multFacteur = p5.random(0.01, 0.08);
    this.priseAngle = 0;
    this.priseVitesse = 0.05;
  }

  _setDead(val) {
    this.mDead = val;
  }

  isDead() {
    return this.mDead;
  }

  setActive(val) {
    this.mActive = val;
    if (val) {
      this._setDead(false);
    }
  }

  isActive() {
    return this.mActive;
  }

  reinit(p5) {
    if (this.isActive()) {
      this.mPosition = this.mParent ? this.mParent.getPosition() : p5.createVector(0, 0);
      this.mPosition.y = p5.random(-20, -100);
      this.mPosition.x = p5.random(0, p5.width);
      this.mVelocity = p5.createVector(p5.random(-6, 6), p5.random(-10, 2));
      this.mFriction = p5.random(0.995, 0.98);
      this.mSize = p5.round(p5.random(5, 15));
      this.mOffset = this.mSize / 2;
      this.mColor = p5.color(p5.random(themeColors));
    } else {
      this._setDead(true);
    }
  }

  update(p5) {
    if (!this.isDead()) {
      this.mVelocity.add(this.mGravity);
      this.mVelocity.x += this.prise;
      this.mVelocity.mult(this.mFriction);
      this.mPosition.add(this.mVelocity);
      if (this.mPosition.y > p5.height) {
        this.reinit(p5);
      }

      if (this.mPosition.x < 0) {
        this.reinit(p5);
      }
      if (this.mPosition.x > p5.width + 10) {
        this.reinit(p5);
      }

      this.mVerticalScale = 0.5 + Math.sin(this.mVelocity.y * 20) * 0.5;
      this.prise = this.priseFacteur + Math.cos(this.priseAngle) * this.multFacteur;
      this.priseAngle += this.priseVitesse;
    }
  }

  draw(p5) {
    if (!this.isDead()) {
      // Push world transform matrix
      p5.push();

      p5.translate(this.mPosition.x, this.mPosition.y);
      p5.rotate(this.mVelocity.x * 2);
      p5.scale(1, this.mVerticalScale);
      p5.noStroke();
      p5.fill(this.mColor);

      if (this.mForm === 0) {
        p5.rect(-this.mOffset, -this.mOffset, this.mSize, this.mSize);
      } else {
        p5.ellipse(0, 0, this.mSize, this.mSize);
      }

      // Pop world transform matrix
      p5.pop();
    }
  }
}