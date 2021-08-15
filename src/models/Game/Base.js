module.exports = class Base {

  constructor() {
    this.mType = 'BASE';
    this.mIsInProgress;
    this.mIsGameOver;
    this.mConfig;
    this.reset();
    console.log('new Game');
  }

  reset() {
    this.mIsInProgress = false;
    this.mIsGameOver = false;
    this.mWinner = null;
  }

  //===========================
  // Progress
  startGame() {
    this.reset();
    this.mIsInProgress = true;
  }

  isInProgress() {
    return this.mIsInProgress;
  }

  isGameOver() {
    return this.mIsGameOver;
  }

  endGame() {
    this.mIsGameOver = true;
  }


  //===========================
  // Winner
  getWinner() {
    return this.mWinner;
  }

  hasWinner() {
    return this.mWinner ? true : false;
  }

  setWinner(winner) {
    this.mWinner = winner;
  }


  //===========================
  // Game Over
  isGameOver() {
    return this.mIsGameOver;
  }

  _setIsGameOver(val) {
    this.mIsGameOver = val;
  }

  //===========================
  // Config
  setConfig(config) {
    this.mConfig = config;
  }

  getConfig() {
    return this.mConfig;
  }

  //===========================
  // Type
  getType() {
    return this.mType;
  }

  setType(type) {
    this.mType = type;
  }


  //===========================
  // Serialize
  serialize() {
    return {
      type: this.getType(),
      isInProgress: this.isInProgress(),
      isGameOver: this.isGameOver(),
      hasWinner: this.hasWinner(),
      winner: this.getWinner(),
    }
  }
}