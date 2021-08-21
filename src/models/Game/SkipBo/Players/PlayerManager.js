const OrderedMap = require('../../../../lib/OrderedMap');
const Player = require('./Player');

module.exports = class PlayerManager 
{
  constructor() 
  {
    this.mPlayers = new OrderedMap();
    this.mTopId = 0;
  }

  _getNewId()
  {
    return ++this.mTopId;
  }

  makePlayerFromPerson(personId)
  {
    const playerId = this._getNewId();

    const player = new Player();
    player.setId(playerId);
    player.setPersonId(personId);

    this.mPlayers.set(playerId, player);

    return player;
  }

  getPlayerList()
  {
    return this.mPlayers.toArray();
  }
}