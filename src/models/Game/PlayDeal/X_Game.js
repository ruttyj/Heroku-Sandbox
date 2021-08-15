const PlayerContainer = require('./Players/PlayerContainer');
const PlayerTurn = require('./Turn/PlayerTurn');

class TurnManager {
  constructor(initialOrder = []) {
    this.mTurnSequence = initialOrder;
    this.mCurrentTurnIndex = 0;
  }

  getCurrentTurn() {
    return this.mTurnSequence[this.mCurrentTurnIndex];
  }

  nextTurn() {
    this.mCurrentTurnIndex = (this.mCurrentTurnIndex % (this.mCurrentTurnIndex.length));
  }
}


//////////////////////////////////////////
// GAME
module.exports = class PlayDealGame {
  constructor() {
    this.mGamePhase = 'init';
    this.mGamePhases = ['init', 'inProgress', 'finish'];
    this.mGameConfig = null;
    this.mTurn = null;
    this.mPlayers = new PlayerContainer();
    this.mCurrentPlayerTurn = new PlayerTurn();
    this.mTurnManager = new TurnManager();
  }

  addPlayer(player) {
    this.mPlayers.add(player);
  }

  getPlayers() {
    return this.mPlayers.map(p => p);
  }

  startGame() {

  }

  endGame() {

  }

  makeTurn(player) {
    this.mTurn = new PlayerTurn(player);
  }

}