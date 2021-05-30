module.exports = class Connection 
{
  constructor(data)
  {
    this.mId = data.id || null;
    this.mType = data.type || null;
    this.mRoomCode = data.roomCode || null;
    this.mName = data.name || "";
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

  // Name ------------------------------
  getName()
  {
    return this.mName;
  }

  setName(value)
  {
    this.mName = value;
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

  // RoomCode ------------------------------
  getRoomCode()
  {
    return this.mRoomCode;
  }

  setRoomCode(value)
  {
    this.mRoomCode = value;
  }

  serialize()
  {
    return {
      id:       this.mId,
      type:     this.mType,
      roomCode: this.mRoomCode,
      name:     this.mName,
    }
  }
}