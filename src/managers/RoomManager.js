const Room = require('../models/Room');
const RamStorageManager = require('./RamStorageManager');
module.exports = class extends RamStorageManager
{
  constructor(app)
  {
    super();
    this.mCodeToId = new Map();
  }

  create(data)
  {
    return new Room(data);
  }


  store(model)
  {
    let id = this._getOrAssignId(model);
    let code = model.getCode();
    
    this.mCodeToId.set(code, id);
    this.mList.set(id, model);
  }

  existsCode(code)
  {
    return this.mCodeToId.has(code);
  }

  getIdForCode(code)
  {
    return this.mCodeToId.get(code);
  }

  getByCode(code)
  {
    let id = this.getIdForCode(code);
    return this.get(id);
  }

  remove(id) 
  {
    if (this.has(id)) {
      let model = this.get(id);
      let code = model.getCode();
      this.mCodeToId.remove(code);
    }
    this.mList.remove(id);
  }
}