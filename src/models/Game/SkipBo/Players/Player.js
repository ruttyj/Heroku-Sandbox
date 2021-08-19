const List = require('../../../../lib/List');
module.exports = class Player
{
  constructor()
  {
    this.mHand;
    this.mDeck;
    this.mPiles;

    reinit()
  }

  reinit()
  {
    this.mPiles = [
      new List(),    
      new List(),    
      new List(),    
      new List(),    
    ];

    this.mDeck = new List();
    this.mHand = new List();
  }

  getHand()
  {
    return this.mHand;
  }

  getDeck()
  {
    return this.mDeck;
  }

  getPile(i)
  {
    if (0 <= i && i <= 3) {
      return this.mPiles[i];
    }
    return null;
  }
}