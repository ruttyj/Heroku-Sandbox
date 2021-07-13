module.exports = class CardContainer 
{
  constructor()
  {
    this.mItem = new Map();
  }

  add(card)
  {
    this.mItem.set(card.id, card);
  }

  remove(cardId)
  {
    this.mItem.delete(card.id);
  }

  
  has(cardId)
  {
    this.mItem.has(card.id);
  }
}