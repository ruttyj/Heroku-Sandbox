const Hand = require('./Hand');
const Bank = require('./Bank');
const CollectionContainer = require('./Collections/CollectionContainer');

module.exports = class Player 
{
  constructor(playerId)
  {
    this.playerId = playerId;
    this.mName = 'unnamed';
    this.mPersonId = null;
    this.mHand = new Hand();
    this.mBank = new Bank();
    this.mCollections = new CollectionContainer();
  }

  setPersonId(id)
  {
    this.mPersonId = id;
  }

  getPersonId()
  {
    return this.mPersonId;
  }

  setName(name)
  {
    this.mName = name;
  }

  getName()
  {
    return this.mName;
  }

  getHand()
  {
    return this.mHand;
  }

  getBank()
  {
    return this.mBank;
  }

  getCollections()
  {
    return this.mCollections;
  }
}