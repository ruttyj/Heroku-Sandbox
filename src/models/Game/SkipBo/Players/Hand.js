const OrderedMap  = require('../../../../lib/OrderedMap');
module.exports = class 
{
  constructor()
  {
    this.mCards;

    this.reinit();
  }

  reinit()
  {
    this.mCards = new OrderedMap();
  }

  addCard(cardId)
  {
    this.mCards.add(cardId);
  }

  removeCard(cardId)
  {
    this.mCards.remove(cardId);
  }

  hasCard(cardId)
  {
    return this.mCards.has(cardId);
  }

  getCount()
  {
    return this.mCards.getCount();
  }

  getCards()
  {
    return this.mCards.toArray();
  }

  serializeForMe()
  {
    return {
      cards: this.getCards(),
    }
  }

  serializeForOthers()
  {
    return {
      count: this.getCount(),
    }
  }
}