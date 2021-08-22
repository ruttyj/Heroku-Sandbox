const List = require('../../../../lib/List');
const Hand = require('./Hand');

module.exports = class Player
{
  constructor()
  {
    this.mId;
    this.mPersonId;
    this.mHand;
    this.mDeck;
    this.mPiles;
   
    this.reinit()
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
    this.mHand = new Hand();
  }

  // Id
  setId(id)
  {
    this.mId = id;
  }

  getId()
  {
    return this.mId;
  }

  // PersonId
  setPersonId(personId)
  {
    this.mPersonId = personId;
  }

  getPersonId()
  {
    return this.mPersonId;
  }

  // Hand
  getHand()
  {
    return this.mHand;
  }

  // Deck
  getDeck()
  {
    return this.mDeck;
  }

  getPiles()
  {
    return this.mPiles;
  }

  // Piles
  getPile(i)
  {
    if (0 <= i && i <= 3) {
      return this.mPiles[i];
    }
    return null;
  }

  // Serialize
  serializeMe()
  {
    return {
      id:         this.getId(),
      personId:   this.getPersonId(),
      piles:      this.getPiles().map(pile => pile.serialize()),
      hand:       this.getHand().serializeForMe(),
      deck: {
        count:      this.getDeck().getCount(),
        topCardId:  this.getDeck().peek(),
      },
    }
  }


  serializeOther()
  {
    return {
      id:         this.getId(),
      personId:   this.getPersonId(),
      piles:      this.getPiles().map(pile => pile.serialize()),
      hand:       this.getHand().serializeForOthers(),
      deck: {
        count:      this.getDeck().getCount(),
        topCardId:  this.getDeck().peek(),
      },
    }
  }

}