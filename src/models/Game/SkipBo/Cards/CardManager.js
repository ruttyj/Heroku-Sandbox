const NumberCard = require('./NumberCard');
const WildCard = require('./WildCard');
const OrderedMap = require('../../../../lib/OrderedMap');
module.exports = class CardManager 
{

  constructor()
  {
    this.mTopId = 0;
    this.mCardMap;
  }

  _getNewId()
  {
    return ++this.mTopId;
  }

  makeCards()
  {
    this.mCardMap = new OrderedMap();

    // Make 12 sets of number cards
    for(let i=0; i<12; ++i)
    {
      this._makeSetOfNumberCards();
    }

    // Make 18 wildcards
    for(let i=0; i<18; ++i) {
      this._makeWildCard();
    }
  }

  getCards()
  {
    return this.mCardMap;
  }

  // Make 1 set of cards from 1 to 12
  _makeSetOfNumberCards()
  {
    for(let i=0; i<12; ++i)
    {
      const card = new NumberCard();
      const cardId = this._getNewId();
      card.setId(cardId);
      card.setValue(i);

      this.mCardMap.set(cardId, card);
    }
  }

  _makeWildCard()
  {
    const card = new WildCard();
    const cardId = this._getNewId();
    card.setId(cardId);

    this.mCardMap.set(cardId, card);
  }
}