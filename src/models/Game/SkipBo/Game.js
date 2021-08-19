const Base = require('../Base');
const PlayerManager = require('./Players/PlayerManager');
const List = require('../../../lib/List');

module.exports = class SkipBo extends Base {
  constructor() {
    super();
    this.mType = 'SKIPBO';
    this.mPlayerManager;
    this.mDeck;
    this.mPiles;
    this.reinit();
  }

  reinit() {
    this.mPlayerManager = new PlayerManager();
    this.mDeck = new List();
    this.mPiles = [
      new List(),
      new List(),
      new List(),
      new List(),
    ];
  }
}