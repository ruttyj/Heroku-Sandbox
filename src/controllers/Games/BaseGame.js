const ProtectedHandler = require('../../lib/ProtectedHandler');
const personController = require('../Person/Person');
const Person = require('../../models/Person');

const baseGameCntroller = {

  startGame: (next = null) => new (class extends ProtectedHandler {
    require() 
    {
      return [
        personController.requireIsHost(),
      ]
    }
    run(req, res, next)
    {
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

      //game.dealInitialCards();
      game.dealCheatCards();

      //---------------------------------
      // Exxecute next handler
      next(req, res);
    }
  })(next),


  endGame: (next = null) => new (class extends ProtectedHandler {
    require() 
    {
      return [
        personController.requireIsHost(),
      ]
    }
    run(req, res, next)
    {
      next(req, res);
    }
  })(next),
}

module.exports = baseGameCntroller;