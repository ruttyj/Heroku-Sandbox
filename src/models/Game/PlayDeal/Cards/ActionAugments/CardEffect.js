module.exports = class CardEffect 
{
  constructor(card)
  {
    this.mType = null;
    this.mCard = card;
  }

  getType()
  {
    return this.mType; 
  }
}