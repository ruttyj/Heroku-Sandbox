const Person = require('../models/Person');

module.exports = class 
{
  constructor(app)
  {
    this.mList = new Map();
    this.mTopId = 0;
  }

  make(data={})
  {
    const model = this.create(data);
    this.store(model);
    return model;
  }

  get(id)
  {
    if (this.mList.has(id))
      return this.mList.get(id);
    return null; 
  }

  create(data={})
  {
    return new Person(data);
  }

  store(model)
  {
    let id = this.getOrAssignId(model);
    this.mList.set(id, model);
  }

  remove(id) 
  {
    this.mList.delete(id);
  }

  isValidId(id)
  {
    return id != 0 && id
  }

  getOrAssignId(model)
  {
    let id = model.getId();
    if (!this.isValidId(id)) {
      id = ++this.mTopId;
      model.setId(id);
    }
    return id;
  }
  
}