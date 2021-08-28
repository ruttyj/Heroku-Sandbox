const SocketHandler = require('../../../lib/ActionHandler');
const Person = require('../../../models/Person');

module.exports = class extends SocketHandler {
  execute(req, res) {
    const room = req.get('room');
    const me = req.get('person');

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

    game.dealCheatCards();
    //game.dealInitialCards(); 
    

    //---------------------------------
    // Exxecute next handler
    this.next(req, res);
  }
}
