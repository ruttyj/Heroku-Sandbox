const OrderedMap = require('../lib/OrderedMap');

module.exports = class Person
{
  static STATUS_CONNECTED = 'connected';
  static STATUS_DISCONNECTED = 'disconnected';

  static TYPE_HOST = 'host';
  static TYPE_MEMBER = 'member';

  static IS_READY = 'ready';

  constructor(data)
  {
    this.mId = data.id || null;
    this.mName = data.name || "";
    this.mConnection = null;
    
    this.mTags = new OrderedMap();
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

  // Is Ready ------------------------------
  getIsReady()
  {
    return this.mIsReady;
  }

  setIsReady(value)
  {
    this.mIsReady = true;
  }

  // Connection --------------------------
  connect(connection)
  {
    connection.setPersonId(this.getId());

    this.removeTag(Person.STATUS_DISCONNECTED);
    this.addTag(Person.STATUS_CONNECTED);

    this.mConnection = connection;
  }

  getConnection()
  {
    return this.mConnection;
  }

  disconnect()
  {
    const connection = this.getConnection();
    connection.setPersonId(null);

    this.removeTag(Person.STATUS_CONNECTED);
    this.addTag(Person.STATUS_DISCONNECTED);

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
  

  // Tags -----------------------------------
  addTag(tag)
  {
    this.mTags.add(tag);
  }
  
  hasTag(tagKey)
  {
    return this.mTags.has(tagKey);
  }

  removeTag(tagKey)
  {
    const tag = this.mTags.get(tagKey);
    this.mTags.remove(tagKey);

    return tag;
  }

  getTags()
  {
    return this.mTags.toArray();
  }
  
  // Serialize ------------------------------
  serialize()
  {
    return {
      id:         this.mId,
      tags:       this.getTags(),
      name:       this.mName,
      socketId:   this.getSocketId(),
    }
  }
}