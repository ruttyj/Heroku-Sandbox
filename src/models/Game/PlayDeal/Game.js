const Base = require('../Base');
module.exports = class PlayDeal extends Base {
  constructor() {
    super();
    this.mType = 'PLAYDEAL';
    console.log('PLAYDEAL');
  }
}