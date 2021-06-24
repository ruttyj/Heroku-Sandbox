const Connection = require('../../models/Connection');

module.exports = class ConnectionManager 
{
  constructor() {
    this.mConnections = new Map();
    this.mTopId = 0;
  }

  makeConnection(id = '') {
    const connection = new Connection();
    let connectionId = id;
    if (!connectionId)
      connectionId = String(++this.mTopId);
    
    connection.setId(connectionId);
    this.mConnections.set(connectionId, connection);
    return connection;
  }

  destroyConnection(id) {
    if (this.mConnections.has(id)) {
      this.mConnections.delete(id);
    }
  }

  getConnection(connectionId) {
    if (this.mConnections.has(connectionId)) {
      return this.mConnections.get(connectionId);
    } else {
      return null;
    }
  }

  count() {
    return this.mConnections.size;
  }

  serialize() {
    const connectionKeys = [...this.mConnections.keys()];
    const connections = this.mConnections;
    return {
      connectionIds: connectionKeys,
      connections: connectionKeys.map((key) => {
        const connection = connections.get(key);
        if (connection)
          return connection.serialize();
        return null;
      }).filter((x) => x),
    }
  }
}
