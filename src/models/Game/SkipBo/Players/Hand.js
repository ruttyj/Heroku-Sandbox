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

  add(cardId)
  {
    this.mCards.add(cardId);
  }

  remove(cardId)
  {
    this.mCards.remove(cardId);
  }

  has(cardId)
  {
    return this.mCards.has(cardId);
  }

  getCards()
  {
    return this.mCards.toArray();
  }

  getCount()
  {
    return this.mCards.getCount();
  }

  getAll()
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