module.exports = class Connection 
{
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
