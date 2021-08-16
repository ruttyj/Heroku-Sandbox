const PersonContainer = require('../containers/Person');
const ChatTranscript = require('./Chat/Transcript');
const Person = require('./Person');
const RoomConfigs = require('./RoomConfigs');

const BaseGame = require('./Game/Base');
const SkipBoGame = require('./Game/SkipBo/Game');
const PlayDealGame = require('./Game/PlayDeal/Game');
const UnoGame = require('./Game/Uno/Game');
module.exports = class Room {

  static MODE_SETUP = 'setup';
  static MODE_SESSION = 'session';

  constructor(data = {}) {
    this.mId = data.id || 0;
    this.mCode = data.code || 'default';
    this.mPeople = new PersonContainer();
    this.mChat = new ChatTranscript();
    this.mGame = null;
    this.mConfigs = new RoomConfigs(this);
    this.mConfigs.setOnValueChange((key, value) => {
      // huge code smell
      switch (key) {
        case 'GAME_TYPE':
          switch (value) {
            case 'SKIPBO':
              this.setGame(new SkipBoGame());
              break;
            case 'PLAYDEAL':
              this.setGame(new PlayDealGame());
              break;
            case 'UNO':
              this.setGame(new UnoGame());
              break;
            case 'BASE':
            default:
              this.setGame(new BaseGame());
              break;
          }
          this.emitToEveryoneGameState();
          break;
        case 'IS_ROOM_OPEN':
          break;
        default:
      }
    });
  }

  /*******************************************************
   *                         Id
   *******************************************************/
  setId(value) {
    this.mId = value;
  }

  getId() {
    return this.mId;
  }

  /*******************************************************
   *                         Code
   *******************************************************/
  setCode(value) {
    this.mCode = value;
  }

  getCode() {
    return this.mCode;
  }

  /*******************************************************
   *                      People
   *******************************************************/
  addPerson(person) {
    this.mPeople.add(person);
  }

  getPerson(personId) {
    return this.mPeople.get(personId);
  }

  getPeople() {
    return this.mPeople;
  }

  getPersonContainer() {
    return this.mPeople;
  }

  getAllPeople() {
    return this.mPeople.list();
  }

  getEveryone() {
    return this.getAllPeople();
  }

  getEveryoneElse(model) {
    return this.mPeople.getEveryoneElse(model);
  }

  removePerson(personId) {
    this.mPeople.remove(personId);
  }

  hasPerson(personId) {
    return this.mPeople.has(personId);
  }

  hasPeople() {
    return !this.mPeople.isEmpty();
  }

  /*******************************************************
    *                        Socket
    *******************************************************/
  emitToEveryone(eventType, payload) {
    this.mPeople.emitToEveryone(eventType, payload);
  }

  emitToEveryoneElse(model, eventType, payload) {
    this.mPeople.emitToEveryone(model, eventType, payload);
  }

  destroy() {
    // @TODO
  }

  emitToEveryoneGameState() {
    const gameData = this.getGame();
    if (gameData) {
      this.emitToEveryone('game', gameData.serialize());
    }
  }


  /*******************************************************
   *                        Chat
   *******************************************************/
  getChat() {
    return this.mChat;
  }

  // ----------------------------------------
  hasOrAutoAssignHost() {
    // Update host
    let hasHost = false;
    const connectedPeople = this.getPeople()
      .filter((p) => p.hasTag(Person.STATUS_CONNECTED));
    const host = connectedPeople
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
  createGame() {
    const game = this.getGame();
    game.startGame();
    this.emitToEveryoneGameState();
  }

  getGame() {
    return this.mGame;
  }

  hasGame() {
    return this.getGame() ? true : false;
  }

  setGame(game) {
    this.mGame = game;
  }

  getConfig() {
    return this.mConfigs;
  }



  /*******************************************************
   *                      Serialize
   *******************************************************/
  serialize() {
    return {
      id: this.getId(),
      code: this.getCode(),
      personCount: this.mPeople.count(),
      configs: this.getConfig().serialize(),
    }
  }
}
