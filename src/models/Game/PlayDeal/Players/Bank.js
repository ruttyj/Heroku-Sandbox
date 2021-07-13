const CardContainer = require('../Cards/CardContainer');

module.exports = class Bank 
{
  constructor()
  {
    this.mCards = new CardContainer();
    this.mTotal = 0;
  }
}