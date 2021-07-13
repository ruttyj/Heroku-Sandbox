module.exports = class RoomLobby 
{
  constructor()
  {
    this.mReadyPeople = new Map();
  }

  setPersonIsReady(personId, value=true)
  {
    this.mReadyPeople.set(personId, value);
  }

  

}