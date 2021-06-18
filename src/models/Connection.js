module.exports = class Connection 
{
  static TYPE_LOBBY = 'lobby';
  static TYPE_REGISTER = 'register';
  static TYPE_PICK_ROOM = 'pickRoom';

  constructor()
  {
    this.mId = '0';
    this.mType = 'default';
    this.mApp = null;
    this.mSocket = null;
    this.mRoomId = null;
    this.mPersonId = null;
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
   *                         Type
   *******************************************************/
  setType(value)
  {
      this.mType = value;
  }

  getType()
  {
      return this.mType;
  }

  /*******************************************************
   *                         Socket
   *******************************************************/
  setSocket(value)
  {
      this.mSocket = value;
  }

  getSocket()
  {
      return this.mSocket;
  }

  emit(eventKey, data)
  {
    const socket = this.getSocket();
    if (socket) {
      socket.emit(eventKey, data);
    }
  }

  /*******************************************************
   *                       App
   *******************************************************/
  setApp(value)
  {
    this.mApp = value;
  }

  getApp()
  {
    return this.mApp;
  }

  getService(serviceKey)
  {
    return this.getApp().getService(serviceKey);
  }

  /*******************************************************
   *                         Room
   *******************************************************/
  setRoomId(value)
  {
    this.mRoomId = value;
  }

  getRoomId()
  {
    return this.mRoomId;
  }

  getRoom()
  {
    let roomId = this.getRoomId();
    if (roomId) {
      const app = this.getApp();
      const roomManager = app.getManager('room');
      return roomManager.get(roomId);
    }
    
    return null;
  }

  /*******************************************************
   *                         Person
   *******************************************************/
  setPersonId(value)
  {
    this.mPersonId = value;
  }

  getPersonId()
  {
    return this.mPersonId;
  }

  getPerson()
  {
    let personId = this.getPersonId();
    if (personId) {
      const app = this.getApp();
      const personManager = app.getManager('person');
      return personManager.get(personId);
    }
    
    return null;
  }


  /*******************************************************
   *                      Serialize
   *******************************************************/
  serialize()
  {
    return {
      id: this.getId(),
      type: this.getType(),
      personId: this.getPersonId(),
      roomId: this.getRoomId(),
    }
  }
}
