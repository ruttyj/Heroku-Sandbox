const SocketHandler = require('../../../lib/ActionHandler');
const IsHost = require('../Person/IsHost');
const Person = require('../../../models/Person');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const fn = () => {
      const room = req.get('room');

      console.log('X');
      
      //---------------------------------
      // Create Game
      room.createGame();
      const game = room.getGame();


      // Find people ready to play
      const readyPeople = room.getEveryone()
                               .filter(person => person.hasTag(Person.TYPE_MEMBER) 
                                              && person.hasTag(Person.IS_READY))
      
      
                                              // Add person to the game as a player      
      readyPeople.forEach(person => {
        game.addPerson(person);
      })
      console.log('YZ');

      game.dealInitialCards();
      console.log('Z');
      
      console.log(game.serializePlayers());

      //---------------------------------
      // Exxecute next handler
      this.next(req, res);
    }
    const handler = new IsHost(fn);
    handler.execute(req, res);
  }
}
