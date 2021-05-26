module.exports = class Connection 
{
  constructor()
  {
    this.mId = '0';
    this.mApp = null;
    this.mSocket = null;
    this.mRoom = null;
    this.mPerson = null;
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
  setRoom(value)
  {
    this.mRoom = value;
  }

  getRoom()
  {
    return this.mRoom;
  }


  /*******************************************************
   *                         Person
   *******************************************************/
  setPerson(value)
  {
    this.mPerson = value;
  }

  getPerson()
  {
    return this.mPerson;
  }


  /*******************************************************
   *                      Serialize
   *******************************************************/
  serialize()
  {
    return {
      id: this.getId(),
      room: this.getRoom().getCode(),
      person: this.getPerson().serialize(),
    }
  }
}
