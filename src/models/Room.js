const PersonContainer = require('../containers/Person');
const ChatTranscript = require('./Chat/Transcript');
const PlayDealGame = require('./Game/PlayDeal/Game');
const Person = require('./Person');
const Player = require('./Game/PlayDeal/Players/Player');
const RoomConfigs = require('./RoomConfigs');
module.exports = class Room 
{

  static MODE_SETUP = 'setup';
  static MODE_SESSION = 'session';

  constructor(data={})
  {
    this.mId = data.id || 0;
    this.mCode = data.code || 'default';
    this.mPeople = new PersonContainer();
    this.mChat = new ChatTranscript();
    this.mGame = null;
    this.mConfigs = new RoomConfigs(this);
  }

  /*******************************************************
   *                         Id
   *******************************************************/
  setId(value)
  {
      this.mId = value;
  }

  getId()
  {
      return this.mId;
  }

  /*******************************************************
   *                         Code
   *******************************************************/
  setCode(value)
  {
      this.mCode = value;
  }

  getCode()
  {
      return this.mCode;
  }

  /*******************************************************
   *                      People
   *******************************************************/
  addPerson(person)
  {
    this.mPeople.add(person);
  }

  getPerson(personId)
  {
    return this.mPeople.get(personId);
  }

  getPeople()
  {
    return this.mPeople;
  }

  getPersonContainer()
  {
    return this.mPeople;
  }

  getAllPeople()
  {
    return this.mPeople.list();
  }

  getEveryone()
  {
    return this.getAllPeople();
  }

  getEveryoneElse(model)
  {
    return this.mPeople.getEveryoneElse(model);
  }

  removePerson(personId)
  {
    this.mPeople.remove(personId);
  }

  hasPerson(personId)
  {
    return this.mPeople.has(personId);
  }

  hasPeople()
  {
    return !this.mPeople.isEmpty();
  }


  emitToEveryone(eventType, payload)
  {
    this.mPeople.emitToEveryone(eventType, payload);
  }

  emitToEveryoneElse(model, eventType, payload)
  {
    this.mPeople.emitToEveryone(model, eventType, payload);
  }


  destroy() 
  {
    // @TODO
  }

  /*******************************************************
   *                        Chat
   *******************************************************/
  getChat()
  {
    return this.mChat;
  }


  // ----------------------------------------
  hasOrAutoAssignHost() 
  {
    // Update host
    let hasHost = false;
    const connectedPeople = this.getPeople()
                                .filter((p) => p.hasTag(Person.STATUS_CONNECTED));
    const host            = connectedPeople
                                .find(p => p.hasTag(Person.TYPE_HOST)); 
    
    if (host) {
      hasHost = true;
    } else {
      if (connectedPeople.length > 0) {
        connectedPeople.forEach((p) => {
          if (!hasHost) {
            p.addTag(Person.TYPE_HOST);
            hasHost = true;
          } else {
            p.removeTag(Person.TYPE_HOST);
          }
        })
      }
    }                                            
    
    return hasHost;
  }

  /*******************************************************
   *                        Game
   *******************************************************/
  createGame()
  {
    let game = new PlayDealGame();
    this.mGame = game;
    let people = this.mPeople.filter((person) => person.getStatus() === Person.getIsReady());

    people.forEach(person => {
      let player = new Player();
      player.setName(person.getName());
      player.setPersonId(person.getId());
      game.addPlayer(player);
    })

    game.startGame();
  }

  getGame()
  {
    return this.mGame;
  }





  getConfig()
  {
    return this.mConfigs;
  }



  /*******************************************************
   *                      Serialize
   *******************************************************/
  serialize()
  {
    return {
      id: this.getId(),
      code: this.getCode(),
      personCount: this.mPeople.count(),
      configs: this.getConfig().serialize(),
    }
  }
}
