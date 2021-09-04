const ProtectedHandler = require('../../../lib/ProtectedHandler');
const personController = require('../../Person/Person');

const skipBoController = {
  getEverything: () => new (class extends ProtectedHandler {
    require() 
    {
      return [
        personController.requireRegistered(),
      ]
    }
    run(req, res, next)
    {
      const con = req.getConnection();
      const me = req.get('person');
      const room = req.get('room');

      // Assuming Game has been selected and no game is in progress
      const game = room.getGame();
      con.emit('SKIPBO.game',     game.serialize());
      con.emit('SKIPBO.cards',    game.serializeCards());
      con.emit('SKIPBO.players',  game.serializePlayers());
      con.emit('SKIPBO.deck',     game.serializeDeck());
      con.emit('SKIPBO.piles',    game.serializePiles());
      con.emit('SKIPBO.players',  game.serializePlayers());

      const personManager = game.getPlayerManager();
      const playerList = personManager.getPlayerList();

      const myId = me.getId();
      const myPlayer = playerList.find(player => player.getPersonId() === myId);
      console.log('myPlayer', myPlayer);
      con.emit('SKIPBO.me',  myPlayer.serializeMe());


      // me
        // my_hand
        // my_piles
        // my_deck
      // other_players
        // other_hands
        // other_piles
        // other_decks

      console.log('get everything');
    }
  })(),
}

module.exports = skipBoController;