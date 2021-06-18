const PersonContainer = require('../containers/Person');
const ChatTranscript = require('./Chat/Transcript');
module.exports = class Connection 
{

  static MODE_SETUP = 'setup';
  static MODE_SESSION = 'session';

  constructor(data={})
  {
    this.mId = data.id || 0;
    this.mCode = data.code || 'default';
    this.mPeople = new PersonContainer();
    this.mChat = new ChatTranscript();
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

  getPeople(){
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



  /*******************************************************
   *                        Chat
   *******************************************************/
  getChat()
  {
    return this.mChat;
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
    }
  }
}
