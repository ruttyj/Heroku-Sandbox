const OrderedMap = require('../../../../lib/OrderedMap');

module.exports = class PlayerManager {
  constructor() {
    this.mPlayers = new OrderedMap();
    this.mTopId = 0;
  }

  makePlayerFromPerson(person){

  }
}