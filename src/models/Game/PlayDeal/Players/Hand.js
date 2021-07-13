const CardContainer = require('../Cards/CardContainer');

module.exports = class Hand 
{
  constructor()
  {
    this.mCards = new CardContainer();
  }
}