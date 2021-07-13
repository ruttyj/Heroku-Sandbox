const PhaseCycle = require('./Phase/PhaseCycle');
const TurnPhase = require('./Phase/TurnPhase');

module.exports = class PlayerTurn
{
  constructor(player)
  {
    this.mPlayer = player;
    this.mTurnPhaseCycle = new PhaseCycle();
    this.mTurnPhase = new TurnPhase();
  }
}