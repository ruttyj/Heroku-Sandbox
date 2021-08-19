const Card = require('./Card');

module.exports = class WildCard extends Card
{
  constructor()
  {
    super();
    this.mType = 'WILD';
  }
}