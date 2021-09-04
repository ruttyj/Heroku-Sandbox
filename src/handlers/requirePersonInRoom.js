const RequireConnectedToRoom = require('../handlers/Room/RequireConnected');
const RequireRegistered = require('../handlers/Room/Person/RequireRegistered');
const requirePersonInRoom = (next = null) => new RequireConnectedToRoom(new RequireRegistered(next));

module.exports = requirePersonInRoom;