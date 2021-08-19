const Card = require('./Card');

module.exports = class NumberCard extends Card
{
  constructor()
  {
    super();
    this.mType = 'NUMBER';
  }
}