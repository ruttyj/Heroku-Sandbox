const Card = require('./Card');

module.exports = class NumberCard extends Card
{
  constructor()
  {
    super();
    this.mType = 'NUMBER';
    this.mValue;
  }

  setValue(v)
  {
    this.mValue = v;
  }

  getValue()
  {
    return this.mValue;
  }

  serialize()
  {
    return {
      id:     this.getId(),
      type:   this.getType(),
      value:  this.getValue(),
    }
  }
}