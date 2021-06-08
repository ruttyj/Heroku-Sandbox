module.exports = class Connection 
{
  constructor(data)
  {
    this.mId = data.id || null;
    this.mType = data.type || null;
    this.mRoomCode = data.roomCode || null;
    this.mName = data.name || "";
    this.mConnection = 'connected';
  }

  // Id ---------------------------------
  getId()
  {
    return this.mId;
  }

  setId(value)
  {
    this.mId = value;
  }


  // Status ------------------------------
  getStatus()
  {
    return this.mStatus;
  }

  setStatus(value)
  {
    this.mStatus = value;
  }

  // Type ------------------------------
  getType()
  {
    return this.mType;
  }

  setType(value)
  {
    this.mType = value;
  }

  // Name ------------------------------
  getName()
  {
    return this.mName;
  }

  setName(value)
  {
    this.mName = value;
  }

  // RoomCode ------------------------------
  getRoomCode()
  {
    return this.mRoomCode;
  }

  setRoomCode(value)
  {
    this.mRoomCode = value;
  }


  // Connection --------------------------
  connect(connection)
  {
    connection.setPersonId(this.getId());
    this.mConnection = connection;
  }

  getConnection()
  {
    return this.mConnection;
  }

  disconnect()
  {
    this.mConnection = null;
  }


  // Socket ------------------------------
  getSocket()
  {
    const connection = this.getConnection();
    if (connection) {
      return connection.getSocket();
    }
    return null;
  }

  hasSocket()
  {
    return this.getSocket() !== null;
  }

  getSocketId()
  {
    const connection = this.getConnection();
    if (connection) {
      const socket = connection.getSocket();
      if (socket) {
        return socket.id;
      }
    }
    return null;
  }

  emit(eventType, payload)
  {
    const socket = this.getSocket();
    if (socket) {
      socket.emit(eventType, payload);
      return true;
    }
    return false;
  }

  serialize()
  {
    return {
      id:         this.mId,
      roomCode:   this.mRoomCode,
      status:     this.mStatus,
      type:       this.mType,
      name:       this.mName,
      socketId:   this.getSocketId(),
    }
  }
}