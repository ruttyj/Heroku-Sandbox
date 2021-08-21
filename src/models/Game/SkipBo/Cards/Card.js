module.exports = class Card
{
  constructor()
  {
    this.mId;
    this.mType = 'BASE';
  }

  setId(id)
  {
    this.mId = id;
  }

  getId()
  {
    return this.mId;
  }

  getType()
  {
    return this.mType;
  }

  serialize()
  {
    return {
      id:   this.getId(),
      type: this.getType(),
    }
  }
}